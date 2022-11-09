import * as crypto from "crypto";

export const getRandomBytes =
  async (size: number) => crypto.getRandomValues(new Uint8Array(size));

export const bufferToBase64 = (buffer: ArrayBuffer | Uint8Array) => {
  const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const sha256 = async (text: string) => {
  return await crypto.subtle.digest("SHA-256", Buffer.from(text));
};