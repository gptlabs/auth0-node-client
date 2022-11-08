/* eslint-disable no-console */
export const openBrowserLog = (title: string, url: string) => {
  console.groupCollapsed();
  console.log();
  console.log(title);
  console.log();
  console.log(url);
  console.log();
  console.groupEnd();
};