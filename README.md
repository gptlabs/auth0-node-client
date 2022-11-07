# Auth0 Node Login

A library for authenticating users of a Node program with traditional
browser-based Auth0 authorization flow. Recommended especially for CLIs.

  - `login(config)` will log the authorization URL to the console and open the
  browser window directly if possible. 

  - `logout(config)` will function similarly while clearing the session.

### Caching

Access tokens will automatically be cached on disk and cleared once they expire.
Calls to `login(config)` will resolve instantly when the cache is valid.

### Acknowledgements

Thanks to @altostra, @yevk, and @ShlomiAltostra for their work on
[`altostra-cli-login-auth0`](https://github.com/altostra/altostra-cli-login-auth0),
which no longer works but was helpful for reference on browser opening.

### Disacknowledgments

Unthanks to the Auth0 team for making myself and others have to write this
(several times now) rather than just doing it themselves. 