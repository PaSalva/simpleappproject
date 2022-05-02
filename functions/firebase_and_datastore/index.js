const express = require('express');
const { Datastore } = require('@google-cloud/datastore');
const app = express();
const port = 5000;
const serviceAccount = require("./sa.json");
const admin = require("firebase-admin");

/**
 * For local developer
 */
app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});
app.get('/get_older', function (req, res) {
  get_older(req, res);
});
app.get('/create', function (req, res) {
  create_user(req, res);
});
app.get('/add', function (req, res) {
  add_persona(req, res);
});

/**
 * 
 * Functions
 * 
 */
function get_older(req, res) {
  if (typeof req.query.edad !== 'undefined') {
    let edad = req.query.edad;
    const datastore = new Datastore({
      keyFilename: './sa.json'
    });
    var message = "";

    const query = datastore.createQuery('persona').filter('edad', '>', parseInt(edad));
    datastore
      .runQuery(query)
      .then(results => {
        const tasks = results[0];
        if (tasks.length == 0) {
          message = "No hay personas con edad mayor a " + edad;
        } else {
          console.log(tasks.length);
          tasks.forEach(task => {
            message += " || " + task.nombre + " --> \n" + task.edad;
          });
        }
        res.status(200).send(message);

      })
      .catch(err => {
        console.error('ERROR:', err);
      });

  } else {
    res.status(200).send("You are missing \"edad\" parameter");
  }
}

function add_persona(req, res) {
  if (typeof req.query.edad !== 'undefined' && typeof req.query.nombre !== 'undefined') {
    let entity = {
      nombre: req.query.nombre,
      edad: req.query.edad,
    };
    const datastore = new Datastore({
      keyFilename: './sa.json'
    });
    const taskKey = datastore.key('persona');
    const persona = {
      key: taskKey,
      data: entity,
    };

    datastore.insert(persona).then(() => {
      res.status(200).send("Persona añadida correctamente");
    }).catch(err => {
      console.error('ERROR al añadir la persona:', err);
    });


  } else {
    res.status(200).send("You are missing \"nombre\" y \"edad\" parameters");
  }
}

function create_user(req, res) {
  if (typeof req.query.user !== 'undefined' && typeof req.query.pass !== 'undefined') {
    let user = req.query.user,
      pass = req.query.pass;

    // Check if the Firebase app already exists  
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }

    admin.auth().createUser({
      email: user,
      emailVerified: false,
      password: pass,
      disabled: false
    })
      .then(function (userRecord) {
        const okMessage = `Successfully created new user: ${JSON.stringify(userRecord)}`;
        console.log('Successfully created new user:', userRecord.uid);
        res.status(200).send(okMessage);
      })
      .catch(function (error) {
        console.log('Error creating new user:', error);
      });

  } else {
    res.status(200).send("You need to add user and pass to the URL");
  }
}


/**
 * Endpoints 
 */
const routes = {
  GET: {
    "/get_older": (req, res) => {
      get_older(req, res);
    },
    "/add": (req, res) => {
      add_persona(req, res);
    },
    "/create": (req, res) => {
      create_user(req, res);
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



