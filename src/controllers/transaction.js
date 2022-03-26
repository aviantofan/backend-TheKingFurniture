const Transaction = require('../models/transaction');
const responseHandler = require('../helpers/responseHandler');

exports.getAllTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findAll({
      where: {
        is_deleted: 0,
      },
    });
    return responseHandler(res, 200, 'List of all transactions', transaction, null);
  } catch (e) {
    return responseHandler(res, 500, 'Error', e, null);
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    return responseHandler(res, 200, 'Successfully add transaction', transaction, null);
  } catch (e) {
    return responseHandler(res, 400, 'Error', e, null);
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction || transaction.dataValues.is_deleted) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    Object.keys(req.body).forEach((x) => {
      transaction[x] = req.body[x];
    });
    await transaction.save();
    return responseHandler(res, 200, 'Transaction was updated', transaction, null);
  } catch (e) {
    return responseHandler(res, 400, 'Error', e, null);
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    if (!transaction || transaction.dataValues.is_deleted) {
      return responseHandler(res, 404, 'Data not found', null, null);
    }
    transaction.is_deleted = 1;
    await transaction.save();
    return responseHandler(res, 200, 'Transaction was deleted', null, null);
  } catch (e) {
    return responseHandler(res, 400, 'Error', e, null);
  }
};
