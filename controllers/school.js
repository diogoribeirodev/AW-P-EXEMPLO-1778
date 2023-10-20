const fs = require("fs");

//return all schools
exports.getAll = async (req, res) => {
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //returns schools array
  return res.send(data.schools);
};

//return school by his id (school number)
exports.getById = async (req, res) => {
  //get school id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //finds school by his id
  const school = data.schools.filter((school) => school.number == id);
  if (school.length == 0) return res.status(404).send("Escola não existe!");
  //return school
  res.send(school);
};

//creates school
exports.create = async (req, res) => {
  //get requested school properties
  const { number, name, sigla, morada, website } = req.body;
  if (!number || !name || !sigla || !morada || !website)
    return res.status(400).send("Dados em falta!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  if (data.schools.find((school) => school.number == number))
    return res.status(400).send("Escola já existe!");
  //add to schools array
  data.schools.push(req.body);
  //add to schools array
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return new course
    return res.status(201).send(req.body);
  }
};

//updates school
exports.update = async (req, res) => {
  const { number, name, sigla, morada, website } = req.body;
  if (!number || !name || !sigla || !morada || !website)
    return res.status(400).send("Dados em falta!");
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find school to update
  const school = data.schools.find((school) => school.number == number);
  if (!school) return res.status(404).send("Escola não existe!");
  //update properties
  school.name = name;
  school.sigla = sigla;
  school.morada = morada;
  school.website = website;
  //update local database
  try {
    fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  } catch {
    return res.status(400).send("Erro!");
  } finally {
    //return updated student
    return res.status(201).send({ number, name, sigla, morada, website });
  }
};

//delete school by his id (school number)
exports.delete = async (req, res) => {
  //get school id requested
  const id = req.params.number;
  //read local data json file
  const datajson = fs.readFileSync("data/local/data.json", "utf-8");
  //parse to json
  const data = JSON.parse(datajson);
  //find school to delete
  const school = data.schools.filter((school) => school.number == id);
  if (school.length == 0) return res.status(404).send("Escola não existe!");
  //delete school
  data.schools.splice(school, 1);
  //update local database
  fs.writeFileSync("data/local/data.json", JSON.stringify(data));
  //return ok
  return res.status(200).send("ok");
};
