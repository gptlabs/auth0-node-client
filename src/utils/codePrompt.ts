import prompts from "prompts";
import { platform } from "os";
import chalk from "chalk";

export let DEFAULT_SHELL = "bash";

switch (platform()) {
  case "darwin":
    DEFAULT_SHELL = "zsh";
    break;
  case "win32":
    DEFAULT_SHELL = "cmd";
    break;
}

/* eslint-disable no-console */
export const codePrompt = async (url: string) => {
  console.groupCollapsed();
  console.log();
  console.log("Open this URL and copy the code received after authorization:")
  console.log(chalk.underline(url));
  const { code }  = await prompts({
    type: "text",
    name: "code",
    message: "Paste the code received after authorization: ",
    initial: DEFAULT_SHELL,
    hint: "Example: bxZ8PHffQOeqf0r2HpCyaAnSeOzByDKjquTUsPVPfrH2f",
  });
  console.log();
  console.groupEnd();
  return code;
};