if (process.env.CI) {
  process.exit(0);
}

/**
 * First, generate an auth code.
 */
await import("./example/authCode/generate");

/**
  * Then, check that we can redeem it.
  */
await import("./example/authCode/redeem");

export {};