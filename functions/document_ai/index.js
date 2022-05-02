const express = require('express');
const app = express();
const port = 5000;
const serviceAccount = require("./sa.json");

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



