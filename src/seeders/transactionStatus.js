const TransactionStatus = require('../models/transactionStatus');

const transactionStatuses = async () => {
  const transactionStatus = await TransactionStatus.findAll();

  const seedTransactionStatus = [
    { name: 'In cart' },
    { name: 'Paid' },
    { name: 'Processed' },
    { name: 'Shipping' },
    { name: 'Sent' },
  ];

  if (transactionStatus.length === 0) {
    await TransactionStatus.bulkCreate(seedTransactionStatus);
  }
};

module.exports = transactionStatuses;
