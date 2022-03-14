const constants = {
  defaultServerResponse: {
    status: 400,
    message: "",
    body: {},
  },
  noteMessage: {
    NOTE_CREATED: "Note Created Successfully",
    NOTE_FETCHED: "Note Fetched Successfully",
    NOTE_UPDATED: "Note Updated Successfully",
    NOTE_DELETED: "Note Deleted Successfully",
    NOTE_NOT_FOUND: "Note Not Found",
  },
  requestValidationMessage: {
    BAD_REQUEST: "Invalid fields",
    TOKEN_MISSING: "Token missing from header",
  },
};

export default constants;
