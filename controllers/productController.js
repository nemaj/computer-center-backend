const Product = require("../models/Product");

function camelToSnake(data) {
  return {
    name: data.name,
    sku: data.sku,
    price: data.price,
    cost: data.cost,
    is_active: data.isActive,
  };
}

function snakeToCamel(data) {
  return {
    name: data.name,
    sku: data.sku,
    price: data.price,
    cost: data.cost,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(camelToSnake(req.body));
    res.status(201).json(snakeToCamel(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [{ name: { $regex: search, $options: "i" } }],
        }
      : {};
    const products = await Product.find(filter)
      .sort({ _id: 1 }) // newest first
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Product.countDocuments();

    res.json({
      page,
      totalpages: Math.ceil(total / limit),
      totalCount: total,
      products: products.map(snakeToCamel),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(snakeToCamel(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      camelToSnake(req.body),
      {
        new: true,
      },
    );
    res.json(snakeToCamel(product));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
