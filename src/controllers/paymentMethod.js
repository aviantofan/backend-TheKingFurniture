const { cloudPathToFileName } = require('../helpers/converter');
const { deleteImages } = require('../helpers/deleteArrayImages');
const { deleteFile } = require('../helpers/fileHandler');
const responseHandler = require('../helpers/responseHandler');
const PaymentMethod = require('../models/paymentMethod');

exports.getAllPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findAll();
    return responseHandler(res, 200, 'List of payment methods', paymentMethod, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    return responseHandler(res, 200, 'List of payment methods', paymentMethod, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.createPaymentMethod = async (req, res) => {
  try {
    const data = { name: req.body.name, image: req.files[0].path };
    const paymentMethod = await PaymentMethod.create(data);
    if (!paymentMethod) {
      if (req.files) {
        deleteImages(req.files);
      }
      return responseHandler(res, 500, 'Unexpected error', null, null);
    }
    return responseHandler(res, 200, 'Successfully add new payment method', paymentMethod, null);
  } catch (e) {
    if (req.files) {
      deleteImages(req.files);
    }
    return responseHandler(res, 400, 'Error', e, null);
  }
};

exports.editPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    Object.keys(req.body).forEach((data) => {
      paymentMethod[data] = req.body[data];
    });
    if (req.files) {
      paymentMethod.image = req.files[0].path;
    }
    await paymentMethod.save();
    return responseHandler(res, 200, 'Successfully updated data', paymentMethod, null);
  } catch (e) {
    if (req.files) {
      deleteImages(req.files);
    }
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};

exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    if (paymentMethod.dataValues.image) {
      deleteFile(cloudPathToFileName(paymentMethod.dataValues.image));
    }
    await paymentMethod.destroy();
    return responseHandler(res, 200, 'Successfully deleted data', null, null);
  } catch (e) {
    return responseHandler(res, 500, 'Unexpected error', null, null);
  }
};
