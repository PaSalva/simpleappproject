const express = require('express');
const app = express();
const port = 5000;
const serviceAccount = require("./sa.json");
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

/**
 * For local developer
 */
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
app.get('/speech', function (req, res) {
  speech_to_text(req, res);
});

/**
 * 
 * Functions
 * 
 */
async function speech_to_text(req, res) {

  // Creates a client
  const client = new speech.SpeechClient({
    keyFilename: './sa.json'
  });
  const gcsUri = 'gs://csmd-psalva/611_vision/audio02.mp3';

  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: 'es-ES',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
  detectLanguageSample(transcription);
  anonimous(transcription);
  //translatedText = await translateTextSample(transcription, "en");
  //textToSpeech(translatedText);
  //let syntax = await analyzeSyntaxOfText(transcription);
  //res.status(200).send(syntax);

}


async function analyzeSyntaxOfText(text) {
  const language = require('@google-cloud/language');

  // Creates a client
  const client = new language.LanguageServiceClient({
    keyFilename: './sa.json'
  });

  // Prepares a document, representing the provided text
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const encodingType = 'UTF8';
  const [syntax] = await client.analyzeSyntax({ document, encodingType });

  return syntax;
}

async function detectLanguageSample(text) {
  const { Translate } = require('@google-cloud/translate').v2;
  const translate = new Translate({
    keyFilename: './sa.json'
  });


  let [detections] = await translate.detect(text);
  detections = Array.isArray(detections) ? detections : [detections];
  console.log('Detections:');
  detections.forEach(detection => {
    console.log(`${detection.input} => ${detection.language}`);
  });


}

async function translateTextSample(text, target) {

  const { Translate } = require('@google-cloud/translate').v2;

  // Creates a client
  const translate = new Translate({
    keyFilename: './sa.json'
  });
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  return translations;
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });

}

async function textToSpeech(text) {
  const textToSpeech = require('@google-cloud/text-to-speech');
  const fs = require('fs');
  const util = require('util');

  const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './sa.json'
  });

  const outputFile = './output.mp3';

  const request = {
    input: { text: text },
    voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
    audioConfig: { audioEncoding: 'MP3' },
  };
  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
}

async function anonimous(text) {
  const DLP = require('@google-cloud/dlp');

  // Instantiates a client
  const dlp = new DLP.DlpServiceClient({
    keyFilename: './sa.json'
  });

  // TODO: Complete with projectID
  const projectId = '';

  const request = {
    parent: `projects/${projectId}/locations/global`,
    inspectConfig: {
      infoTypes: [{ name: 'PERSON_NAME' }, { name: 'US_STATE' }],
      minLikelihood: 'LIKELIHOOD_UNSPECIFIED',
      limits: {
        maxFindingsPerRequest: 0,
      },
      includeQuote: true,
    },
    item:  { value: text },
  };

  // Run request
  const [response] = await dlp.inspectContent(request);
  const findings = response.result.findings;
  if (findings.length > 0) {
    console.log('Findings:');
    findings.forEach(finding => {
      if (includeQuote) {
        console.log(`\tQuote: ${finding.quote}`);
      }
      console.log(`\tInfo type: ${finding.infoType.name}`);
      console.log(`\tLikelihood: ${finding.likelihood}`);
    });
  } else {
    console.log('No findings.');
  }

}


/**
 * Endpoints 
 */
const routes = {
  GET: {
    "/speech": (req, res) => {
      speech_to_text(req, res);
    }
  },
};

exports.main = (req, res) => {
  if (routes[req.method] && routes[req.method][req.path]) {
    return routes[req.method][req.path](req, res);
  }

  res.status(404).send({
    error: `${req.method}: '${req.path}' not found`
  });
};



