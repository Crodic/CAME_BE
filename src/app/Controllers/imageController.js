const ImageModel = require("../Models/imageModel");
const UserModel = require("../Models/userModel");
const CollectionModel = require("../Models/collectionModel");


const ImageController = {
    upload: async (req, res) => {
        try {
            const { name, url, category, type } = req.body;
            const { id } = req.params;
            const newImage = new ImageModel({ name, url, category, user: id, type });
            const result = await newImage.save();
            await UserModel.findByIdAndUpdate(id, { $push: { images: result._id } })
            res.status(201).json({ msg: "Upload completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    getAllImage: async (req, res) => {
        try {
            let { page } = req.query;
            if (!page || page < 1 || isNaN(page)) page = 1;
            const pageSize = process.env.PAGE_SIZE_IMAGE;
            const skip = (page - 1) * pageSize;
            const total = await ImageModel.countDocuments();
            const totalPage = Math.ceil(total / pageSize);
            let results = await ImageModel.find().skip(skip).limit(pageSize).populate("category");
            res.status(200).json({ page, total, total_page: totalPage, results });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    getImageById: async (req, res) => {
        try {
            const { id } = req.params;
            let result = await ImageModel.findById(id);
            res.status(200).json({ result });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { image_id } = req.body
            await UserModel.updateMany({ images: image_id }, { $pull: { images: image_id } });
            await CollectionModel.updateMany({ images: image_id }, { $pull: { images: image_id } })
            await ImageModel.findByIdAndDelete(image_id);
            res.status(201).json({ msg: "Delete Image Successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    }
}

module.exports = ImageController;