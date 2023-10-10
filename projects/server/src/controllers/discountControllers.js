const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const discounts = db.Discounts;
const users = db.Users;
const products = db.Products;
const branches = db.Branches;

module.exports = {
    createBranchDiscount: async(req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            let { type, nominal, availableFrom, validUntil, PIDs } = req.body;
            const checkBranch = await users.findOne({ where: { id: req.user.id } });

            for (const { id } of PIDs) {
                const checkProduct = await discounts.findOne({
                    where: {
                        ProductId: id,
                        availableFrom: { [Op.lte]: new Date(Date.now()) },
                        validUntil: { [Op.gte]: new Date(Date.now()) },
                        BranchId: checkBranch.BranchId
                    },
                    include: [ { model: products, require: false } ]
                });
                if (checkProduct) throw { status: false, message: `There's a discount on going for product ${checkProduct.Product.productName}`};
                if (type === "Extra") nominal = 1;

                await discounts.create({
                    type,
                    nominal,
                    availableFrom: new Date(`${availableFrom}`),
                    validUntil: new Date(`${validUntil}`),
                    isActive: true,
                    BranchId: checkBranch.BranchId,
                    ProductId: id
                }, { transaction });
            };

            await transaction.commit();
            res.status(201).send({
                status: true,
                message: "Discount created"
            });
        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        }
    },
    getHistory: async(req, res) => {
        try {
            const limit = +req.query.limit || 10 ;
            const page = +req.query.page || 1 ;
            const branchId = +req.query.branchId || "" ;
            const startAvailableFrom = req.query.startAvailableFrom || 1970 ;
            const endAvailableFrom = req.query.endAvailableFrom || 2099 ;
            const startValidUntil = req.query.startValidUntil || 1970 ;
            const endValidUntil = req.query.endValidUntil || 2099 ;
            const discountType = req.query.type || "" ;
            const sortBy = req.query.sortBy || "id" ;
            const order = req.query.order || "DESC" ;
            const search = req.query.search || "" ;

            const checkRole = await users.findOne({ where: { id: req.user.id } });
            filter = {
                where: {
                    BranchId: checkRole.RoleId === 3 ? { [Op.like]: `${branchId}%` } : checkRole.BranchId,
                    type: { [Op.like]: `%${discountType}%` },
                    availableFrom: {
                        [Op.between]: [
                            new Date(`${startAvailableFrom}`),
                            new Date(`${endAvailableFrom}`)
                        ]
                    },
                    validUntil: {
                        [Op.between]: [
                            new Date(`${startValidUntil}`),
                            new Date(`${endValidUntil}`)
                        ]
                    },
                },
                limit,
                offset: (page - 1) * limit,
                order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
                include: [
                    {
                        model: products,
                        where: {
                            productName: { [Op.like]: `${search}%` }
                        }
                    },
                    {
                        model: branches,
                        attributes: ['name']
                    }
                ]
            }
            
            const result = await discounts.findAll(filter);
            const total = await discounts.count(filter);
            const totalPages = Math.ceil(total / limit);

            res.status(200).send({
                status: true,
                limit,
                total,
                totalPages,
                page,
                result
            });

        } catch (err) {
            res.status(404).send(err);
        }
    },
    getOngoingDiscountAdmin: async(req, res) => {
        try {
            const limit = +req.query.limit || 10 ;
            const page = +req.query.page || 1 ;
            const branchId = +req.query.branchId || "" ;
            const discountType = req.query.type || "" ;
            const sortBy = req.query.sortBy || "id" ;
            const order = req.query.order || "DESC" ;
            const search = req.query.search || "" ;

            const checkRole = await users.findOne({ where: { id: req.user.id } });
            filter = {
                where: {
                    BranchId: checkRole.RoleId === 3 ? { [Op.like]: `${branchId}%` } : checkRole.BranchId,
                    type: { [Op.like]: `%${discountType}%` },
                    availableFrom: { [Op.lte]: new Date(Date.now()) },
                    validUntil: { [Op.gte]: new Date(Date.now()) },
                    isActive: true
                },
                limit,
                offset: (page - 1) * limit,
                order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
                include: [
                    {
                        model: products,
                        where: {
                            productName: { [Op.like]: `${search}%` }
                        }
                    }
                ]
            }
            
            const result = await discounts.findAll(filter);
            const total = await discounts.count(filter);
            const totalPages = Math.ceil(total / limit);

            res.status(200).send({
                status: true,
                limit,
                total,
                totalPages,
                page,
                result
            });

        } catch (err) {
            res.status(404).send(err);
        }
    },
    getOngoingDiscount: async(req, res) => {
        try {
            const branchId = +req.query.branchId || "" ;
            filter = {
                where: {
                    BranchId: { [Op.like]: `${branchId}%` },
                    availableFrom: { [Op.lte]: new Date(Date.now()) },
                    validUntil: { [Op.gte]: new Date(Date.now()) },
                    isActive: true
                },
                order: [ [ Sequelize.col("validUntil"), "DESC"] ],
                include: [
                    {
                        model: products
                    }
                ]
            }
            
            const result = await discounts.findAll(filter);

            res.status(200).send({
                status: true,
                result
            });

        } catch (err) {
            res.status(404).send(err);
        }
    },
    updateBranchDiscount: async(req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { type, nominal, availableFrom, validUntil, ProductId, id } = req.body;
            const checkBranch = await users.findOne({ where: { id: req.user.id } });

            await discounts.update({ isActive: false }, { where: { id }, transaction });
            await discounts.create({
                type,
                nominal,
                availableFrom: new Date(`${availableFrom}`),
                validUntil: new Date(`${validUntil}`),
                isActive: true,
                BranchId: checkBranch.BranchId,
                ProductId
            }, { transaction });

            await transaction.commit();
            res.status(200).send({
                status: true,
                message: "New discount applied"
            });
        } catch (err) {
            console.log(err)
            await transaction.rollback();
            res.status(400).send(err);
        }
    },
    deactivateDiscount: async(req, res) => {
        try {
            await discounts.update({ isActive: false }, { where: { id: req.params.id } })

            res.status(200).send({
                status: true,
                message: "Discount deactivated"
            });
        } catch (err) {
            res.status(500).send({
                status: false,
                message: "Internal server error"
            });
        }
    },
}