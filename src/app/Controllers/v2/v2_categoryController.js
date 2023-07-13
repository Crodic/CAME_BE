const CategoriesModel = require("../../Models/categoryModel");

const CategoryController = {
    //GET ALL CATEGORIES
    getAll: async (req, res) => {
        try {
            let total = await CategoriesModel.countDocuments();
            let results = await CategoriesModel.find();
            res.status(200).json({ total, results })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    //GET CATEGORY
    getCategory: async (req, res) => {
        try {
            const { id } = req.params;
            let result = await CategoriesModel.findById(id);
            res.status(200).json({ category_id: id, result })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    //CREATE CATEGORY
    createCategory: async (req, res) => {
        try {
            let { name } = req.body;
            if (!name) name = "Artist";
            const newCategory = new CategoriesModel({
                name
            })
            await newCategory.save();
            res.status(201).json({ msg: "Create Category Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    }
}

module.exports = CategoryController;