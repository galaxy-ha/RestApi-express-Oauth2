# Rest API with Bearer Token

Token authentication is the hottest way to authenticate users to your web applications nowadays. There’s a lot of interest in token authentication because it can be faster than traditional session-based authentication in some scenarios, and also allows you some additional flexibility

[Build a Simple App Using Okta for Token Authentication in Node + Express]( https://developer.okta.com/)
---------

 - Once you’re in the Okta dashboard, you will see an Org URL value on the top right of your screen. Save this value somewhere for later use, then click Application on the navigation menu

 - Click Add Application

 - Select Web, then click Next

 - Enter the following settings then click Done
 
 - You will be redirected to the General Settings page. Click Edit, then select the checkbox for Client Credentials (make sure it is checked) and click Save
 
 - You should see Client ID and Client secret when you scroll down, save this information somewhere for later use
 
 Add a Custom Scope
 ----------
 - Select API from the navigation menu, then click Authorization Servers
 - Click the default link
 - Click the Scopes menu
 - Click Add Scope
 - Enter customScope as the name, and add a description, then click Create
 
 Install HTTPie
 -----------
 
 [HTTPie is a user-friendly command line HTTP client. You’ll need it for the rest of this demo, so go ahead and install if you haven’t yet.](https://httpie.org/)
 
 Request a JWT
 ----------
 The way this works is that you need to craft a request that contains an HTTP Authorization header that looks like the following:

Authorization: Basic Base64Encode(<yourClientId>:<yourClientSecret>)

Encode your Client ID and Client secret (join with a : character) to create this header.

You can use [base64encode](https://www.base64encode.org/) to base64 encode these values manually if you’d like to play around with it.
Once you’ve done this, you should have a header field that looks something like this: 
**Authorization: Basic MG9haW94OGJtc0JLXhIYjNjMWJITVdxVlhrdTMwaDc6MktxRQ1FaTWVhdXBvbWdCOXZiNkNPOXBtMnFjSw**

You then need to make a POST API call to your Org URL value (you obtained this in the Okta application setup step) plus /v1/token with the header grant_type=client_credentials.

```CMD
http -f POST https://{yourOktaDomain}/oauth2/default/v1/token 'Authorization: Basic MG9haW94OGJtc0JLXhIYjNjMWJITVdxVlhrdTMwaDc6MktxRQ1FaTWVhdXBvbWdCOXZiNkNPOXBtMnFjSw' grant_type=client_credentials scope=customScope
```
Build an API with Node and Express
--------
 - mkdir authapp
 - cd authapp
 - npm init
 - npm install express@4.16.4
 - npm install @okta/jwt-verifier@0.0.14

 - Create an index.js file in the folder then copy and paste the following code into the file:
 ```javascript
 const express = require('express');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const clientId = "{yourClientId}";
const oktaDomain = "https://{yourOktaDomain}";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${oktaDomain}/oauth2/default`,
  clientId: clientId
});

const app = express();
const port = 3000;

// public route
app.get('/api/publicInfo', (req, res) => {
  res.status(200).send('You are viewing public info');
});

// protected route
app.get('/api/profile', verifyToken, (req, res) => {
  oktaJwtVerifier.verifyAccessToken(req.token)
    .then(jwt => {
      res.send('You are viewing private profile info');
    })
    .catch(err => {
      res.sendStatus(403);
    });
});

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
 ```
 Test Your Node and Express API
 --------
 
  - node index.js
  - http GET :3000/api/publicInfo
  You should see the response **You are viewing public info**.
  - http GET :3000/api/profile
  You should see the response **Forbidden**.
  Now, try again with the access_token you obtained earlier (replace the token part with your token):
  ```CMD
  http GET :3000/api/profile 'Authorization: Bearer eyJraWQiOiJ1dURLVTMxZWRvTi0wd0xMUnl1TW1vbmtBdi1OaFEwejZhWmxjdTN5NU8wIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjZoZS1fbndIcmpmSHl6bjg3bUhNLWNVUnBUNTg3RVFBT2N6Ym1QRTNkSkkiLCJpc3MiOiJodHRwczovL2Rldi04MTk2MzMub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTU0Njc2NDc4OCwiZXhwIjoxNTQ2NzY4Mzg4LCJjaWQiOiIwb2Fpb3g4Ym1zQktWWGt1MzBoNyIsInNjcCI6WyJjdXN0b21TY29wZSJdLCJzdWIiOiIwb2Fpb3g4Ym1zQktWWGt1MzBoNyJ9.fZCRSMASYjQqH-gnqsQ1tJa7QN8UJZ-iPT4UZE6Voq8YsWefpyjjroMlDzkSJZVRm_V47PGLrSu7sg6ranjZTTpx8f_Qk6zfDBfNTxnWpIqKXaotTE-foial9XBSMiyuArTVsbDtHBrb9EwBSqRzBmlI2uRP92bTggxGbgNMWnQukguD_pCGHiSeDN3Jy7R7EpKgSkDpRBhQXHp0Ly6cByUmjsseWEzZdCCiIVJh_m__KEoqX8vUC6xkUYdMHJ4GWH8kPb0Hcao2jkAJBSKQKose8a5vxDS-WwpWO482NyVxNDvxBgCIfn1tG-qL4Vbdxokw41o2M81MoqgdNZGHQA'
  ```

# HOW TO RUN THIS APPLICATION
- git clone 


