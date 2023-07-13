const ImageModel = require("../../Models/imageModel");
const UserModel = require("../../Models/userModel");
const CollectionModel = require("../../Models/collectionModel");
const { token } = require("morgan");


const ImageController = {

    // UPLOAD IMAGE (attr in Body, token in Header) (CHECKED)
    upload: async (req, res) => {
        try {
            const { name, url, category, type, token } = req.body; // token in Middleware auth
            const { uid } = req.params; // uid user from client
            if (token.id !== uid) return res.status(403).json({ msg: "You Don't Have Access This Action" });

            // Create New Image
            const newImage = new ImageModel({ name, url, category, user: uid, type });
            const result = await newImage.save();

            // Update List Images by User
            await UserModel.findByIdAndUpdate(uid, { $push: { images: result._id } })
            res.status(201).json({ msg: "Upload completed", user: uid, image: result._id })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // GET ALL IMAGE (page in query) (CHECKED)
    getAllImage: async (req, res) => {
        try {
            let { page } = req.query;
            if (!page || page < 1 || isNaN(page)) page = 1;
            const pageSize = process.env.PAGE_SIZE_IMAGE || 20;
            const skip = (page - 1) * pageSize;
            const total = await ImageModel.countDocuments();
            const totalPage = Math.ceil(total / pageSize);
            let results = await ImageModel.find().skip(skip).limit(pageSize).populate("category");
            res.status(200).json({ page, total, total_page: totalPage, results });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // GET IMAGE BY ID (CHECKED)
    getImageById: async (req, res) => {
        try {
            const { id } = req.params;
            let result = await ImageModel.findById(id);
            res.status(200).json({ result });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // DELETE IMAGE (id in params) (CHECKED)
    deleteImage: async (req, res) => {
        try {
            const { id } = req.params;
            await UserModel.updateMany({ images: id }, { $pull: { images: id } });
            await CollectionModel.updateMany({ images: id }, { $pull: { images: id } })
            await ImageModel.findByIdAndDelete(id);
            res.status(201).json({ msg: "Delete Image Successfully" });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // UP ACTION LIKE, VIEW IMAGE
    upAction: async (req, res) => {
        try {
            const { action } = req.query;
            const { iid } = req.params;
            const { token } = req.body
            const image = await ImageModel.findById(iid);
            if (!image) return res.status(404).json({ msg: "Image Not Found" })
            if (action === "view") {
                image.view += 1;
                await image.save();
            }
            if (action === "like") {
                await ImageModel.findByIdAndUpdate(iid, { $push: { like: token.id } })
            }
            res.status(201).json({ msg: `Action ${action} completed` })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // UN LIKE ACTION (cid in params, token in headers) (CHECKED)
    unLike: async (req, res) => {
        try {
            const { token } = req.body;
            const { iid } = req.params;
            const image = await ImageModel.findByIdAndUpdate(iid, { $pull: { like: token.id } });
            if (!image) return res.status(404).json({ msg: "Image Not Found" })
            res.status(201).json({ msg: "Action completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },
}

module.exports = ImageController;