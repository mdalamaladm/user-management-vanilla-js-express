const { pgPool } = require("./db");

exports.checkAccessMiddleware = function checkAccessMiddleware (permission) {
  return async function (req, res, next) {
    const { roleId } = req?.user;

    const rolesPermissions = await pgPool.query(`SELECT permissions.name FROM roles_permissions INNER JOIN permissions ON permissions.id = roles_permissions.permission_id WHERE roles_permissions.role_id = '${roleId}'`);

    const permissions = rolesPermissions.rows.map(data => data.name);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        httpCode: 403,
        code: 'UMER0014',
        message: 'User unauthorized'
      });
    }

    next();
  }
}

exports.requiredBodyMiddleware = function requiredBodyMiddleware (errorCode, names) {
  return function (req, res, next) {
    for (const name of names) {
      if (!req.body[name]) {
        return res.status(400).json({
          httpCode: 400,
          code: errorCode,
          message: `'${name}' must be filled`
        });
      }
    }

    next();
  }
}