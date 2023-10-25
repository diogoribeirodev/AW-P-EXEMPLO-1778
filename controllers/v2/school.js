const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//return all schools
exports.getAll = async (req, res) => {
  try {
    //read all from database
    const response = await prisma.schools.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//return school by his id (school number)
exports.getById = async (req, res) => {
  //get school id requested
  const id = req.params.number;
  try {
    //finds school by his id (number)
    const school = await prisma.schools.findUnique({
      where: {
        number: id,
      },
    });
    return school;
  } catch (error) {
    if (error.code == "P2025")
      return res.status(404).send("Escola não existe!");
    res.status(404).json({ msg: error.message });
  }
};

//creates school
exports.create = async (req, res) => {
  //get requested school properties
  const { number, name, sigla, morada, website } = req.body;
  if (!number || !name || !sigla || !morada || !website)
    return res.status(400).send("Dados em falta!");
  try {
    //creates new school
    const school = await prisma.schools.create({
      data: {
        number: number,
        name: name,
        sigla: sigla,
        morada: morada,
        website: website,
      },
    });
    //return school created
    res.status(201).json(school);
  } catch (error) {
    if (error.code == "P2002") return res.status(404).send("Escola já existe!");
    res.status(400).json({ msg: error.message });
  }
};

//updates school
exports.update = async (req, res) => {
  const { number, name, sigla, morada, website } = req.body;
  if (!number || !name || !sigla || !morada || !website)
    return res.status(400).send("Dados em falta!");
  try {
    const school = await prisma.schools.update({
      where: {
        number: number,
      },
      data: {
        name: name,
        sigla: sigla,
        morada: morada,
        website: website,
      },
    });
    //return school updated
    res.status(200).json(school);
  } catch (error) {
    if (error.code == "P2025")
      return res.status(404).send("Escola não existe!");
    res.status(400).json({ msg: error.message });
  }
};

//delete school by his id (school number)
exports.delete = async (req, res) => {
  //get school number requested
  const number = req.params.number;
  try {
    //aqui acontece o mesmo que no update
    await prisma.schools.delete({
      where: {
        number: number,
      },
    });
    //just return ok
    res.status(200).send("ok");
  } catch (error) {
    if (error.code == "P2025")
      return res.status(404).send("Escola não existe!");
    res.status(400).json({ msg: error.message });
  }
};
