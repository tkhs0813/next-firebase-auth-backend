import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import constants from "../constants";

export const verifyIdToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response = { ...constants.defaultServerResponse };
  const errorMessage = "Token missing from header";
  try {
    if (!req.headers.authorization) {
      throw new Error(errorMessage);
    }

    const idToken = req.header("Authorization");
    if (!idToken) {
      throw new Error(errorMessage);
    }

    await admin.auth().verifyIdToken(idToken);

    return next();
  } catch (error) {
    if (error instanceof Error) {
      response.message = error.message;
      response.status = 401;
    }
  }
  return res.status(response.status).send(response);
};
