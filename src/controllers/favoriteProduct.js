const responseHandler = require('../helpers/responseHandler');
const FavoriteProduct = require('../models/favoriteProduct');
const Product = require('../models/product');

exports.getFavoriteList = async (req, res) => {
  try {
    const favoriteProduct = await FavoriteProduct.findAll();
    return responseHandler(res, 200, 'List of all favorite products', favoriteProduct);
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.getFavoriteByProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await FavoriteProduct.findAndCountAll({
      where: {
        id_product: id,
      },
    });
    if (favorite.length < 1) {
      return responseHandler(res, 200, 'This product has no favorite yet');
    }
    return responseHandler(res, 200, 'List favorite by product', favorite.rows, { totalData: favorite.count });
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.getFavoriteByUser = async (req, res) => {
  try {
    const favorite = await FavoriteProduct.findAndCountAll({
      where: {
        id_user: req.user.id,
      },
    });
    if (favorite.length < 1) {
      return responseHandler(res, 200, 'You has no favorite yet');
    }
    return responseHandler(res, 200, 'List favorite by user', favorite.rows, { totalData: favorite.count });
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.getFavByUserAndProduct = async (req, res) => {
  try {
    const favorite = await FavoriteProduct.findAndCountAll({
      where: {
        id_user: req.user.id,
        id_product: req.params.id,
      },
    });
    if (favorite.length < 1) {
      return responseHandler(res, 404, 'Data not found');
    }
    return responseHandler(res, 200, 'User favorite', favorite.rows, { totalData: favorite.count });
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.createFavorite = async (req, res) => {
  try {
    const product = await Product.findByPk(req.body.id_product);
    if (!product) {
      return responseHandler(res, 404, 'Product not found');
    }
    const data = {
      id_product: req.body.id_product,
      id_user: req.user.id,
    };
    const getFavorite = await FavoriteProduct.findAll({
      where: {
        id_product: data.id_product,
        id_user: data.id_user,
      },
    });
    if (getFavorite.length > 0) {
      return responseHandler(res, 400, 'You already add this product to your favorite list');
    }
    const favorite = await FavoriteProduct.create(data);
    return responseHandler(res, 200, 'Added to favorite', favorite);
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.editFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await FavoriteProduct.findByPk(id);
    if (!favorite) {
      return responseHandler(res, 404, 'Data not found');
    }
    if (req.body.id_product) {
      const product = await Product.findByPk(req.body.id_product);
      if (!product) {
        return responseHandler(res, 404, 'Product not found');
      }
    }
    const getFavorite = await FavoriteProduct.findAll({
      where: {
        id_product: req.body.id_product,
        id_user: req.user.id,
      },
    });
    if (getFavorite.length > 0) {
      return responseHandler(res, 400, 'You already add this product to your favorite list');
    }
    favorite.id_product = req.body.id_product;
    await favorite.save();
    return responseHandler(res, 200, 'Data was updated', favorite);
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await FavoriteProduct.findByPk(id);
    if (!favorite) {
      return responseHandler(res, 404, 'Data not found');
    }
    if (favorite.id_user !== req.user.id) {
      return responseHandler(res, 401, 'You are unauthorized to do this action');
    }
    await favorite.destroy();
    return responseHandler(res, 200, 'Removed from favorite');
  } catch (e) {
    let errMessage = null;
    if (e.length > 0) {
      errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    }
    return responseHandler(res, 400, 'error', errMessage);
  }
};
