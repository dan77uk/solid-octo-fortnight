const projectsRouter = require("express").Router();
const Project = require("../models/project");

projectsRouter.get("/", (request, response) => {
  Project.find({}).then((result) => {
    response.json(result);
  });
});

projectsRouter.get("/:id", (request, response, next) => {
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

projectsRouter.delete("/:id", (request, response) => {
  Project.findOneAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

projectsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const project = new Project({
    project_id: body.project_id,
    project_title: body.project_title,
    project_owner: body.owner_id,
    title: body.title,
    body: body.content,
    lane: body.lane,
  });

  project
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

// * Move a project between lanes
projectsRouter.patch("/:id/changeLane", (request, response) => {
  const { lane } = request.body;

  Project.findByIdAndUpdate(
    request.params.id,
    { lane: lane },
    { new: true, runValidators: true, context: "query" }
  )
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

module.exports = projectsRouter;
