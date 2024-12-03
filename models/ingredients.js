const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Add imageUrl field
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
