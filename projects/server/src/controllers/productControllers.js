const db = require('../models');
const products = db.Products;
const categories = db.Categories;
const { Op } = require('sequelize');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const { productName, price, description, CategoryId, stock, weight } = req.body;
            const imgURL = req.file.filename;

            if (!productName) throw { message: "Product name cannot be empty." };
            if (!price) throw { message: "Price cannot be empty." };
            if (!description) throw { message: "Descriptiion cannot be empty." };
            if (!CategoryId) throw { message: "Category ID cannot be empty." };
            if (!stock) throw { message: "Stock cannot be empty. Please input a minimum of 1 unit." };
            if (!weight) throw { message: "Weight cannot be empty. Please input a minimum of 1 gram." };

            const newProduct = await products.create({
                productName,
                price,
                imgURL,
                description,
                CategoryId,
                stock,
                weight
            });

            return res.status(201).send({
                status: 201,
                message: 'Product created successfully.',
                product: newProduct,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: 500,
                message: 'Internal server error.',
            });
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const imgURL = req.file.filename;
            const result = await categories.create(
                {
                    category: name,
                    imgURL: imgURL
                }
            );
            res.status(201).send({
                status: 201,
                message: 'New category created successfully.',
                newCategory: result
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
    getProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await products.findOne({
                where: {
                    id: id,
                    isDeleted: false
                }
            });

            if (!id) {
                return res.status(400).send({
                    status: 400,
                    message: "Please input a valid product ID."
                });
            };

            if (!result) {
                return res.status(404).send({
                    status: 404,
                    message: "Product is not found."
                });
            };

            res.status(200).send({
                status: 200,
                result: result
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
    getCategories: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = 8
            const totalCategories = await categories.count({
                where: { isDeleted: 0 }
            })
            const result = await categories.findAll({
                where: { isDeleted: 0 },
                limit,
                offset: limit * (page - 1)
            });
            res.status(200).send({
                page: page,
                totalPage: Math.ceil(totalCategories / limit),
                result: result
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
    getProductsByCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const queriedCount = await products.count({
                where: { CategoryId: id, isDeleted: false }
            });
            const result = await products.findAll(
                {
                    where: { CategoryId: id, isDeleted: 0 },
                    limit,
                    offset: limit * (page - 1)
                }
            );
            res.status(200).send({
                page: page,
                totalPage: Math.ceil(queriedCount / limit),
                result
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: error
            });
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const search = req.query.search || ""
            const page = req.query.page || 1
            const limit = req.query.limit || 10
            const sort = req.query.sort || "ASC"
            const sortBy = req.query.sortBy || "productName"

            const queriedCount = await products.count(
                { where: { productName: { [Op.like]: `%${search}%` }, isDeleted: false } }
            )
            const result = await products.findAll(
                {
                    where: { productName: { [Op.like]: `%${search}%` }, isDeleted: false },
                    order: [[sortBy, sort]],
                    limit,
                    offset: limit * (page - 1)
                }
            )
            return (
                res.status(200).send({
                    totalPages: Math.ceil(queriedCount / limit),
                    currentPage: page,
                    result
                })
            )

        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
};