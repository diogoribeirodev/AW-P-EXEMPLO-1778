const fs = require("fs");

//return all students
exports.getAll = async (req, res) => {
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //returns students array
  return res.send(data.students);
};

//return student by his id (student number)
exports.getById = async (req, res) => {
  //get student id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //finds student by his id
  const student = data.students.filter((student) => student.number == id);
  if (student.length == 0) return res.status(404).send("Aluno não existe!");
  //return student
  res.send(student);
};

//creates student
exports.create = async (req, res) => {
  //get requested student properties
  const { number, name, city, birthday } = req.body;
  if (!number || !name || !city || !birthday)
    return res.status(400).send("Dados inválidos!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  if (data.students.find((student) => student.number == number))
    return res.status(400).send("Aluno já existe!");
  //add to students array
  data.students.push(req.body);
  //add to students array
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return new course
    return res.status(201).send(req.body);
  }
};

//updates student
exports.update = async (req, res) => {
  const { number, name, city, birthday } = req.body;
  if (!number || !name || !city || !birthday)
    return res.status(400).send("Dados inválidos!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find student to update
  const student = data.students.find((student) => student.number == number);
  if (!student) return res.status(404).send("Aluno não existe!");
  //update properties
  student.name = name;
  student.city = city;
  student.birthday = birthday;
  //update local database
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return updated student
    return res.status(201).send({ number, name, city, birthday });
  }
};

//delete student by his id (student number)
exports.delete = async (req, res) => {
  //get student id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find student to delete
  const student = data.students.filter((student) => student.number == id);
  if (student.length == 0) return res.status(404).send("Aluno não existe!");
  //delete student
  data.students.splice(student, 1);
  //update local database
  fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  //return ok
  return res.status(200).send("ok");
};
