const mongoose = require('mongoose');

const supermarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }, // URL of the logo
  description: { type: String, required: true }, // Description of the supermarket
  branches: [{ type: String, required: true }], // List of branch names
  phone: { type: String, required: true }, // Phone number for the supermarket
  link: { type: String, required: true } // Website or external link for the supermarket
});

module.exports = mongoose.model('Supermarket', supermarketSchema);
