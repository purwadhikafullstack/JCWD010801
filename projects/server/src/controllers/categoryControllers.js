const db = require("../models");
const categories = db.Categories;

module.exports = {
	getCategoriesUser: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 8;
			const totalCategories = await categories.count({
				where: { isDeleted: false },
			});
			const result = await categories.findAll({
				where: { isDeleted: false },
				limit,
				offset: limit * (page - 1),
			});
			res.status(200).send({
				page,
				totalPage: Math.ceil(totalCategories / limit),
				result,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	getCategoriesAdmin: async (req, res) => {
		try {
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 8;
			const totalCategories = await categories.count();
			const result = await categories.findAll({
				limit,
				offset: limit * (page - 1),
			});
			res.status(200).send({
				page,
				totalPage: Math.ceil(totalCategories / limit),
				result,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	getCategoryById: async (req, res) => {
		try {
			if (!req.params.id) {
				return res.status(400).send({
					status: 400,
					message: "Please input a category ID.",
				});
			}

			const result = await categories.findOne({
				where: {
					id: req.params.id,
				},
			});

			if (!result) {
				return res.status(404).send({
					status: 404,
					message: "Category not found. Please input a valid category ID.",
				});
			}

			res.status(200).send({
				result,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	addCategory: async (req, res) => {
		try {
			const { category } = req.body;
			const imgURL = req.file.filename;
			const result = await categories.create({
				category,
				imgURL,
			});
			res.status(201).send({
				status: 201,
				message: "New category created successfully.",
				newCategory: result,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	updateCategory: async (req, res) => {
		try {
			const { category } = req.body;
			const imgURL = req.file.filename;

			let result = await categories.findOne({ where: { id: req.params.id } });
			if (!result) throw { message: "Category not found" };
			await categories.update(
				{ category, imgURL },
				{
					where: { id: result.id },
				}
			);

			res.status(200).send({
				status: true,
				message: "Category updated",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	deleteCategory: async (req, res) => {
		try {
			let result = await categories.findOne({ where: { id: req.params.id } });
			if (!result) throw { message: "Category not found" };
			await categories.update(
				{ isDeleted: true },
				{
					where: { id: result.id },
				}
			);

			res.status(200).send({
				status: true,
				message: "Category removed",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	restoreCategory: async (req, res) => {
		try {
			let result = await categories.findOne({ where: { id: req.params.id } });
			if (!result) throw { message: "Category not found" };
			await categories.update(
				{ isDeleted: false },
				{
					where: { id: result.id },
				}
			);

			res.status(200).send({
				status: true,
				message: "Category restored",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
};
