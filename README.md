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
