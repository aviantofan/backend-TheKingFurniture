const { APP_URL } = process.env;
const { Sequelize } = require('sequelize');
const responseHandler = require('../helpers/responseHandler');
const Color = require('../models/color');

exports.getAllColor = async (req, res) => {
  try {
    const { search = '' } = req.query;
    let { limit, page } = req.query;
    limit = parseInt(limit, 10) || 10;
    page = parseInt(page, 10) || 1;
    let url = `${APP_URL}/color?`;
    if (search !== '') {
      url = `${url}name=${search}`;
    }
    const offset = (page - 1) * limit;
    const color = await Color.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${search}%`,
        },
      },
      limit,
      offset,
    });
    const count = await Color.count();
    const last = Math.ceil(count / limit);
    const pageInfo = {
      prev: page > 1 ? `${url}page=${page - 1}&limit=${limit}` : null,
      next: page < last ? `${url}page=${page + 1}&limit=${limit}` : null,
      totalData: count,
      currentPage: page,
      lastPage: last,
    };
    return responseHandler(res, 200, 'List of color palletes', color, pageInfo);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByPk(id);
    if (!color) {
      return responseHandler(res, 404, 'Color not found', null, null);
    }
    return responseHandler(res, 200, 'Color detail', color, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.addColor = async (req, res) => {
  try {
    const color = await Color.create(req.body);
    return responseHandler(res, 200, 'Successfully add new pallete', color, null);
  } catch (e) {
    const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    return responseHandler(res, 400, 'Error', errMessage, null);
  }
};

exports.editColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByPk(id);
    if (!color) {
      return responseHandler(res, 404, 'Color not found', null, null);
    }
    Object.keys(req.body).forEach((data) => {
      color[data] = req.body[data];
    });
    await color.save();
    return responseHandler(res, 200, 'Successfully update color pallete', color, null);
  } catch (e) {
    const errMessage = e.errors.map((err) => ({ field: err.path, message: err.message }));
    return responseHandler(res, 400, 'Error', errMessage, null);
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await Color.findByPk(id);
    if (!color) {
      return responseHandler(res, 404, 'Color pallete not found', null, null);
    }
    await color.destroy();
    return responseHandler(res, 200, 'Color was deleted', null, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};
