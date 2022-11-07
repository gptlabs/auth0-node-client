import test from "ava";
import type { AuthConfig } from "../src";

test("should be able to login", async (t) => {
  if (process.env.CI) {
    return t.pass();
  }

  const { login } = await import("../src");
  const config: AuthConfig = {
    domain: "gptlabs.us.auth0.com",
    redirectUri: "http://localhost:42069",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/"
  };

  const test = await login(config);
  t.truthy(test);
});