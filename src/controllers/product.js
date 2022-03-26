const Sequelize = require('sequelize');
const { cloudPathToFileName } = require('../helpers/converter');
const { deleteImages } = require('../helpers/deleteArrayImages');
const { deleteFile } = require('../helpers/fileHandler');
const responseHandler = require('../helpers/responseHandler');
const Category = require('../models/category');
const Product = require('../models/product');
const ProductCategory = require('../models/productCategory');
const ProductImage = require('../models/productImage');

const { APP_URL } = process.env;

exports.getAllProduct = async (req, res) => {
  const { search = '' } = req.query;
  let {
    minPrice, maxPrice, limit, page,
  } = req.query;
  minPrice = parseInt(minPrice, 10) || 0;
  maxPrice = parseInt(maxPrice, 10) || 100000000;
  limit = parseInt(limit, 10) || 20;
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
      { model: ProductImage },
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
  const count = await Product.count({
    where: {
      is_deleted: 0,
    },
  });
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
    const listIdCategory = req.body.id_category.split(',');
    if (listIdCategory.length < 1) {
      return responseHandler(res, 400, 'Please enter at least 1 category', null, null);
    }
    const product = await Product.create(req.body);
    const data = { id_product: product.dataValues.id };
    if (req.files) {
      req.files.forEach(async (pic) => {
        data.image = pic.path;
        const productImage = await ProductImage.create(data);
        if (!productImage) {
          deleteImages(req.files);
          return responseHandler(res, 400, 'Cant upload image', null, null);
        }
      });
    }
    listIdCategory.forEach(async (x) => {
      const getCategory = await Category.findByPk(x);
      if (!getCategory) {
        return responseHandler(res, 404, 'Category not found');
      }
      data.id_category = x;
      const productCategory = await ProductCategory.create(data);
    });
    const getProduct = await Product.findAll({
      include: [
        { model: ProductImage },
      ],
      where: {
        id: product.dataValues.id,
      },
    });
    return responseHandler(res, 200, 'Product created', getProduct);
  } catch (e) {
    // const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    if (req.files) {
      deleteImages(req.files);
    }
    return responseHandler(res, 400, 'Can\'t create product', e, null);
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
    if (!product || product.dataValues.is_deleted) {
      if (req.files) {
        deleteImages(req.files);
      }
      return responseHandler(res, 404, 'Product not found', null, null);
    }
    Object.keys(req.body).forEach((data) => {
      product[data] = req.body[data];
    });
    await product.save();
    const productImage = await ProductImage.findAll({
      where: {
        id_product: product.dataValues.id,
      },
    });
    if (productImage.length + req.files.length > 10) {
      return responseHandler(res, 400, 'Maximum image for each product is 10 images. Please delete some images first to continue');
    }
    const data = { id_product: id };
    if (req.files) {
      req.files.forEach(async (pic) => {
        data.image = pic.path;
        const productImages = await ProductImage.create(data);
        if (!productImages) {
          deleteImages(req.files);
          return responseHandler(res, 400, 'Cant upload image', null, null);
        }
      });
    }
    return responseHandler(res, 200, 'Product updated', product, null);
  } catch (e) {
    if (req.files) {
      deleteImages(req.files);
    }
    return responseHandler(res, 400, 'Can\'t update product', e, null);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByPk(id);
  if (product && product.dataValues.is_deleted === false) {
    product.is_deleted = 1;
    await product.save();
    const productImage = await ProductImage.findAll({
      where: {
        id_product: id,
      },
    });
    if (productImage) {
      productImage.map(async (data) => {
        deleteFile(cloudPathToFileName(data.image));
        await data.destroy();
      });
    }
    const productCategory = await ProductCategory.findAll({
      where: {
        id_product: id,
      },
    });
    if (productCategory) {
      productCategory.map(async (data) => {
        await data.destroy();
      });
    }
    return responseHandler(res, 200, 'Product was deleted', null, null);
  }
  return responseHandler(res, 404, 'Product not found', null, null);
};
