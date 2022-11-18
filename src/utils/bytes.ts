import * as crypto from "crypto";

export const getRandomBytes =
  async (size: number) => crypto.randomBytes(size);

export const bufferToBase64 = (buffer: ArrayBuffer | Uint8Array) => {
  const base64String = Buffer.from(buffer).toString("base64");
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const sha256 = async (text: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(text);

  return hash.digest();
};