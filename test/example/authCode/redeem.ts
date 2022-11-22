/* eslint-disable no-console */
import prompts from "prompts";
import { Auth0NodeClient } from "../../../src/Auth0NodeClient";

const auth0Client = new Auth0NodeClient({
  domain: "gptlabs.us.auth0.com",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/"
});

const { code } = await prompts({
  type: "text",
  name: "code",
  message: "Enter the code from the browser",
});

await auth0Client.login(code);
// console.log({ user });