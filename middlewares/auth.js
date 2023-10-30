const authenticateUtil = require("../utils/authenticate.js");

module.exports = async (req, res, next) => {
  const accessToken = req.headers["authorization"]; // req.headers['x-access-token'];

  if (!accessToken) {
    return res.status(401).send("unauthorized");
  }

  try {
    const bearer = accessToken.split(" ");
    const bearerToken = bearer[1];

    const result = await authenticateUtil.certifyAccessToken(bearerToken);
    req.body.loggedUserName = result.Name;

    if (
      (req.baseUrl.includes("/courses") || req.baseUrl.includes("/schools")) &&
      result.isAdmin == false
    ) {
      return res.status(401).send("unauthorized");
    }

    return next();
  } catch (err) {
    return res.status(401).send("unauthorized");
  }
};
