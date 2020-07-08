const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const bodyparser = require('body-parser');
const { promisify } = require('util')
const app = express();

app.use (bodyparser.urlencoded({ extended: false}));
app.use(bodyparser.json());

const clientId = "0oajkviq2mBCPQEAL4x6";
const oktaDomain = "https://dev-381442.okta.com";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${oktaDomain}/oauth2/default`,
  clientId: clientId
});

const port = 3000;

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.listen(port, () => console.log(`My App listening on port ${port}!`))

$.getJSON('http://www.mocky.io/v2/5808862710000087232b75ac', function(clientsobj) {
    //Get all user data
    app.get('/clients', verifyToken, (req, res) => {
      oktaJwtVerifier.verifyAccessToken(req.token)
    .then(jwt => {
        res.json({ ok: true, clientsobj});
      })
      .catch(err => {
        res.sendStatus(403);
      });
    });

    //- Get user data filtered by user name -> Can be accessed by users with role "users" and "admin"
    app.get('/client/name/:name', verifyToken, (req, res) => {
      oktaJwtVerifier.verifyAccessToken(req.token)
    	.then(jwt => {
      const { name } = req.params;
    const client = clientsobj.clients.filter((client) => client.name === name)[0];
    if (client != null)
    {
        if (client.role == "admin" || client.role == "user")
        {
            res.json({ ok: true, client});
            console.log("ADMIN OR OWNER APPROVED");
        } else {
            console.log("NOT ADMIN OR OWNER");
        }
        console.log("USER FOUND BY NAME");
    } else {
        console.log("USER NOT FOUND BY NAME");
    }   
    })
    .catch(err => {
      res.sendStatus(403);
    });
  });
  
    //Get user data filtered by user id -> Can be accessed by users with role "users" and "admin"
    app.get('/client/id/:id', verifyToken, (req, res) => {
      oktaJwtVerifier.verifyAccessToken(req.token)
    .then(jwt => {
        const { id } = req.params;
        const client = clientsobj.clients.filter((client) => client.id === id)[0];
        if (client != null)
        {
            if (client.role == "admin" || client.role == "user")
            {
                res.json({ ok: true, client});
                console.log("ADMIN OR OWNER APPROVED");
            } else {
                console.log("NOT ADMIN OR OWNER");
            }
            console.log("USER FOUND BY ID");
        } else {
            console.log("USER NOT FOUND BY ID");
        }
      })
      .catch(err => {
        res.sendStatus(403);
      });   
    });

    //- Get the list of policies linked to a user id -> Can be accessed by users with role "admin" and by the own user
    $.getJSON('http://www.mocky.io/v2/580891a4100000e8242b75c5', function(policiesobj) {
        app.get('/client/policy/:name/:id', verifyToken, (req, res) => {
          oktaJwtVerifier.verifyAccessToken(req.token)
            .then(jwt => {
            const { id } = req.params;
            const { name } = req.params;
            const client = clientsobj.clients.filter((client) => client.name === name)[0];
            const clientid = clientsobj.clients.filter((clientid) => clientid.id === id)[0];
                if (client.role == "admin" || client.name == name)
                {
                    if (clientid != null)
                    {
                        const filteredpolicy = (policiesobj.policies.filter(function(item){
                            return item.clientId == id; 
                        }));
                        res.json({ ok: true, filteredpolicy});
                        console.log("POLICY FOUND BY ID");
                    } else {
                        console.log("POLICY NOT FOUND BY ID");
                    }              
                    console.log("ADMIN OR OWNER APPROVED");    
                } else {
                    console.log("NOT ADMIN OR OWNER");
                }    
        });
    });
  })
  .catch(err => {
    res.sendStatus(403);
  });
});