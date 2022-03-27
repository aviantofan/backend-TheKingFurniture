const jwt = require('jsonwebtoken');
const responseHandler = require('./responseHandler');
const Role = require('../models/role');

const { APP_SECRET } = process.env;

exports.verifyUser = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    const token = auth.split(' ')[1];
    if (token) {
      try {
        const payload = jwt.verify(token, APP_SECRET);
        req.user = payload;
        if (payload) {
          return next();
        }
        return responseHandler(res, 401, 'Please login first!');
      } catch (err) {
        return responseHandler(res, 401, 'Please login first!');
      }
    } else {
      return responseHandler(res, 401, 'Please login first!');
    }
  }
  return responseHandler(res, 401, 'Please login first!');
};

exports.checkIsAdmin = async (req, res, next) => {
  const idRole = req.user.role;

  const role = await Role.findByPk(idRole);
  if (!role) {
    return responseHandler(res, 500, 'Unexpected Error');
  }
  if (role.name !== 'Admin') {
    return responseHandler(res, 403, 'You are not authorized to do this action!');
  }
  return next();
};

exports.checkIsSeller = async (req, res, next) => {
  const idRole = req.user.role;

  const role = await Role.findByPk(idRole);
  if (!role) {
    return responseHandler(res, 500, 'Unexpected Error');
  }
  if (role.name !== 'Seller') {
    return responseHandler(res, 403, 'You are not authorized to do this action!');
  }
  return next();
};

exports.checkIsCustomer = async (req, res, next) => {
  const idRole = req.user.role;

  const role = await Role.findByPk(idRole);
  if (!role) {
    return responseHandler(res, 500, 'Unexpected Error');
  }
  if (role.name !== 'Customer') {
    return responseHandler(res, 403, 'You are not authorized to do this action!');
  }
  return next();
};
