import { log } from "@tsmodule/log";
import open from "open";
import { sleep } from "./misc";

/* eslint-disable no-console */
export const openBrowser = async (url: string) => {
  log("Attempting to open browser. Please visit this link if it does not open automatically.");
  log(url, ["underline"]);

  try {
    await sleep(500);
    await open(url);
    await sleep(500);
  } catch (e) {
    log("Unable to open browser automatically. Please visit the link above.");
  }
};