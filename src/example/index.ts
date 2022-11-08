/* eslint-disable no-console */
import { Auth0NodeClient } from "../Auth0NodeClient";

const auth0Client = new Auth0NodeClient({
  domain: "gptlabs.us.auth0.com",
  redirectUri: "http://localhost:42069",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/"
});

const user = await auth0Client.login();
console.log({ user });