# Controllers #

## auth ##

Authentication is via JWT token.

### Environment variables ###

[Users and passwords](../README.md#USERS) 
[Token signing secret](../README.md#AUTHSECRET) 

### Obtaining a token ###

Send a ` POST ` request to ` /auth ` with a JSON body containing ` user ` and ` pass ` eg...

```js
  {
    "user": "admin-example@dfe.gov.uk",
    "pass": "my_strong_password"
  }

```

If successful then a token will be returned eg...

```js
  {
    "token": "fdjakfdshakj.fdjsfdsafdsfds.fdafdsafdsa"
  }

```

If the supplied details were invalid the response status will be ` 401 ` and the response body will be...

```js
  {
    "success": false,
    "message": "Failed to authenticate."
  }
```


### Making authenticated requests to the API ###

Once a token has been obtained all requests to the API should include a header ` authorization-token ` with the value of the token.

If the request is not authorised then a 403 response code will be received.

