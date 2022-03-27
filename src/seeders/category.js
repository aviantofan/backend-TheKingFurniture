const Category = require('../models/category');

const categories = async () => {
  const category = await Category.findAll();

  const seedCategory = [
    { name: 'Indoor' },
    { name: 'Outdoor' },
    { name: 'Bedroom' },
    { name: 'Kitchen' },
    { name: 'Dining' },
    { name: 'Bathroom' },
    { name: 'Decoration' },
  ];

  if (category.length === 0) {
    await Category.bulkCreate(seedCategory);
  }
};

module.exports = categories;
