const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const discounts = db.Discounts;
const users = db.Users;
const products = db.Products;

module.exports = {
    createBranchDiscount: async(req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { type, nominal, availableFrom, validUntil, PIDs } = req.body;
            const checkBranch = await users.findOne({ where: { id: req.user.id } });

            for (const PID of PIDs) {
                const checkProduct = await discounts.findOne({
                    where: {
                        ProductId: PID,
                        availableFrom: { [Op.lte]: new Date(Date.now()) },
                        validUntil: { [Op.gte]: new Date(Date.now()) },
                    },
                    include: [ { model: products, require: false } ]
                });
                if (checkProduct) throw { status: false, message: `There's a discount on going for product ${checkProduct.Product.productName}` };

                await discounts.create({
                    type,
                    nominal,
                    availableFrom: new Date(`${availableFrom}`),
                    validUntil: new Date(`${validUntil}`),
                    isActive: true,
                    BranchId: checkBranch.BranchId,
                    ProductId: PID
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
            const limit = +req.params.limit || 10 ;
            const page = +req.params.page || 1 ;
            const branchId = +req.params.branchId || "" ;
            const availableFrom = req.params.availableFrom || 1970 ;
            const validUntil = req.params.validUntil || 2099 ;
            const discountType = req.params.type || "" ;
            const sortBy = req.query.sortBy || "id" ;
            const order = req.query.order || "DESC" ;
            const search = req.query.search || "" ;

            const checkRole = await users.findOne({ where: { id: req.user.id } });
            if (checkRole.RoleId === 3 ) {
                const filter = {
                    where: {
                        BranchId: { [Op.like]: `${branchId}%` },
                        type: { [Op.like]: `%${discountType}%` },
                        availableFrom: { [Op.gte]: new Date(`${availableFrom}`) },
                        validUntil: { [Op.lte]: new Date(`${validUntil}`) },
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
                };

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
            } else {
                filter = {
                    where: {
                        BranchId: checkRole.BranchId,
                        type: { [Op.like]: `%${discountType}%` },
                        availableFrom: { [Op.gte]: new Date(`${availableFrom}`) },
                        validUntil: { [Op.lte]: new Date(`${validUntil}`) },
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
            }

        } catch (err) {
            console.log(err)
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
    getBranchOngoingDiscount: async(req, res) => {
        try {
            const checkBranch = await users.findOne({ where: { id: req.user.id } });
            const result = await discounts.findAll({
                where: { 
                    BranchId: checkBranch.BranchId,
                    availableFrom: { [Op.lte]: new Date(Date.now()) },
                    validUntil: { [Op.gte]: new Date(Date.now()) },
                }
            })

            res.status(200).send({
                status: true,
                result
            })
        } catch (err) {
            res.status(404).send(err);
        }
    },
}