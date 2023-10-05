const db = require("../models");
const branches = db.Branches;

module.exports = {
	getAllBranches: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 8;
			const totalBranches = await branches.count();
			const result = await branches.findAll({
				limit,
				offset: limit * (page - 1),
			});
			res.status(200).send({
				page,
				totalPage: Math.ceil(totalBranches / limit),
				result,
			});
		} catch (err) {
			res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
