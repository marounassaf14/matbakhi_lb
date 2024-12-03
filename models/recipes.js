const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    imageUrl: { type: String, required: true } // Add imageUrl field
});

module.exports = mongoose.model('Recipe', recipeSchema);
