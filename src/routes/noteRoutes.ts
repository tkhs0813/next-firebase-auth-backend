import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controller/noteController";
import { verifyIdToken } from "../middleware/verifyIdToken";

const router = express.Router();

router.post("/", verifyIdToken, createNote);
router.get("/", verifyIdToken, getAllNotes);
router.get("/:id", verifyIdToken, getNoteById);
router.put("/:id", verifyIdToken, updateNote);
router.delete("/:id", verifyIdToken, deleteNote);

export default router;
