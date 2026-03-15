const Customer = require("../models/Customer");

function camelToSnake(data) {
  return {
    account_number: (data.accountNumber ?? "").toUpperCase(),
    due_date: data.dueDate,
    last_name: (data.lastName ?? "").toUpperCase(),
    first_name: (data.firstName ?? "").toUpperCase(),
    middle_name: (data.middleName ?? "").toUpperCase(),
    address: (data.address ?? "").toUpperCase(),
    contact: data.contact,
  };
}

function snakeToCamel(data) {
  return {
    id: data._id,
    accountNumber: data.account_number,
    dueDate: data.due_date,
    lastName: data.last_name,
    firstName: data.first_name,
    middleName: data.middle_name,
    address: data.address,
    contact: data.contact,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(camelToSnake(req.body));
    res.status(201).json(snakeToCamel(customer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
exports.getCustomers = async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [
            { account_number: { $regex: search, $options: "i" } },
            { first_name: { $regex: search, $options: "i" } },
            { last_name: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const customers = await Customer.find(filter);
    res.json(customers.map(snakeToCamel));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.json(snakeToCamel(customer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      camelToSnake(req.body),
      {
        new: true,
      },
    );
    res.json(snakeToCamel(customer));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
