const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

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
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Fix navigation bug",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque egestas dictum libero, vel tristique odio pulvinar vitae.",
    lane: 4,
  },
  {
    id: 2,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Release new website",
    body: "hasellus eleifend lacus vitae est ultrices placerat. Nunc at risus id risus venenatis laoreet sit amet cursus neque.",
    lane: 1,
  },
  {
    id: 3,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Change button color",
    body: "Suspendisse ac lorem a neque tempus luctus non aliquam sapien. Cras ut lacus bibendum, placerat nibh eu, tempus neque.",
    lane: 3,
  },
  {
    id: 4,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Deploy server on acceptance environment",
    body: "Pellentesque pharetra fermentum sapien, aliquet ultrices ligula mattis porttitor.",
    lane: 2,
  },
  {
    id: 5,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Change layout for the content page",
    body: "Cras tellus ligula, mattis at facilisis eu, ultricies vel elit. Ut aliquam volutpat lacus, a rutrum sem vulputate non.",
    lane: 3,
  },
  {
    id: 6,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Complete the registration flow",
    body: "In vel commodo ipsum. Duis id ipsum semper, condimentum ipsum sit amet, maximus massa.",
    lane: 2,
  },
  {
    id: 7,
    project_id: "p123",
    project_title: "Test Project",
    project_owner: "123",
    title: "Create new database instance",
    body: "Curabitur nec sem lorem. Donec venenatis, arcu vitae malesuada consequat, dolor ante placerat mi, in fermentum diam ipsum id libero.",
    lane: 4,
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
  response.json(project);
});

app.patch("/api/projects/:id/changeLane", (request, response) => {
  const id = Number(request.params.id);
  const { lane } = request.body;

  const project = projects.find((project) => project.id === id);
  if (!project) {
    return response.status(404).json({ message: "No such project" });
  }
  project.lane = lane;
  response.json(project);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
