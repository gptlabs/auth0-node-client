import { AuthConfig, login } from "../src";
import test from "ava";

test("should be able to login", async (t) => {
  if (process.env.CI) {
    return t.pass();
  }

  const config: AuthConfig = {
    domain: "gptlabs.us.auth0.com",
    redirectUri: "http://localhost:42069",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/"
  };

  const test = await login(config);
  t.truthy(test);
});