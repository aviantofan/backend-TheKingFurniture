const Sequelize = require('sequelize');
const { cloudPathToFileName } = require('../helpers/converter');
const { deleteFile } = require('../helpers/fileHandler');
const { pageInfo } = require('../helpers/pageInfo');
const responseHandler = require('../helpers/responseHandler');
const { inputValidator } = require('../helpers/validator');
const Role = require('../models/role');
const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    let { search, page, limit } = req.query;
    search = search || '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    const offset = (page - 1) * limit;
    const data = { search, limit };

    const resultsCount = await User.findAll({
      where: {
        is_deleted: false,
      },
    });

    const totalData = resultsCount.length;
    const results = await User.findAll({
      where: {
        is_deleted: false,
        // name: {
        //   [Sequelize.Op.like]: `${search}%`,
        // },
      },
      limit,
      offset,
    });

    let queryParams = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (data[key]) {
          queryParams += `${key}=${data[key]}&`;
        }
      }
    }
    const dataPageInfo = pageInfo(totalData, limit, page, 'user', queryParams);

    return responseHandler(res, 200, 'List all users', results, dataPageInfo);
  } catch (e) {
    return responseHandler(res, 400, 'error', e);
  }
};

exports.detailUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    return responseHandler(res, 200, 'User detail', user);
  }
  return responseHandler(res, 404, 'User not found');
};

exports.createUser = async (req, res) => {
  try {
    const fillable = [
      {
        field: 'name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'email', required: true, type: 'email',
      },
      {
        field: 'password', required: true, type: 'password',
      },
      {
        field: 'gender', required: false, type: 'enum', options: ['male', 'female'],
      },
      {
        field: 'email', required: false, type: 'email',
      },
      {
        field: 'store_name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'store_description', required: false, type: 'text',
      },
      {
        field: 'id_role', required: false, type: 'integer',
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (data.id_role) {
      const role = await Role.findByPk(data.id_role);
      if (!role) {
        error.push('Role not found!');
      }
    }
    if (error.length > 0) {
      if (req.files) {
        deleteFile(req.files);
      }
      return responseHandler(res, 400, error);
    }
    if (req.files) {
      req.files.forEach(async (pic) => {
        data.picture = pic.path;
      });
    }
    const user = await User.create(data);
    return responseHandler(res, 201, 'User created!', user);
  } catch (e) {
    if (req.files) {
      deleteFile(req.files);
    }
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      if (req.files) {
        deleteFile(req.files);
      }
      return responseHandler(res, 404, 'User not found!');
    }
    const fillable = [
      {
        field: 'name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'email', required: false, type: 'email',
      },
      {
        field: 'password', required: false, type: 'password',
      },
      {
        field: 'gender', required: false, type: 'enum', options: ['male', 'female'],
      },
      {
        field: 'email', required: false, type: 'email',
      },
      {
        field: 'store_name', required: false, type: 'varchar', max_length: 100,
      },
      {
        field: 'store_description', required: false, type: 'text',
      },
      {
        field: 'id_role', required: false, type: 'integer',
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (data.id_role) {
      const role = await Role.findByPk(data.id_role);
      if (!role) {
        error.push('Role not found!');
      }
    }
    if (error.length > 0) {
      if (req.files) {
        deleteFile(req.files);
      }
      return responseHandler(res, 400, error);
    }

    if (req.files) {
      if (user.picture) {
        deleteFile(cloudPathToFileName(user.picture));
      }
      req.files.forEach(async (pic) => {
        data.picture = pic.path;
      });
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        user[key] = data[key];
      }
    }
    await user.save();
    return responseHandler(res, 200, 'User updated!', user);
  } catch (e) {
    if (req.files) {
      deleteFile(req.files);
    }
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    user.is_deleted = true;
    await user.save();
    return responseHandler(res, 200, 'User Deleted!');
  }
  return responseHandler(res, 404, 'User not found!');
};

exports.hardDeleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if (user) {
    await user.destroy();
    return responseHandler(res, 200, 'User Deleted!');
  }
  return responseHandler(res, 404, 'User not found!');
};
