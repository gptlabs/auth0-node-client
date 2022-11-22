import { log } from "@tsmodule/log";
import { shouldBeTruthy } from "@tsmodule/test";
import { Auth0NodeClient } from "../../src/Auth0NodeClient";

const auth0Client = new Auth0NodeClient({
  domain: "gptlabs.us.auth0.com",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/",
  // postLoginRedirect: "https://google.com",
});

const user = await auth0Client.login();
log(JSON.stringify({ user }, null, 2));
shouldBeTruthy(user);