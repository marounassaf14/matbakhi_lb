// server.js
const express = require('express'); 
const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');  // For hashing passwords
const app = express(); 
const port = 3000;

const USER = require('./models/users');
const RECIPE = require('./models/recipes');
const Supermarket = require('./models/supermarkets');

const Ingredient = require('./models/ingredients'); // Adjust path as per your project structure


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200'  // Allow requests from Angular's dev server
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://marounassaf14:assafmaroun1998@cluster0.wqgf2.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Sign Up endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !age || !email || !password) {
            return res.status(400).json({ message: "Name, age, email, and password are required" });
        }

        // Check if the email is already registered
        const existingUser = await USER.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = new USER({ name, age, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User signed up successfully", user: { name, age, email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Sign In endpoint
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await USER.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please check your email and try again." });
        }

        if (!user.password) {
            // More specific error if password is missing from the user document
            return res.status(500).json({
                message: "User record is incomplete. Password information is missing. Please contact support."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password. Please try again." });
        }

        res.status(200).json({
            message: "Sign-in successful",
            user: { name: user.name, age: user.age, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
});



// Get USER data
app.get('/api/users', async (req, res) => {
    try {
        const name = req.query.name;  // Get the name from query parameters
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const user = await USER.findOne({ name });  // Find the document where the name matches
        if (!user) {
            return res.status(404).json({ message: "USER not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/recipes', async (req, res) => {
    try {
        // Extract ingredients from query parameters
        const ingredients = req.query.ingredients ? req.query.ingredients.split(',') : [];

        // Validate that ingredients are provided
        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ message: "No ingredients provided" });
        }

        // Create case-insensitive regex patterns for each ingredient
        const ingredientPatterns = ingredients.map(ingredient => new RegExp(`^${ingredient.trim()}$`, 'i'));

        // Search for recipes that contain all specified ingredients (case-insensitive)
        const recipes = await RECIPE.find({
            ingredients: { $all: ingredientPatterns }
        });

        // Handle case where no matching recipes are found
        if (recipes.length === 0) {
            return res.status(404).json({ message: "No recipes found with the specified ingredients" });
        }

        // Return the matching recipes
        res.json(recipes);
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ message: err.message });
    }
});


// Add one or multiple recipes
app.post('/api/recipes', async (req, res) => {
    try {
        const data = req.body;

        // Check if the request body is an array
        if (Array.isArray(data)) {
            // Handle multiple recipes
            if (data.length === 0) {
                return res.status(400).json({ message: "An array of recipes is required" });
            }

            // Validate each recipe in the array
            for (const recipe of data) {
                const { name, description, ingredients, imageUrl } = recipe;
                if (!name || !description || !ingredients || ingredients.length === 0 || !imageUrl) {
                    return res.status(400).json({ message: "Each recipe must have a name, description, ingredients, and imageUrl" });
                }
            }

            // Insert multiple recipes with imageUrl
            const newRecipes = await RECIPE.insertMany(data);
            return res.status(201).json({ message: "Recipes added successfully", recipes: newRecipes });
        
        } else {
            // Handle a single recipe
            const { name, description, ingredients, imageUrl } = data;

            // Validate the single recipe
            if (!name || !description || !ingredients || ingredients.length === 0 || !imageUrl) {
                return res.status(400).json({ message: "Name, description, ingredients, and imageUrl are required" });
            }

            // Insert the single recipe with imageUrl
            const newRecipe = new RECIPE({ name, description, ingredients, imageUrl });
            await newRecipe.save();
            return res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Edit a recipe by name
app.put('/api/recipes', async (req, res) => {
    try {
        const { name } = req.query; // Recipe name passed as a query parameter
        const { newName, description, ingredients, imageUrl } = req.body;

        // Validate that the recipe name to search is provided
        if (!name) {
            return res.status(400).json({ message: "Recipe name is required as a query parameter" });
        }

        // Validate that at least one field is provided to update
        if (!newName && !description && !ingredients && !imageUrl) {
            return res.status(400).json({ message: "At least one field (newName, description, ingredients, imageUrl) must be provided for update" });
        }

        // Build the update object dynamically
        const updateFields = {};
        if (newName) updateFields.name = newName;
        if (description) updateFields.description = description;
        if (ingredients && ingredients.length > 0) updateFields.ingredients = ingredients;
        if (imageUrl) updateFields.imageUrl = imageUrl;

        // Find the recipe by name (case-insensitive) and update
        const updatedRecipe = await RECIPE.findOneAndUpdate(
            { name: { $regex: `^${name}$`, $options: 'i' } }, // Case-insensitive match
            updateFields,
            { new: true } // Return the updated recipe
        );

        // Handle case where no matching recipe is found
        if (!updatedRecipe) {
            return res.status(404).json({ message: "Recipe not found with the specified name" });
        }

        // Return the updated recipe
        res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (err) {
        console.error('Error updating recipe:', err);
        res.status(500).json({ message: err.message });
    }
});



// Get paginated recipes with imageUrl
app.get('/api/recipes/all', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const term = req.query.term ? req.query.term.toLowerCase() : '';

        const skip = (page - 1) * limit;

        let query = {};

        if (term) {
            // Split the term by commas and create a regex for each ingredient
            const terms = term.split(',').map(t => t.trim());
            const ingredientPatterns = terms.map(ingredient => new RegExp(`^${ingredient}$`, 'i'));

            // Match recipes containing all the specified ingredients
            query = { ingredients: { $all: ingredientPatterns } };
        }

        const recipes = await RECIPE.find(query).skip(skip).limit(limit);
        const totalRecipes = await RECIPE.countDocuments(query);

        res.json({
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ message: err.message });
    }
});



app.get('/api/recipes/name', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const term = req.query.term ? req.query.term.toLowerCase() : '';

        const skip = (page - 1) * limit;

        // Build the query to match the recipe name (case-insensitive)
        const query = term
            ? { name: { $regex: term, $options: 'i' } } // Matches term anywhere in the name
            : {};

        // Debugging: Log the query
        console.log('Query:', JSON.stringify(query));

        const recipes = await RECIPE.find(query).skip(skip).limit(limit);
        const totalRecipes = await RECIPE.countDocuments(query);

        res.json({
            recipes,
            totalPages: Math.ceil(totalRecipes / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Error fetching recipes by name:', err);
        res.status(500).json({ message: err.message });
    }
});


// Delete all recipes
app.delete('/api/recipes', async (req, res) => {
    try {
        // Delete all documents in the recipes collection
        const result = await RECIPE.deleteMany({});
        
        res.status(200).json({
            message: "All recipes have been deleted successfully.",
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post('/api/ingredients', async (req, res) => {
    const ingredients = req.body;

    if (Array.isArray(ingredients)) {
        // Handle multiple ingredients
        try {
            const newIngredients = await Ingredient.insertMany(ingredients);
            res.status(201).json({ message: 'Ingredients added successfully', data: newIngredients });
        } catch (error) {
            res.status(400).json({ error: 'Error adding ingredients', details: error.message });
        }
    } else {
        // Handle single ingredient
        try {
            const newIngredient = new Ingredient(ingredients);
            await newIngredient.save();
            res.status(201).json({ message: 'Ingredient added successfully', data: newIngredient });
        } catch (error) {
            res.status(400).json({ error: 'Error adding ingredient', details: error.message });
        }
    }
});

app.get('/api/ingredients/all', async (req, res) => {
    const { page = 1, limit = 9, term = '' } = req.query;
    const skip = (page - 1) * limit;

    try {
        const query = term ? { name: { $regex: term, $options: 'i' } } : {};
        const ingredients = await Ingredient.find(query).skip(skip).limit(Number(limit));
        const totalCount = await Ingredient.countDocuments(query);

        res.json({
            ingredients,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});

app.delete('/api/ingredients', async (req, res) => {
    try {
        const result = await Ingredient.deleteMany({});
        res.status(200).json({ message: 'All ingredients deleted successfully', deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete ingredients', details: error.message });
    }
});

// POST endpoint to add a new supermarket
app.post('/api/supermarkets', async (req, res) => {
    try {
        const { name, logo, description, branches, phone, link } = req.body;

        // Validate the required fields
        if (!name || !logo || !description || !branches || !phone || !link) {
            return res.status(400).json({ 
                message: 'All fields are required: name, logo, description, branches, phone, link' 
            });
        }

        // Create a new supermarket instance
        const supermarket = new Supermarket({ 
            name, 
            logo, 
            description, 
            branches, 
            phone, 
            link 
        });

        // Save the supermarket to the database
        await supermarket.save();
        res.status(201).json({ message: 'Supermarket added successfully', supermarket });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add supermarket', error: error.message });
    }
});

// GET endpoint to fetch all supermarkets
app.get('/api/supermarkets', async (req, res) => {
    try {
        const supermarkets = await Supermarket.find();
        res.status(200).json({ supermarkets });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch supermarkets', error: error.message });
    }
});

// DELETE endpoint to delete all supermarkets
app.delete('/api/supermarkets', async (req, res) => {
    try {
        const result = await Supermarket.deleteMany({});
        res.status(200).json({ 
            message: 'All supermarkets deleted', 
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete supermarkets', error: error.message });
    }
});

  
  app.get('/api/recipes/suggestions', async (req, res) => {
    try {
        const term = req.query.term ? req.query.term.toLowerCase() : '';

        if (!term) {
            return res.json([]);
        }

        const suggestions = await RECIPE.find(
            { name: { $regex: term, $options: 'i' } }, // Partial and case-insensitive match
            { name: 1, description: 1, ingredients: 1, imageUrl: 1 } // Include necessary fields
        ).limit(5);

        console.log('Suggestions:', suggestions); // Debugging
        res.json(suggestions);
    } catch (err) {
        console.error('Error fetching suggestions:', err);
        res.status(500).json({ message: err.message });
    }
});



app.listen(port, () => { 
    console.log(`Server listening on port ${port}`);
});
