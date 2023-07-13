const VipModel = require("../../Models/vipModel");
const { expIncrements, vipLevels } = require("../../Utility/variable")


const VipController = {

    // VIEW VIP (token in headers)
    getVipByUser: async (req, res) => {
        try {
            const { token } = req.body
            const vipUser = await VipModel.findOne({ user: token.id }).populate("user");
            if (!vipUser) return res.status(404).json({ msg: "Not found" })
            res.status(200).json({ result: vipUser })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // CREATE VIP (REGISTER - CHECKED)
    createVip: async (req, res) => {
        try {
            const { userRegister } = req.body;
            const newVip = new VipModel({
                user: userRegister._id,
            })
            await newVip.save();
            res.status(201).json({ msg: "Create New User Successfully", user: userRegister })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },

    // Up EXP and LEVEL VIP (token in header, action in query)
    upExp: async (req, res) => {
        try {
            const { token } = req.body;
            const { action } = req.query;
            const vip = await VipModel.findOne({ user: token.id });

            // Up EXP by action query
            vip.exp += expIncrements[action] || 0;

            vip.vip = vipLevels.reduce((currentVipLevel, { expThreshold, vipLevel }) => {
                if (vip.exp >= expThreshold) {
                    return vipLevel;
                }
                return currentVipLevel;
            }, vip.vip);

            await vip.save();
            res.status(201).json({ msg: "Up Exp completed" })
        } catch (error) {
            res.status(500).json({ msg: "Server error", error: error.name })
        }
    },
}

module.exports = VipController;