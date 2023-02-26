require("dotenv").config();
const express = require("express");
const app = express();
const Project = require("./models/project");
const cors = require("cors");

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${request.body}`);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/projects", (request, response) => {
  Project.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/projects/:id", (request, response, next) => {
  Project.findById(request.params.id)
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/projects/:id", (request, response) => {
  Project.findOneAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/projects", (request, response) => {
  const body = request.body;

  if (
    body.project_id === undefined ||
    body.project_title === undefined ||
    body.owner_id === undefined ||
    body.title === undefined ||
    body.content === undefined ||
    body.lane === undefined
  ) {
    return response.status(400).json({ message: "Content Missing" });
  }

  const project = new Project({
    project_id: body.project_id,
    project_title: body.project_title,
    project_owner: body.owner_id,
    title: body.title,
    body: body.content,
    lane: body.lane,
  });

  project.save().then((result) => {
    response.json(result);
  });
});

// * Move a project between lanes
app.patch("/api/projects/:id/changeLane", (request, response) => {
  const { lane } = request.body;

  Project.findByIdAndUpdate(request.params.id, { lane: lane }, { new: true })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
