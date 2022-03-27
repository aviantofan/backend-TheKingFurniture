const User = require('../models/user');

const users = async () => {
  const user = await User.findAll();

  const seedUser = {
    name: 'Admin', email: 'admin@mail.com', password: 'Admin123', role: 1,
  };

  if (user.length === 0) {
    await User.create(seedUser);
  }
};

module.exports = users;
