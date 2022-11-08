/* eslint-disable no-console */
import test from "ava";

test.serial("should be able to login", async (t) => {
  if (process.env.CI) {
    return t.pass();
  }

  const { Auth0NodeClient } = await import("../src");
  const auth0Client = new Auth0NodeClient({
    domain: "gptlabs.us.auth0.com",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/",
    // postLoginRedirect: "https://google.com",
  });

  const user = await auth0Client.login();
  console.log({ user });
  t.truthy(user);
});

test.serial("should be able to logout", async (t) => {
  if (process.env.CI) {
    return t.pass();
  }

  const { Auth0NodeClient } = await import("../src");
  const auth0Client = new Auth0NodeClient({
    domain: "gptlabs.us.auth0.com",
    clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
    audience: "https://gptlabs.us.auth0.com/api/v2/"
  });

  await t.notThrowsAsync(auth0Client.logout());
});