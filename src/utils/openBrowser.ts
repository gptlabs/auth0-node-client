import chalk from "chalk";
import open from "open";
import { sleep } from "./misc";

/* eslint-disable no-console */
export const openBrowser = async (url: string) => {
  console.groupCollapsed();
  console.log();
  // console.log("Visit the following link to log:");
  console.log("Attempting to open browser. Please visit this link if it does not open automatically.");
  console.log();
  console.log(chalk.underline(url));
  console.log();
  console.groupEnd();

  await sleep(500);
  await open(url);
  await sleep(500);
};