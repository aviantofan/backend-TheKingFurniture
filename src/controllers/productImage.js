const responseHandler = require('../helpers/responseHandler');
const ProductImage = require('../models/productImage');
const Product = require('../models/product');

exports.getAllProductImages = async (req, res) => {
  const images = await ProductImage.findAll();
  return responseHandler(res, 200, 'List of images', images, null);
};

exports.getImagesByProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id_product);
    if (!product || product.dataValues.is_deleted) {
      return responseHandler(res, 400, 'Product not found', null, null);
    }
    const productImages = await ProductImage.findAll({
      where: {
        id_product: req.params.id_product,
      },
    });
    if (!productImages) {
      return responseHandler(res, 200, 'This product has no images', null, null);
    }
    return responseHandler(res, 200, 'List of product images', productImages, null);
  } catch (e) {
    return responseHandler(res, 200, 'Error', e, null);
  }
};

exports.addImage = async (req, res) => {
  try {
    const images = req.files;
    const product = await Product.findByPk(req.body.id_product);
    if (!product || product.dataValues.is_deleted) {
      return responseHandler(res, 400, 'Product not found', null, null);
    }
    const productImages = await ProductImage.findAll({
      where: {
        id_product: req.body.id_product,
      },
    });
    if (productImages.length > 9) {
      return responseHandler(res, 400, 'Maximum images allow: 10 images', null, null);
    }
    const data = { id_product: req.body.id_product };
    const responses = {};
    images.forEach(async (pic, idx) => {
      data.image = pic.path;
      const productImage = await ProductImage.create(data);
      if (!productImage) {
        return responseHandler(res, 400, 'Cant upload image', null, null);
      }
      responses[idx] = productImage;
      return responses;
    });
    return responseHandler(res, 200, 'Success', responses, null);
  } catch (e) {
    return responseHandler(res, 400, 'Can\'t create product category', e, null);
  }
};

exports.updateProductImage = async (req, res) => {
  const { id } = req.params;
  const data = { id };
  if (req.files) {
    data.image = req.files[0].path;
  }
  if (req.body.id_product) {
    data.id_product = req.body.id_product;
    const product = await Product.findByPk(data.id_product);
    if (!product || product.dataValues.is_deleted) {
      return responseHandler(res, 404, 'Product not found', null, null);
    }
  }
  const productImages = await ProductImage.findAll({
    where: {
      id_product: req.body.id_product,
    },
  });
  if (productImages.length > 9) {
    return responseHandler(res, 400, 'Maximum images allow: 10 images', null, null);
  }
  const productImage = await ProductImage.findByPk(id);
  if (!productImage) {
    return responseHandler(res, 404, 'Data not found', null, null);
  }
  Object.keys(data).forEach((x) => {
    productImage[x] = data[x];
  });
  await productImage.save();
  return responseHandler(res, 200, 'Updated image', productImage, null, null);
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productImage = await ProductImage.findByPk(id);
    if (!productImage) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    await productImage.destroy();
    return responseHandler(res, 200, 'Data was successfully deleted');
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', e, null);
  }
};
