const argon = require('argon2');
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../helpers/generator');
const responseHandler = require('../helpers/responseHandler');
const { inputValidator, comparePassword } = require('../helpers/validator');
const mail = require('../helpers/mail');
const Otp = require('../models/otp');
const User = require('../models/user');

const { APP_SECRET, APP_EMAIL, FRONTEND_URL } = process.env;

exports.login = async (req, res) => {
  const fillable = [
    {
      field: 'email', required: true, type: 'email', max_length: 100,
    },
    {
      field: 'password', required: true, type: 'password', by_pass_validation: true,
    },
  ];
  const { error, data } = inputValidator(req, fillable);
  if (error.length > 0) {
    return responseHandler(res, 400, error);
  }

  const results = await User.findAll({
    where: {
      email: data.email,
    },
  });
  if (results.length === 0) {
    return responseHandler(res, 400, 'Invalid Credential!');
  }

  if (await argon.verify(results[0].dataValues.password, data.password)) {
    const authData = {
      id: results[0].id,
      role: results[0].id_role,
    };
    const token = jwt.sign(authData, APP_SECRET);
    return responseHandler(res, 200, 'Login success!', [token]);
  }

  return responseHandler(res, 400, 'Invalid Credential!');
};

exports.register = async (req, res) => {
  try {
    const fillable = [
      {
        field: 'email', required: true, type: 'email', max_length: 100,
      },
      {
        field: 'password', required: true, type: 'password', by_pass_validation: true,
      },
      {
        field: 'id_role', required: true, type: 'integer',
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (error.length > 0) {
      return responseHandler(res, 400, error);
    }

    await User.create(data);
    return responseHandler(res, 201, 'Register Succesful!');
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { callbackUrl } = req.query;
    if (callbackUrl) {
      const fillable = [
        {
          field: 'email', required: true, type: 'email', max_length: 100,
        },
      ];
      const { error, data } = inputValidator(req, fillable);
      if (error.length > 0) {
        return responseHandler(res, 400, error);
      }

      const userByEmail = User.findAll({
        where: {
          email: data.email,
        },
      });

      if (userByEmail.length === 0) {
        return responseHandler(res, 400, 'Email is not registered!');
      }

      const code = generateOtp(6);

      const checkRequest = await Otp.findAll({
        where: {
          email: data.email,
          is_expired: false,
        },
      });

      if (checkRequest.length > 0) {
        return responseHandler(res, 400, 'We already sent you an email! Please check it');
      }

      const addOtp = await Otp.create({ email: data.email, code });
      try {
        await mail.sendMail({
          from: APP_EMAIL,
          to: data.email,
          subject: 'Reset Your Password | The King Furniture',
          text: String(code),
          html: `
            <h3>Forgot your password?</h3>
            Don't worry! we got you backed up!
            Click <a href='${FRONTEND_URL}/forgot-password?otp=${code}'>here</a> and proceed reset your password!
          `,
        });
      } catch (err) {
        return responseHandler(res, 500, 'Unexpected Error');
      }
      return responseHandler(res, 200, 'Your link to reset password has been sent to your email!');
    }
    const fillable = [
      {
        field: 'code', required: true, type: 'varchar', max_length: 6,
      },
      {
        field: 'password', required: true, type: 'password',
      },
      {
        field: 'confirmPassword', required: true, type: 'password', by_pass_validation: true,
      },
    ];
    const { error, data } = inputValidator(req, fillable);
    if (!comparePassword(data.password, data.confirmPassword)) {
      error.push('Password is not same!');
    }
    if (error.length > 0) {
      return responseHandler(res, 400, error);
    }

    const otpRequest = await Otp.findOne({
      where: {
        code: data.code,
        is_expired: false,
      },
    });

    if (!otpRequest) {
      return responseHandler(res, 400, 'Invalid or expired code');
    }

    const { email } = otpRequest.dataValues;

    const user = await User.findOne({
      where: {
        email,
        is_deleted: 0,
      },
    });

    if (!user) {
      return responseHandler(res, 400, 'User not found');
    }

    user.password = data.password;
    await user.save();
    otpRequest.is_expired = true;
    await otpRequest.save();
    return responseHandler(res, 200, 'Your password has been resetted!');
  } catch (e) {
    let error = e.message;
    if (Array.isArray(e.errors)) {
      error = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', error);
  }
};
