if (process.env.CI) {
  process.exit(0);
}

import { test } from "@tsmodule/test";

await test("should be able to login", async () => {
  await import("./example/login");
});

await test("should be able to logout", async () => {
  await import("./example/logout");
});

export {};