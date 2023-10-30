const bcrypt = require("bcryptjs/dist/bcrypt");
const authenticateUtil = require("../../utils/authenticate.js");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      var passwordIsValid = bcrypt.compareSync(password, user.password);

      if (passwordIsValid) {
        const accessToken = authenticateUtil.generateAccessToken({
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        });
        res.status(200).json({ name: user.name, token: accessToken });
      } else {
        res.status(401).json({ msg: "Credenciais inválidas!" });
      }
    }
  } catch (error) {
    if (error.code == "P2025")
      return res.status(404).json({ msg: "Utilizador não existe!" });
    res.status(400).json({ msg: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password || !isAdmin) {
      res.status(400).json({ msg: "Preencha todos os campos!" });
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg: "A senha deve ter pelo menos 8 caracteres, incluindo pelo menos um caractere maiúsculo, um caractere minúsculo, um número e um caractere especial.",
      });
    }

    await prisma.users.create({
      data: {
        email: email,
        name: name,
        password: bcrypt.hashSync(password, 8),
        isAdmin: isAdmin,
      },
    });

    return this.signin(req, res);
  } catch (error) {
    if (error.code == "P2002")
      return res.status(400).json({ msg: "Utilizador já existe!" });
    res.status(400).json({ msg: error.message });
  }
};
