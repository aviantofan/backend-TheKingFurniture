const responseHandler = require('../helpers/responseHandler');
const ProductCategory = require('../models/productCategory');
const Product = require('../models/product');
const Category = require('../models/category');

const { APP_URL } = process.env;

exports.getAllProductCategory = async (req, res) => {
  let { limit, page } = req.query;
  limit = parseInt(limit, 10) || 5;
  page = parseInt(page, 10) || 1;
  const url = `${APP_URL}/product?`;
  const offset = (page - 1) * limit;
  const results = await ProductCategory.findAll({
    where: {
      is_deleted: 0,
    },
    limit,
    offset,
  });
  const count = await ProductCategory.count();
  const last = Math.ceil(count / limit);
  const pageInfo = {
    prev: page > 1 ? `${url}page=${page - 1}&limit=${limit}` : null,
    next: page < last ? `${url}page=${page + 1}&limit=${limit}` : null,
    totalData: count,
    currentPage: page,
    lastPage: last,
  };
  return responseHandler(res, 200, 'List of product Categories', results, pageInfo);
};

exports.getCategoryByProduct = async (req, res) => {
  try {
    const roductCategory = await ProductCategory.findAll({
      where: {
        id_product: req.params.id_product,
      },
    });
    return responseHandler(res, 200, 'Category list', roductCategory);
  } catch (e) {
    return responseHandler(res, 500, e);
  }
};

exports.createProductCategory = async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id_product);
    const category = await Category.findByPk(req.body.id_category);
    if (!product || product.dataValues.is_deleted) {
      return responseHandler(res, 400, 'Product not found', null, null);
    }
    if (!category) {
      return responseHandler(res, 400, 'Category not found', null, null);
    }
    const checkProductCategory = await ProductCategory.findAll({
      where: {
        id_product: req.body.id_product,
        id_category: req.body.id_category,
      },
    });
    if (checkProductCategory.length > 0) {
      return responseHandler(res, 400, 'Product category already exist', null, null);
    }
    const productCategory = await ProductCategory.create(req.body);
    return responseHandler(res, 200, 'Product category created', productCategory);
  } catch (e) {
    return responseHandler(res, 400, 'Can\'t create product category', e, null);
  }
};

exports.updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.id_product) {
      const product = await Product.findByPk(req.body.id_product); // check product
      if (!product || product.dataValues.is_deleted) {
        return responseHandler(res, 400, 'Product not found', null, null);
      }
    }
    if (req.body.id_category) {
      const category = await Category.findByPk(req.body.id_category); // check category
      if (!category) {
        return responseHandler(res, 400, 'Category not found', null, null);
      }
    }
    const productCategory = await ProductCategory.findByPk(id); // check product category
    if (!productCategory || productCategory.dataValues.is_deleted) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    Object.keys(req.body).forEach((data) => {
      productCategory[data] = req.body[data];
    });
    await productCategory.save();
    return responseHandler(res, 200, 'Product updated', productCategory, null);
  } catch (e) {
    // const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    return responseHandler(res, 400, 'Can\'t update product', e, null);
  }
};

exports.deleteProductCategory = async (req, res) => {
  const { id } = req.params;
  const productCategory = await ProductCategory.findByPk(id);
  if (!productCategory || productCategory.dataValues.is_deleted) {
    return responseHandler(res, 404, 'Product category not found', null, null);
  }
  productCategory.is_deleted = 1;
  await productCategory.save();
  return responseHandler(res, 200, 'Product category was deleted', null, null);
};
