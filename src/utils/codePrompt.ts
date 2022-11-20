import prompts from "prompts";
import chalk from "chalk";

/* eslint-disable no-console */
export const codePrompt = async (url: string) => {
  console.group();
  console.log();
  console.log("Open this URL and copy the code received after authorization:");
  console.log(chalk.underline(url));
  console.log();
  console.groupEnd();

  const { code }  = await prompts({
    type: "text",
    name: "code",
    message: "Paste",
    initial: "",
    hint: "Example: bxZ8PHe3QOeqf0r2HpCyaAnSeOzByDKjquTUsPVPfrH2f",
  });

  return code;
};
