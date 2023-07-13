const CollectionModel = require("../Models/collectionModel");
const ImageModel = require("../Models/imageModel");
const UserModel = require("../Models/userModel");

const CollectionsController = {

    // CREATE COLLECTION
    create: async (req, res) => {
        try {
            const { title, type, tag, category } = req.body;
            const { id } = req.body.user;
            const newCollection = new CollectionModel({
                title, type, tag, category, user: id
            })
            const collection = await newCollection.save();
            await UserModel.findByIdAndUpdate(id, { $push: { collections: collection._id } })
            res.status(201).json({ msg: "Create Collection Successfully" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // FIND COLLECTION BY TAG NAME
    findCollectionByTag: async (req, res) => {
        try {
            const { tag } = req.query;
            const collections = await CollectionModel.find({ tag });
            res.status(200).json({ tag_name: tag, results: collections });
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // ADD IMAGE ON COLLECTION
    addImage: async (req, res) => {
        try {
            const { id } = req.params; // collection-id
            const { id_image } = req.body;
            const getCollection = await CollectionModel.findByIdAndUpdate(id, { $push: { images: id_image } });
            if (!getCollection) return res.status(404).json({ msg: "Collection not found" })
            await ImageModel.findByIdAndUpdate(id_image, { $push: { collections: id } });
            res.status(201).json({ msg: "Add Image Successfully" })
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // UP View / LIKE
    upAction: async (req, res) => {
        try {
            const { view, like } = req.query;
            const { id } = req.params;
            const collections = await CollectionModel.findById(id);
            if (view) {
                collections.view += 1;
                await collections.save();
            }
            if (like) {
                collections.like += 1;
                await collections.save();
            }
            res.status(201).json({ msg: "Action completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },
    // DOWN LIKE
    downLike: async (req, res) => {
        try {
            const { id } = req.params;
            const collections = await CollectionModel.findById(id);
            collections.like -= 1;
            await collections.save();
            res.status(201).json({ msg: "Action completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // Change Information Collection
    changeInformation: async (req, res) => {
        try {
            const { title, type, category, id } = req.body;
            await CollectionModel.findByIdAndUpdate(id, { title, type, category });
            res.status(201).json({ msg: "Action completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    },

    // DELETE COLLECTION - NO TEST
    deleteCollection: async (req, res) => {
        try {
            const { id } = req.body;
            const userId = req.params.id;
            await UserModel.findByIdAndUpdate(userId, { $pull: { collections: id } })
            await ImageModel.updateMany({ collections: id, user: userId }, { $pull: { collections: id } })
            await CollectionModel.findByIdAndDelete(id);
            res.status(201).json({ msg: "Delete Collection Successfully" })
        } catch (error) {
            res.status(500).json({ msg: "Server Error", error: error.name })
        }
    }
}

module.exports = CollectionsController;