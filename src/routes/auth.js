const auth = require('express').Router();

const authController = require('../controllers/auth');

const { FRONTEND_URL } = process.env;

auth.post('/login', authController.login);
auth.post('/register', authController.register);
auth.post('/forgot-password', authController.forgotPassword);

module.exports = auth;
