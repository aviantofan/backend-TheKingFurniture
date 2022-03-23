const Sequelize = require('sequelize');
const responseHandler = require('../helpers/responseHandler');
const Product = require('../models/product');
const ProductCategory = require('../models/productCategory');

const { APP_URL } = process.env;

exports.getAllProduct = async (req, res) => {
  const { search = '' } = req.query;
  let {
    minPrice, maxPrice, limit, page,
  } = req.query;
  minPrice = parseInt(minPrice, 10) || 0;
  maxPrice = parseInt(maxPrice, 10) || 100000000;
  limit = parseInt(limit, 10) || 5;
  page = parseInt(page, 10) || 1;
  const dataName = ['search', 'minPrice', 'maxPrice'];
  const data = { search, minPrice, maxPrice };
  let url = `${APP_URL}/product?`;
  dataName.forEach((x) => {
    if (req.query[x]) {
      data[x] = req.query[x];
      url = `${url}${x}=${data[x]}&`;
    }
  });
  const offset = (page - 1) * limit;
  const results = await Product.findAll({
    include: [
      { model: ProductCategory },
      // { model: ProductCategory, as: 'categories' },
    ],
    where: {
      name: {
        [Sequelize.Op.like]: `%${search}%`,
      },
      price: {
        [Sequelize.Op.gte]: minPrice,
        [Sequelize.Op.lte]: maxPrice,
      },
      is_deleted: 0,
    },
    limit,
    offset,
  });
  const count = await Product.count();
  const last = Math.ceil(count / limit);
  const pageInfo = {
    prev: page > 1 ? `${url}page=${page - 1}&limit=${limit}` : null,
    next: page < last ? `${url}page=${page + 1}&limit=${limit}` : null,
    totalData: count,
    currentPage: page,
    lastPage: last,
  };
  return responseHandler(res, 200, 'List of products', results, pageInfo);
};

exports.createProduct = async (req, res) => {
  try {
    // const { idCategory } = req.body;
    // const listIdCategory = idCategory.split(' ');
    // if (listIdCategory.length < 1) {
    //   return responseHandler(res, 400, 'Please enter at least 1 category', null, null);
    // }
    const product = await Product.create(req.body);
    return responseHandler(res, 200, 'Product created', product);
  } catch (e) {
    const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    return responseHandler(res, 400, 'Can\'t create product', errMessage, null);
  }
};

exports.productDetail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (product && product.is_deleted === false) {
    return responseHandler(res, 200, 'Product detail', product, null);
  }
  return responseHandler(res, 404, 'Product not found', null, null);
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product && product.dataValues.is_deleted === false) {
      Object.keys(req.body).forEach((data) => {
        product[data] = req.body[data];
      });
      await product.save();
      return responseHandler(res, 200, 'Product updated', product, null);
    }
    return responseHandler(res, 404, 'Product not found', null, null);
  } catch (e) {
    return responseHandler(res, 400, 'Can\'t update product', e, null);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (product && product.dataValues.is_deleted === false) {
    product.is_deleted = 1;
    await product.save();
    return responseHandler(res, 200, 'Product was deleted', null, null);
  }
  return responseHandler(res, 404, 'Product not found', null, null);
};
