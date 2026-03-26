const InventoryTransaction = require("../models/InventoryTransaction");

function camelToSnake(data) {
  return {
    product_id: data.productId,
    type: data.type,
    quantity: data.quantity,
    notes: data.notes,
  };
}

function snakeToCamel(data) {
  return {
    id: data._id,
    productId: data.product_id,
    type: data.type,
    quantity: data.quantity,
    notes: data.notes,
    date: data.date,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// CREATE
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await InventoryTransaction.create(
      camelToSnake(req.body),
    );
    res.status(201).json(snakeToCamel(transaction));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getTransactions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const productId = req.query.productId;
    const transactions = await InventoryTransaction.find({
      product_id: productId,
    })
      .sort({ date: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await InventoryTransaction.countDocuments();

    res.json({
      page,
      totalpages: Math.ceil(total / limit),
      totalCount: total,
      transactions: transactions.map(snakeToCamel),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await InventoryTransaction.findByIdAndUpdate(
      req.params.id,
      camelToSnake(req.body),
      {
        new: true,
      },
    );
    res.json(snakeToCamel(transaction));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
