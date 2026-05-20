const Property = require("../models/Property");

exports.getProperties = async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
};

exports.addProperty = async (req, res) => {
  const property = new Property(req.body);
  await property.save();
  res.json(property);
};