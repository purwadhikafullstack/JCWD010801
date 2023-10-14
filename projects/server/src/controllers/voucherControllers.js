const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const vouchers = db.Vouchers;
const users = db.Users;
const user_vouchers = db.User_vouchers;
const products = db.Products;
const branches = db.Branches;
const notifications = db.Notifications;

module.exports = {
    createVoucher: async(req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            let { 
                name, 
                code, 
                type, 
                isPercentage, 
                nominal, 
                minimumPayment, 
                maximumDiscount, 
                availableFrom, 
                validUntil, 
                ProductId,
                amountPerRedeem,
                notifyUsers,
                description,
                BranchId
            } = req.body;

            if (type === "Single item" && !ProductId) throw { status: false, message: "Please enter the product id to create single item vouchers" };
            if (!isPercentage) maximumDiscount = nominal;
            if (type === "Total purchase" || type === "Shipment") ProductId = null;
            if (req.user.RoleId === 3 && code === "NOPROMOCODE") code = null

            await vouchers.create({
                name, 
                code,
                type,
                isPercentage,
                nominal,
                minimumPayment,
                maximumDiscount,
                availableFrom: new Date(`${availableFrom}`),
                validUntil: new Date(`${validUntil}`),
                amountPerRedeem,
                ProductId,
                BranchId: req.user.RoleId === 3 && BranchId === "" ? null : parseInt(BranchId)
            }, { transaction });

            if (notifyUsers) {
                const allUsers = await users.findAll({ where: { RoleId: 1 } })
                for (const { id } of allUsers ) {
                    await notifications.create({
                        type: "Discount",
                        name,
                        description,
                        UserId: id,
                        promoCode: code
                    }, { transaction })
                }
            };

            await transaction.commit();
            res.status(201).send({
                status: true,
                message: "Voucher created"
            });
        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        }
    },
    getAdminVouchers: async(req, res) => {
        try {
            const search = req.query.search || "";
            const limit = +req.query.limit || 8;
            const page = +req.query.page || 1;
            const sortBy = req.query.sortBy || "updatedAt";
            const order = req.query.order || "DESC";
            const voucherType = req.query.type || "";
            const branchId = req.query.BranchId || "";
            const startAvailableFrom = req.query.startAvailableFrom || 1970 ;
            const endAvailableFrom = req.query.endAvailableFrom || 2099 ;
            const startValidUntil = req.query.startValidUntil || 1970 ;
            const endValidUntil = req.query.endValidUntil || 2099 ;

            const checkRole = await users.findOne({ where: { id: req.user.id } });

            const filter = {
                where: { 
                    name: { [Op.like] : `${search}%` },
                    type: { [Op.like] : `${voucherType}%` },
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
                    BranchId: checkRole.RoleId === 3 ? { [Op.or]: { [Op.like]: `%${branchId}%`, [Op.eq]: null } } : checkRole.BranchId
                },
                limit,
                offset: limit * ( page - 1 ),
                order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
                include: [
                    {
                        model: products
                    },
                    {
                        model: branches,
                        attributes: ['name']
                    }
                ]
            }

            const result = await vouchers.findAll(filter);
            const totalVouchers = await vouchers.count(filter);
            const totalPages = Math.ceil(totalVouchers / limit);

            res.status(200).send({
                status: true,
                totalVouchers,
                totalPages,
                page,
                result
            });
        } catch (err) {
            res.status(404).send(err);
        }
    },
    getUserVouchers: async(req, res) => {
        try {
            const search = req.query.search || "";
            const limit = +req.query.limit || 8;
            const page = +req.query.page || 1;
            const sortBy = req.query.sortBy || "updatedAt";
            const order = req.query.order || "DESC";
            const voucherType = req.query.type || "";
            const endDate = req.query.endDate || "2099";

            const filter = {
                where: { UserId: req.user.id, amount: { [Op.gt]: 0 } },
                include: [
                    {
                        model: vouchers,
                        where: { 
                            name: { [Op.like] : `${search}%` },
                            type: { [Op.like] : `${voucherType}%` },
                            validUntil: { [Op.lte] : new Date(endDate) }
                        },
                        limit,
                        offset: limit * ( page - 1 ),
                        order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
                        separate: false,
                        include: [
                            {
                                model: products
                            }
                        ]
                    }
                ]
            };

            const result = await user_vouchers.findAll(filter);
            const totalVouchers = await user_vouchers.count(filter);
            const totalPages = Math.ceil(totalVouchers / limit);

            res.status(200).send({
                status: true,
                totalVouchers,
                totalPages,
                page,
                result
            });
            
        } catch (err) {
            res.status(404).send(err);
        }
    },
    redeemVoucherCode: async(req, res) => {
        try {
            if (!req.body.code) throw { status: false, message: "Enter promo code to redeem vouchers" }
            const codeCheck = await vouchers.findOne({
                where: { 
                    code: req.body.code,
                    validUntil: {
                        [Op.gte] : new Date(Date.now())
                    },
                    availableFrom: {
                        [Op.lte] : new Date(Date.now())
                    }
                }
            });
            if ( !codeCheck ) throw { status: false, message: "Voucher code unavailable" };

            const voucherCheck = await user_vouchers.findOne({
                where: {
                    UserId: req.user.id,
                    VoucherId: codeCheck.id
                }
            });
            if ( voucherCheck ) throw { status: false, message: "Voucher is already redeemed" };

            await user_vouchers.create({
                UserId: req.user.id,
                VoucherId: codeCheck.id,
                amount: codeCheck.amountPerRedeem
            });

            res.status(201).send({
                status: true,
                message: "Voucher code succesfully redeemed",
                voucher: codeCheck.name
            });

        } catch (err) {
            res.status(400).send(err);
        }
    },
}