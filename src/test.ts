import { AuthConfig, login } from "./login";

const config: AuthConfig = {
  domain: "gptlabs.us.auth0.com",
  redirectUri: "http://localhost:42069",
  clientId: "I3rJAbl7D09DuYG6dGeYWtBtpuGyeZrI",
  audience: "https://gptlabs.us.auth0.com/api/v2/"
};

await login(config);