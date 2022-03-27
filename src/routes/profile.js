const profile = require('express').Router();

const profileController = require('../controllers/profile');
const { verifyUser } = require('../helpers/auth');
const uploadImage = require('../helpers/upload');

profile.get('/', verifyUser, profileController.getProfile);
profile.patch('/', verifyUser, uploadImage('picture', 1), profileController.updateProfile);
profile.patch('/change-password', verifyUser, profileController.changePassword);

module.exports = profile;
