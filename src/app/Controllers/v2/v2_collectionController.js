const CollectionModel = require("../../Models/collectionModel");
const UserModel = require("../../Models/userModel");
const ImageModel = require("../../Models/imageModel");

const CollectionsController = {

    // CREATE COLLECTION (attr in body, token in headers) (CHECKED)
    create: async (req, res) => {
        try {
            const { title, type, tag, category } = req.body;
            const { token } = req.body;
            const newCollection = new CollectionModel({
                title, type, tag, category, user: token.id
            })
            const collection = await newCollection.save();
            await UserModel.findByIdAndUpdate(token.id, { $push: { collections: collection._id } })
            res.status(201).json({ msg: "Create Collection Successfully", collection: collection })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // FIND COLLECTION BY TAG (tag, page in query) (CHECKED)
    findCollectionByTag: async (req, res) => {
        try {
            let { tag, page } = req.query;
            if (!page || page < 1 || isNaN(page)) page = 1;
            const pageSize = process.env.PAGE_SIZE_IMAGE || 20;
            const skip = (page - 1) * pageSize;
            const collections = await CollectionModel.find({ tag }).skip(skip).limit(pageSize);
            res.status(200).json({ tag_name: tag, page, total: collections.length, results: collections });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // ADD IMAGE TO COLLECTION (id_image in body, collection_id in params)
    addImage: async (req, res) => {
        try {
            const { cid } = req.params; // collection-id
            const { id_image } = req.body;
            const collection = await CollectionModel.findByIdAndUpdate(cid, { $push: { images: id_image } });
            if (!collection) return res.status(404).json({ msg: "Collection not found" })

            await ImageModel.findByIdAndUpdate(id_image, { $push: { collections: cid } });

            res.status(201).json({ msg: "Add Image Successfully" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // UP ACTION (action in query, token in Headers, cid in params)
    upAction: async (req, res) => {
        try {
            const { action } = req.query;
            const { cid } = req.params;
            const collections = await CollectionModel.findById(cid);
            if (action === "view") {
                collections.view += 1;
            }
            if (action === "like") {
                collections.like += 1;
            }
            await collections.save();
            res.status(201).json({ msg: `Action ${action} completed` })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // UN LIKE ACTION (cid in params, token in headers) (CHECKED)
    unLike: async (req, res) => {
        try {
            const { cid } = req.params;
            const collection = await CollectionModel.findById(cid);
            if (collection.like > 0) collection.like -= 1;
            await collection.save();
            res.status(201).json({ msg: "Action completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // CHANGE INFORMATION (cid in params, token in Headers, attr in body) (CHECKED)
    changeInformation: async (req, res) => {
        try {
            const { cid } = req.params;
            const { title, type, category, token, user_id } = req.body;
            if (token.id !== user_id) return res.status(403).json({ msg: "You Don't Have Access" });
            const updateCollection = await CollectionModel.findByIdAndUpdate(cid, { title, type, category }, { new: true });
            res.status(201).json({ msg: "Action completed", collection: updateCollection })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // DELETE COLLECTION (cid in params, token in Headers, user_id in body) (CHECKED)
    deleteCollection: async (req, res) => {
        try {
            const { cid } = req.params;
            const { token, user_id } = req.body;

            if (token.id !== user_id) return res.status(403).json({ msg: "You Don't Have Access" });

            await UserModel.findByIdAndUpdate(token.id, { $pull: { collections: cid } })
            await ImageModel.updateMany({ collections: cid, user: token.id }, { $pull: { collections: cid } })
            await CollectionModel.findByIdAndDelete(cid);

            res.status(201).json({ msg: "Delete Collection Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    }
}

module.exports = CollectionsController;