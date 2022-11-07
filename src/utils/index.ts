import { getRandomValues, subtle } from "crypto";

export const sleep = (ms: number) => new Promise(
  (resolve) => setTimeout(resolve, ms)
);

export const getRandomBytes =
  async (size: number) => getRandomValues(new Uint8Array(size));

export const bufferToBase64 = (buffer: ArrayBuffer | Uint8Array) => {
  const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const sha256 = async (text: string) => {
  return await subtle.digest("SHA-256", Buffer.from(text));
};