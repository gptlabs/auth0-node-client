import { shouldNotThrow } from "@tsmodule/test";
import { Auth0NodeClient } from "../../src";

const auth0Client = new Auth0NodeClient({
  domain: "gptlabs.us.auth0.com",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/"
});

await shouldNotThrow(async () => await auth0Client.logout());