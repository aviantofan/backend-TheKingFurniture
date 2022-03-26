const color = require('express').Router();
const {
  getAllColor, addColor, editColor, deleteColor, getColorById,
} = require('../controllers/color');

color.get('/', getAllColor);
color.get('/:id', getColorById);
color.post('/', addColor);
color.patch('/:id', editColor);
color.delete('/:id', deleteColor);

module.exports = color;
