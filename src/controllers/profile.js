const argon = require('argon2');
const responseHandler = require('../helpers/responseHandler');
const User = require('../models/user');
const Role = require('../models/role');
const { comparePassword, inputValidator } = require('../helpers/validator');
const { cloudPathToFileName } = require('../helpers/converter');
const { deleteFile } = require('../helpers/fileHandler');

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const results = await User.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'is_deleted',
          'id_role',
          'createdAt',
          'updatedAt',
        ],
      },
      include: [
        {
          model: Role,
          attributes: ['id', 'name'],
        },
      ],
    });
    return responseHandler(res, 200, 'Profile data', results);
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const fillable = [
      {
        field: 'name', required: false, type: 'varchar', max_length: 100,
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
    ];
    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      if (req.files) {
        deleteFile(req.files);
      }
      return responseHandler(res, 400, error);
    }

    const user = await User.findByPk(id);

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
    return responseHandler(res, 200, 'Profile updated!');
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const fillable = [
      {
        field: 'oldPassword', required: true, type: 'password', by_pass_validation: true,
      },
      {
        field: 'newPassword', required: true, type: 'password',
      },
      {
        field: 'confirmPassword', required: true, type: 'password', by_pass_validation: true,
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (!comparePassword(data.newPassword, data.confirmPassword)) {
      error.push('Confirm password is not same');
    }

    const user = await User.findByPk(id);
    if (!await argon.verify(user.password, data.oldPassword)) {
      error.push('Wrong old password!');
    }

    if (error.length > 0) {
      return responseHandler(res, 400, error);
    }

    user.password = data.newPassword;
    await user.save();
    return responseHandler(res, 200, 'Your password has been updated!');
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};
