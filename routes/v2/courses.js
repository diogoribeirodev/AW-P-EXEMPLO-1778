const courseRouter = require("express").Router();
const controller = require("../../controllers/v2/course");

//courses CRUD
courseRouter.get("/", controller.getAll); //read all
courseRouter.get("/:number", controller.getById); //read one by his id (course number)
courseRouter.post("/create", controller.create); //create new course
courseRouter.put("/update", controller.update); //update course
courseRouter.delete("/delete/:number", controller.delete); //delete course

module.exports = courseRouter;
