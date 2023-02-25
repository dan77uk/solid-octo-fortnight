const express = require("express");
const app = express();

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log(`Method: ${request.method}`);
  console.log(`Path: ${request.path}`);
  console.log(`Body: ${request.body}`);
  console.log("---");
  next();
};

app.use(requestLogger);

let projects = [
  {
    id: 1,
    title: "Build an API",
    date: new Date(),
  },
  {
    id: 2,
    title: "Install Middleware",
    date: new Date(),
  },
  {
    id: 3,
    title: "Run tests",
    date: new Date(),
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World");
});

app.get("/api/projects", (request, response) => {
  response.json(projects);
});

app.get("/api/projects/:id", (request, response) => {
  const id = Number(request.params.id);
  const project = projects.find((project) => project.id === id);
  project
    ? response.json(project)
    : (response.statusMessage = "No Project Found");
  response.status(404).end();
});

app.delete("/api/projects/:id", (request, response) => {
  const id = Number(request.params.id);
  projects = projects.filter((project) => project.id !== id);
  response.status(204).end();
});

app.post("/api/projects", (request, response) => {
  const maxId =
    projects.length > 0 ? Math.max(...projects.map((p) => p.id)) : 0;
  const project = request.body;
  if (!project.title) {
    return response.status(400).json({ message: "Title missing" });
  }
  project.id = maxId + 1;
  project.date = new Date();

  projects = [...projects, project];
  console.log(projects);
  response.json(project);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ message: "Unkown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
