const Sequelize = require('sequelize');
const responseHandler = require('../helpers/responseHandler');
const DeliveryMethod = require('../models/deliveryMethod');

exports.getDeliveryMethod = async (req, res) => {
  try {
    const { name = '' } = req.query;
    const results = await DeliveryMethod.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${name}%`,
        },
      },
    });
    return responseHandler(res, 200, 'List of delivery methods', results, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeliveryMethod.findByPk(id);
    if (!result) {
      return responseHandler(res, 404, 'Method not exist', null, null);
    }
    return responseHandler(res, 200, 'Delivery method detail', result, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.addDeliveryMethod = async (req, res) => {
  try {
    const addMethod = await DeliveryMethod.create(req.body);
    return responseHandler(res, 200, 'Delivery method added', addMethod, null);
  } catch (e) {
    return responseHandler(res, 500, e.errors, null, null);
  }
};

exports.updateDeliveryMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryMethod.findByPk(id);
    if (!delivery) {
      return responseHandler(res, 404, 'Delivery method not exist', null, null);
    }
    Object.keys(req.body).forEach((data) => {
      delivery[data] = req.body[data];
    });
    await delivery.save();
    return responseHandler(res, 200, 'Updated', delivery, null);
  } catch (e) {
    return responseHandler(res, 500, e, null, null);
  }
};

exports.deleteDeliveryMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryMethod = await DeliveryMethod.findByPk(id);
    if (!deliveryMethod) {
      return responseHandler(res, 404, 'Delivery method not exist', null, null);
    }
    await deliveryMethod.destroy();
    return responseHandler(res, 200, 'Deleted', null, null);
  } catch (e) {
    return responseHandler(res, 500, e, null, null);
  }
};
