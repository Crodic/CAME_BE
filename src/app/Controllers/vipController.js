const VipModel = require("../Models/vipModel");

const VipController = {
    // GET VIP
    getVipByUser: async (req, res) => {
        try {
            const { id } = req.body.user
            const result = await VipModel.findOne({ user: id }).populate("user");
            res.status(200).json({ result })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    //CREATE VIP AUTO
    createVip: async (req, res) => {
        try {
            const { result } = req.body;
            const newVip = new VipModel({
                user: result._id,
            })
            await newVip.save();
            res.status(201).json({ msg: "Create New User Successfully", success: "true", result })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    //UP EXP ACTIONS
    upExp: async (req, res) => {
        try {
            const { id } = req.body.user;
            const { action } = req.query;
            const vip = await VipModel.findOne({ user: id });
            if (action === "like") {
                vip.exp += 10;
            } else if (action === "upload") {
                vip.exp += 20;
            } else if (action === "comment") {
                vip.exp += 5
            }

            if (vip.exp >= 12000) {
                vip.vip = 12;
            } else if (vip.exp >= 10000) {
                vip.vip = 11;
            } else if (vip.exp >= 9500) {
                vip.vip = 10;
            } else if (vip.exp >= 8000) {
                vip.vip = 9;
            } else if (vip.exp >= 7000) {
                vip.vip = 8;
            } else if (vip.exp >= 6000) {
                vip.vip = 7;
            } else if (vip.exp >= 5000) {
                vip.vip = 6;
            } else if (vip.exp >= 4000) {
                vip.vip = 5;
            } else if (vip.exp >= 3000) {
                vip.vip = 4;
            } else if (vip.exp >= 2000) {
                vip.vip = 3;
            } else if (vip.exp >= 1000) {
                vip.vip = 2;
            } else if (vip.exp >= 200) {
                vip.vip = 1;
            }
            await vip.save();
            res.status(201).json({ msg: "Up Exp completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    }
}

module.exports = VipController;