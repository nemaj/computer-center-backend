const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    sku: String,
    price: Number,
    cost: Number,
    is_active: Boolean,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Product", ProductSchema);
