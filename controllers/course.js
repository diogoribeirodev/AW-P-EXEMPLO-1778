const fs = require("fs");

//return all courses
exports.getAll = async (req, res) => {
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //returns courses array
  return res.send(data.courses);
};

//return course by his id (course number)
exports.getById = async (req, res) => {
  //get course id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //finds course by his id
  const course = data.courses.filter((course) => course.number == id);
  if (course.length == 0) return res.status(400).send("Curso não existe!");
  //return course
  res.send(course);
};

//creates course
exports.create = async (req, res) => {
  //get requested course properties
  const { number, name, sigla, school } = req.body;
  if (!number || !name || !sigla || !school)
    return res.status(400).send("Dados inválidos!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  if (data.courses.find((course) => course.number == number))
    return res.status(400).send("Curso já existe!");
  //add to courses array
  data.courses.push(req.body);
  //add to courses array
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return new course
    return res.status(201).send(req.body);
  }
};

//updates course
exports.update = async (req, res) => {
  const { number, name, sigla, school } = req.body;
  if (!number || !name || !sigla || !school)
    return res.status(400).send("Dados inválidos!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find course to update
  const course = data.courses.find((course) => course.number == number);
  if (!course) return res.status(400).send("Curso não existe!");
  //update properties
  course.name = name;
  course.sigla = sigla;
  course.school = school;
  //update local database
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return updated student
    return res.status(201).send({ number, name, sigla, school });
  }
};

//delete course by his id (course number)
exports.delete = async (req, res) => {
  //get course id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find school to delete
  const course = data.courses.filter((course) => course.number == id);
  if (course.length == 0) return res.status(400).send("Curso não existe!");
  //delete school
  data.courses.splice(course, 1);
  //update local database
  fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  //return ok
  return res.status(200).send("ok");
};
