const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//return all courses
exports.getAll = async (req, res) => {
  try {
    //read all from database
    const response = await prisma.courses.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//return course by his id (course number)
exports.getById = async (req, res) => {
  //get course id requested
  const id = req.params.number;
  try {
    //finds course by his id (number)
    const course = await prisma.courses.findUnique({
      where: {
        number: id,
      },
    });
    res.status(200).json(course);
  } catch (error) {
    if (error.code == "P2025") return res.status(404).send("Curso não existe!");
    res.status(404).json({ msg: error.message });
  }
};

//creates course
exports.create = async (req, res) => {
  //get requested course properties
  const { number, name, sigla, school } = req.body;
  if (!number || !name || !sigla || !school)
    return res.status(400).send("Dados inválidos!");
  try {
    //creates new course
    const course = await prisma.courses.create({
      data: {
        number: number,
        name: name,
        sigla: sigla,
        school: school,
      },
    });
    //return course created
    res.status(201).json(course);
  } catch (error) {
    if (error.code == "P2002") return res.status(404).send("Curso já existe!");
    res.status(400).json({ msg: error.message });
  }
};

//updates course
exports.update = async (req, res) => {
  const { number, name, sigla, school } = req.body;
  if (!number || !name || !sigla || !school)
    return res.status(400).send("Dados inválidos!");
  try {
    const course = await prisma.courses.update({
      where: {
        number: number,
      },
      data: {
        name: name,
        sigla: sigla,
        school: school,
      },
    });
    //return course updated
    res.status(200).json(course);
  } catch (error) {
    if (error.code == "P2025") return res.status(404).send("Curso não existe!");
    res.status(400).json({ msg: error.message });
  }
};

//delete course by his id (course number)
exports.delete = async (req, res) => {
  //get course number requested
  const number = req.params.number;
  try {
    //aqui acontece o mesmo que no update
    await prisma.courses.delete({
      where: {
        number: number,
      },
    });
    //just return ok
    res.status(200).send("ok");
  } catch (error) {
    if (error.code == "P2025") return res.status(404).send("Curso não existe!");
    res.status(400).json({ msg: error.message });
  }
};
