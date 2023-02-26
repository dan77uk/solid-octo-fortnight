const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

const projectSchema = new mongoose.Schema({
  project_id: Number,
  project_title: String,
  project_owner: Number,
  title: String,
  body: String,
  lane: Number,
});

projectSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Project", projectSchema);
