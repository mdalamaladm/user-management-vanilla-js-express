const { pgPool } = require("./db");

exports.checkAccessMiddleware = function checkAccessMiddleware (permissions) {
  return async function (req, res, next) {
    const { roleId } = req?.user;

    const resRolesPermissions = await pgPool.query(`SELECT permissions.name FROM roles_permissions INNER JOIN permissions ON permissions.id = roles_permissions.permission_id WHERE roles_permissions.role_id = '${roleId}'`);

    const rolePermissions = resRolesPermissions.rows.map(data => data.name);

    if (
      (
        Array.isArray(permissions) &&
        !(permissions.some(p => rolePermissions.includes(p)))
      ) ||
      (
        !Array.isArray(permissions) &&
        !rolePermissions.includes(permissions)  
      )
    ) {
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
      const data = req.body[name];
      if (
        (Array.isArray(data) && data.length < 1) ||
        !data
      ) {
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