import * as crypto from "crypto";
import Joi = require("joi");
import uuid = require("uuid");

export interface StoredDocument {
  id: string;
  hash: string;
  documentId: string;
}

export const storedDocumentSchema = Joi.object({
  id: Joi.string().required(),
  hash: Joi.string().required(),
  documentId: Joi.string(),
});

export interface UploadedDocument {
  id: string;
  base64: string;
  fileName: string;
}

export const uploadedDocumentSchema = Joi.object({
  id: Joi.string().required(),
  base64: Joi.string().required(),
  fileName: Joi.string(),
});

export async function hashDocument(document: UploadedDocument): Promise<StoredDocument> {
  return hashBase64String(document.base64).then((hashValue) => ({
    id: document.id,
    hash: hashValue,
    documentId: uuid.v4(),
  }));
}

async function hashBase64String(base64String: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(base64String, "base64"));
    resolve(hash.digest("hex"));
  });
}
