const db = require('../models');
const products = db.Products;
const categories = db.Categories;
const { Op } = require('sequelize');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const { productName, price, description, CategoryId, stock, weight } = req.body;
            const imgURL = req.file.filename;

            if (!productName) {
                return res.status(400).send({
                    status: 400,
                    message: "Product name cannot be empty."
                });
            };

            if (await products.findOne({
                where: {
                    productName: productName
                }
            })) {
                res.status(400).send({
                    status: 400,
                    message: "Product name already exists."
                });
            };

            if (!price) {
                return res.status(400).send({
                    status: 400,
                    message: "Price cannot be empty."
                });
            };

            if (!description) {
                return res.status(400).send({
                    status: 400,
                    message: "Description cannot be empty."
                });
            };

            if (!CategoryId) {
                return res.status(400).send({
                    status: 400,
                    message: "Category ID cannot be empty."
                });
            };

            if (!stock) {
                return res.status(400).send({
                    status: 400,
                    message: "Stock cannot be empty. Please input a minimum of 1 unit."
                });
            };

            if (!weight) {
                return res.status(400).send({
                    status: 400,
                    message: "Weight cannot be empty. Please input a minimum of 1 gram."
                });
            };

            if (!imgURL) {
                return res.status(400).send({
                    status: 400,
                    message: "Please assign a product image."
                });
            };

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
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).send({
                    status: 400,
                    message: "Please input a category ID."
                });
            };

            const result = await categories.findOne({
                where: {
                    id: id
                }
            });

            if (!result) {
                return res.status(404).send({
                    status: 404,
                    message: "Category not found. Please input a valid category ID."
                });
            };

            res.status(200).send({
                result
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
            const limit = parseInt(req.query.limit) || 15;
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
            const { search = '', CategoryId, page = 1, sortBy = 'productName', sortOrder = 'ASC' } = req.query;
            const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

            const whereCondition = {
                productName: { [Op.like]: `%${search}%` },
                isDeleted: false,
            };

            if (CategoryId) {
                whereCondition.CategoryId = CategoryId;
            };

            const queriedCount = await products.count({
                where: whereCondition,
            });

            let orderCriteria = [];
            if (sortBy === 'productName') {
                orderCriteria.push(['productName', sortOrder]);
            } else if (sortBy === 'price') {
                orderCriteria.push(['price', sortOrder]);
            } else if (sortBy === 'createdAt') {
                orderCriteria.push(['createdAt', sortOrder]);
            } else {
                orderCriteria.push(['productName', 'ASC']);
            };

            const result = await products.findAll({
                where: whereCondition,
                order: orderCriteria,
                limit: itemLimit,
                offset: itemLimit * (page - 1),
            });

            const totalPages = Math.ceil(queriedCount / itemLimit);

            return res.status(200).send({
                totalProducts: queriedCount,
                productsPerPage: itemLimit,
                totalPages,
                currentPage: page,
                result,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: 500,
                message: 'Internal server error.',
            });
        }
    },
};