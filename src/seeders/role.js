const Role = require('../models/role');

const roles = async () => {
  const role = await Role.findAll();
  console.log('executed');

  const seedRole = [
    { name: 'Admin' },
    { name: 'Seller' },
    { name: 'Customer' },
  ];

  if (role.length === 0) {
    await Role.bulkCreate(seedRole);
  }
};

module.exports = roles;
