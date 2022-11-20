import prompts from "prompts";
import chalk from "chalk";

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
    initial: "",
    hint: "Example: bxZ8PHffQOeqf0r2HpCyaAnSeOzByDKjquTUsPVPfrH2f",
  });
  console.log();
  console.groupEnd();
  return code;
};