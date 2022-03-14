/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response } from "express";
import admin from "firebase-admin";
import { Note } from "../entity/Note";
import noteService from "../service/noteService";
import constants from "../constants";

interface CustomRequest<T, K> extends Request<K> {
  body: T;
}

export const createNote = async (
  req: CustomRequest<
    {
      title: string;
      body: string;
    },
    any
  >,
  res: Response
): Promise<Response<any>> => {
  const response = { ...constants.defaultServerResponse };

  try {
    const idToken = req.header("Authorization");
    if (!idToken) throw new Error("idToken is not defined;");
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const responseFromService = await noteService.createNote(req.body, uid);
    response.status = 200;
    response.message = constants.noteMessage.NOTE_CREATED;
    response.body = responseFromService;
  } catch (error) {
    console.log("Something went wrong: Controller: createNote", error);
    response.status = 400;
    response.message = error.toString();
    response.body = {};
  }

  return res.status(response.status).send(response);
};

export const getAllNotes = async (
  req: Request,
  res: Response
): Promise<Response<any>> => {
  const response = { ...constants.defaultServerResponse };

  try {
    const idToken = req.header("Authorization");
    if (!idToken) throw new Error("idToken is not defined;");
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const responseFromService = await noteService.getAllNotes(uid);

    response.status = 200;
    response.message = constants.noteMessage.NOTE_FETCHED;
    response.body = responseFromService;
  } catch (error) {
    console.log("Something went wrong: Controller: getAllNotes", error);
    response.status = 400;
    response.message = error.toString();
    response.body = {};
  }

  return res.status(response.status).send(response);
};

export const getNoteById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response<any>> => {
  const response = { ...constants.defaultServerResponse };

  try {
    const idToken = req.header("Authorization");
    if (!idToken) throw new Error("idToken is not defined;");
    const { uid } = await admin.auth().verifyIdToken(idToken);

    const responseFromService = await noteService.getNoteById(req.params.id);

    response.status = 200;
    response.message = constants.noteMessage.NOTE_FETCHED;
    response.body = responseFromService;
  } catch (error) {
    console.log("Something went wrong: Controller: getNoteById", error);
    response.status = 400;
    response.message = error.toString();
    response.body = {};
  }

  return res.status(response.status).send(response);
};

export const updateNote = async (
  req: CustomRequest<Note, { id: string }>,
  res: Response
): Promise<Response<any>> => {
  const response = { ...constants.defaultServerResponse };

  try {
    const idToken = req.header("Authorization");
    if (!idToken) throw new Error("idToken is not defined;");

    const responseFromService = await noteService.updateNote(
      req.params.id,
      req.body
    );

    response.status = 200;
    response.message = constants.noteMessage.NOTE_UPDATED;
    response.body = responseFromService;
  } catch (error) {
    console.log("Something went wrong: Controller: noteCategory", error);
    response.status = 400;
    response.message = error.toString();
    response.body = {};
  }

  return res.status(response.status).send(response);
};

export const deleteNote = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response<any>> => {
  const response = { ...constants.defaultServerResponse };

  try {
    const responseFromService = await noteService.deleteNote(req.params.id);
    response.status = 200;
    response.message = constants.noteMessage.NOTE_DELETED;
    response.body = responseFromService;
  } catch (error) {
    console.log("Something went wrong: Controller: deleteNote", error);
    response.status = 400;
    response.message = error.toString();
    response.body = {};
  }

  return res.status(response.status).send(response);
};
