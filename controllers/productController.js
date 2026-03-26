const mongoose = require("mongoose");
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
    id: data._id,
    name: data.name,
    sku: data.sku,
    price: data.price,
    cost: data.cost,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    totalStock: data.totalStock,
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
  const limit = parseInt(req.query.limit) || 10;

  try {
    const search = req.query.search || "";

    const pipeline = [];

    if (search) {
      pipeline.push({
        $match: {
          name: { $regex: search, $options: "i" },
        },
      });
    }

    pipeline.push(
      // {
      //   $addFields: {
      //     productId: { $toString: "$_id" },
      //   },
      // },
      {
        $lookup: {
          from: "inventorytransactions",
          localField: "_id",
          foreignField: "product_id",
          as: "transactions",
        },
      },
    );
    pipeline.push({
      $addFields: {
        totalStock: {
          $sum: {
            $map: {
              input: "$transactions",
              as: "t",
              in: {
                $cond: [
                  { $eq: ["$$t.type", "IN"] },
                  "$$t.quantity",
                  { $multiply: ["$$t.quantity", -1] },
                ],
              },
            },
          },
        },
      },
    });
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        sku: 1,
        price: 1,
        cost: 1,
        is_active: 1,
        totalStock: 1,
      },
    });
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const products = await Product.aggregate(pipeline);

    // const search = req.query.search;
    // const filter = search
    //   ? {
    //       $or: [{ name: { $regex: search, $options: "i" } }],
    //     }
    //   : {};

    // const products = await Product.find(filter)
    //   .sort({ _id: 1 }) // newest first
    //   .skip((page - 1) * limit)
    //   .limit(limit);

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
    const productId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },

      // Lookup all inventory transactions
      {
        $lookup: {
          from: "inventorytransactions",
          localField: "_id",
          foreignField: "product_id",
          as: "transactions",
        },
      },

      // Calculate totalStock
      {
        $addFields: {
          totalStock: {
            $sum: {
              $map: {
                input: "$transactions",
                as: "t",
                in: {
                  $cond: [
                    { $eq: ["$$t.type", "IN"] },
                    "$$t.quantity",
                    { $multiply: ["$$t.quantity", -1] },
                  ],
                },
              },
            },
          },
        },
      },

      // Project fields to return
      {
        $project: {
          _id: 1,
          name: 1,
          sku: 1,
          price: 1,
          cost: 1,
          is_active: 1,
          totalStock: 1,
        },
      },
    ];

    const result = await Product.aggregate(pipeline);

    if (!result.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(snakeToCamel(result[0]));
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
