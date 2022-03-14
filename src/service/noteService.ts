import { validate } from "class-validator";
import { DeleteResult, getRepository } from "typeorm";
import { Note } from "../entity/Note";

type NoteBody = {
  title: string;
  body: string;
};

const createNote = async (
  { title, body }: NoteBody,
  uid: string
): Promise<Note> => {
  try {
    const note = new Note();
    note.title = title;
    note.body = body;
    note.uid = uid;

    const noteRepository = getRepository(Note);

    const errors = await validate(note);
    if (errors.length > 0) {
      throw new Error("validation error");
    }

    const result = await noteRepository.save(note);
    return result;
  } catch (error) {
    console.log("Something went wrong: Service: createNote", error);
    throw new Error(error);
  }
};

const getAllNotes = async (uid: string): Promise<Note[]> => {
  try {
    const noteRepository = getRepository(Note);
    const notes = await noteRepository.find({
      select: ["id", "title", "body", "created_at", "updated_at"],
      where: {
        uid: uid,
      },
      order: {
        created_at: "DESC",
      },
    });

    return notes;
  } catch (error) {
    console.log("Something went wrong: Service: getAllNotes", error);
    throw new Error(error);
  }
};

const getNoteById = async (id: string): Promise<Note> => {
  try {
    const noteRepository = getRepository(Note);
    const note = await noteRepository.findOneOrFail(id);

    return note;
  } catch (error) {
    console.log("Something went wrong: Service: getNoteById", error);
    throw new Error(error);
  }
};

const updateNote = async (
  id: string,
  { title, body }: NoteBody
): Promise<Note> => {
  try {
    const noteRepository = getRepository(Note);
    const tmpNote = await noteRepository.findOneOrFail(id);
    tmpNote.title = title;
    tmpNote.body = body;

    const note = await noteRepository.save(tmpNote);

    return note;
  } catch (error) {
    console.log("Something went wrong: Service: updateNote", error);
    throw new Error(error);
  }
};

const deleteNote = async (id: string): Promise<DeleteResult> => {
  try {
    const noteRepository = getRepository(Note);
    const note = await noteRepository.delete(id);

    return note;
  } catch (error) {
    console.log("Something went wrong: Service: deleteNote", error);
    throw new Error(error);
  }
};

export default {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
