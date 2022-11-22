/* eslint-disable no-console */
import { Auth0NodeClient } from "../../../src/Auth0NodeClient";

const auth0Client = new Auth0NodeClient({
  domain: "gptlabs.us.auth0.com",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/"
});

await auth0Client.authorize();
// console.log({ user });