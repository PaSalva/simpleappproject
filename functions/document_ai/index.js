const express = require('express');
const app = express();
const port = 5000;
const serviceAccount = require("./sa.json");
const fs = require('fs');


/**
 * For local developer
 */
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
app.get('/vision', function (req, res) {
  vision();
});
app.get('/doc', function (req, res) {
  document_ai();
});
/**
 * 
 * Functions
 * 
 */

async function document_ai() {
  const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
  const documentaiClient = new DocumentProcessorServiceClient({
    keyFilename: './sa.json'
  });

  // TODO: Complete this. Don't push to the repo
  let projectId = "project-id"
  let location = "eu"
  let processorId = "process-ID"
  const resourceName = documentaiClient.processorPath(projectId, location, processorId);
  console.log(resourceName);
  // Read the file into memory.
  localFilePath = "./form.pdf"
  const imageFile = fs.readFileSync(localFilePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString('base64');

  // Load Binary Data into Document AI RawDocument Object
  const rawDocument = {
    content: encodedImage,
    mimeType: 'application/pdf',
  };

  // Configure ProcessRequest Object
  const request = {
    //name: resourceName,
    rawDocument: rawDocument
  };
  // Use the Document AI client to process the sample form
  const [result] = await documentaiClient.processDocument(request);
  console.log(result);
  console.log(result.text);
  return result.document;

}



async function vision() {
  const vision = require("@google-cloud/vision");
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './sa.json'
  });

  const localPath = "./form.pdf";
  await client
    .labelDetection(localPath)
    .then((results) => {
      console.log(results);
      const labels = results[0].labelAnnotations;
      console.log("labels: ");
      labels.forEach(
        (label) =>
          console.log(label.description)
      );
    })
    .catch((err) => {
      console.error("Error al procesar el documento: ", err);
    });

}
/**
 * Endpoints 
 */
const routes = {
  GET: {
    "/doc": (req, res) => {
      document_ai(req, res);
    },
    "/vision": (req, res) => {
      vision(req, res);
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



