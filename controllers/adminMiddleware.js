const jwt = require('jsonwebtoken');

const adminOnly = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send("Un token es requerido para la autenticación");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.es_admin) {
      return res.status(401).send("Acceso restringido a administradores");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Token inválido");
  }
};

module.exports = adminOnly;
