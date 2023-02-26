const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  project_id: {
    type: Number,
    required: true,
  },
  project_title: {
    type: String,
    required: true,
  },
  project_owner: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 10,
  },
  body: {
    type: String,
    required: true,
  },
  lane: {
    type: Number,
    required: true,
  },
});

projectSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Project", projectSchema);
