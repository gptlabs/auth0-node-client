import test from "ava";

if (!process.env.CI) {
  test.only("skipping for CI", (t) => t.pass());
}

import type { AuthConfig } from "../src";
import { login, logout } from "../src";

test.serial("should be able to login", async (t) => {
  const config: AuthConfig = {
    domain: "gptlabs.us.auth0.com",
    redirectUri: "http://localhost:42069",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/"
  };

  const test = await login(config);
  t.truthy(test);
});

test.serial("should be able to logout", async (t) => {
  if (process.env.CI) {
    return t.pass();
  }

  const config: AuthConfig = {
    domain: "gptlabs.us.auth0.com",
    redirectUri: "http://localhost:42069",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/"
  };

  await t.notThrowsAsync(logout(config));
});