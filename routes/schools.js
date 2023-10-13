const schoolRouter = require("express").Router();
const controller = require("../controllers/school");

//schools CRUD
schoolRouter.get("/", controller.getAll); //read all
schoolRouter.get("/:number", controller.getById); //read one by his id (school number)
schoolRouter.post("/create", controller.create); //create new school
schoolRouter.put("/update", controller.update); //update school
schoolRouter.delete("/delete/:number", controller.delete); //delete school

module.exports = schoolRouter;
