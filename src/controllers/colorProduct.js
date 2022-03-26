const responseHandler = require('../helpers/responseHandler');
const Color = require('../models/color');
const ColorProduct = require('../models/colorProduct');
const Product = require('../models/product');

exports.getAllColorProduct = async (req, res) => {
  try {
    const colorProduct = await ColorProduct.findAll();
    return responseHandler(res, 200, 'List of product color', colorProduct, null);
  } catch {
    return responseHandler(res, 500, 'Unexpected error');
  }
};

exports.getColorByProduct = async (req, res) => {
  try {
    const colorProduct = await ColorProduct.findByPk(req.params.id_product);
    if (!colorProduct) {
      return responseHandler(res, 200, 'This product has no specific color', null, null);
    }
    return responseHandler(res, 200, 'List of color', colorProduct, null);
  } catch {
    return responseHandler(res, 500, 'Unexpected error');
  }
};

exports.addColorProduct = async (req, res) => {
  try {
    const product = Product.findByPk(req.body.id_product);
    if (!product) {
      return responseHandler(res, 404, 'Product not found');
    }
    const color = await Color.findByPk(req.body.id_color);
    if (!color) {
      return responseHandler(res, 404, 'Color not found');
    }
    const getColorProduct = await ColorProduct.findAll({
      where: {
        id_product: req.body.id_product,
        id_color: req.body.id_color,
      },
    });
    if (getColorProduct) {
      return responseHandler(res, 404, 'Product with specific color exist');
    }
    const colorProduct = await ColorProduct.create(req.body);
    return responseHandler(res, 200, 'Successfully add new color', colorProduct);
  } catch (e) {
    const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    return responseHandler(res, 400, 'Error', errMessage);
  }
};

exports.editColorProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const colorProduct = await ColorProduct.findByPk(id);
    if (!colorProduct) {
      return responseHandler(res, 404, 'Product color not found');
    }
    if (req.body.id_product) {
      const product = await Product.findByPk(req.body.id_product);
      if (!product) {
        return responseHandler(res, 404, 'Product not found');
      }
    }
    if (req.body.id_color) {
      const color = await Color.findByPk(req.body.id_color);
      if (!color) {
        return responseHandler(res, 404, 'Color not found');
      }
    }
    Object.keys(req.body).forEach((data) => {
      colorProduct[data] = req.body[data];
    });
    const getColorProduct = await ColorProduct.findAll({
      where: {
        id_product: colorProduct.dataValues.id_product,
        id_color: colorProduct.dataValues.id_color,
      },
    });
    if (getColorProduct) {
      return responseHandler(res, 404, 'Product with specific color exist');
    }
    await colorProduct.save();
    return responseHandler(res, 200, 'Successfully updatedcolor from product', colorProduct);
  } catch (e) {
    return responseHandler(res, 400, e);
  }
};

exports.deleteColorProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const colorProduct = await ColorProduct.findByPk(id);
    if (!colorProduct) {
      return responseHandler(res, 404, 'Product not found');
    }
    await colorProduct.destroy();
    return responseHandler(res, 200, 'Successfully deleted color from product');
  } catch {
    return responseHandler(res, 400, 'Unexpected error');
  }
};
