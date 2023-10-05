const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const vouchers = db.Vouchers;
const users = db.Users;
const user_vouchers = db.User_vouchers;
const orders = db.Orders;
const products = db.Products;

module.exports = {
    createVoucher: async(req, res) => {
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
                amountPerRedeem
            } = req.body;

            if (type === "Single item" && !ProductId) throw { status: false, message: "Please enter the product id to create single item vouchers" };
            if (!isPercentage) maximumDiscount = nominal;
            if (type === "Total purchase" || type === "Shipment") ProductId = null;
            const adminInfo = await users.findOne({ where: { id: req.user.id } });

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
                BranchId: adminInfo.BranchId
            });

            res.status(201).send({
                status: true,
                message: "Voucher created"
            });
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },
    getAllVouchers: async(req, res) => {
        try {
            const search = req.query.search || "";
            const limit = +req.query.limit || 8;
            const page = +req.query.page || 1;
            const sortBy = req.query.sortBy || "updatedAt";
            const order = req.query.order || "DESC";
            const voucherType = req.query.type || "";
            const startAvailableFrom = req.query.startAvailableFrom || 1970 ;
            const endAvailableFrom = req.query.endAvailableFrom || 2099 ;
            const startValidUntil = req.query.startValidUntil || 1970 ;
            const endValidUntil = req.query.endValidUntil || 2099 ;

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
                },
                limit,
                offset: limit * ( page - 1 ),
                order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
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
    getBranchVouchers: async(req, res) => {
        try {
            const search = req.query.search || "";
            const limit = +req.query.limit || 8;
            const page = +req.query.page || 1;
            const sortBy = req.query.sortBy || "updatedAt";
            const order = req.query.order || "DESC";
            const voucherType = req.query.type || "";
            const startAvailableFrom = req.query.startAvailableFrom || 1970 ;
            const endAvailableFrom = req.query.endAvailableFrom || 2099 ;
            const startValidUntil = req.query.startValidUntil || 1970 ;
            const endValidUntil = req.query.endValidUntil || 2099 ;

            const checkBranch = await users.findOne({ where: { id: req.user.id } });

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
                    BranchId: checkBranch.BranchId
                },
                limit,
                offset: limit * ( page - 1 ),
                order: [ [ Sequelize.col(`${sortBy}`), `${order}` ] ],
                include: [
                    {
                        model: products
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
    freeShipment: async(req, res) => {
        try {
            const countOrder = await orders.count({
                where: {
                    UserId: req.user.id,
                    status: "Processing"
                }
            });
            const freeShipmentVoucher = await vouchers.findOne({
                where: {
                    name: { [Op.like]: `Free Shipment%` },
                    availableFrom: { [Op.lte]: new Date(Date.now()) },
                    validUntil: { [Op.gte]: new Date(Date.now()) }
                }
            })
            const freeShipmentVoucherCheck = await user_vouchers.findOne({
                where: {
                    UserId: req.user.id,
                    VoucherId: freeShipmentVoucher.id
                }
            });
            if ( countOrder % 3 === 0 && !freeShipmentVoucherCheck ) {
                await user_vouchers.create({
                    UserId: req.user.id,
                    VoucherId: 1,
                    amount: 1
                });
                res.status(201).send({
                    status: true, 
                    message: "Added 1 free shipment voucher"
                });
            }
            else if ( countOrder % 3 === 0 && freeShipmentVoucherCheck ) {
                await user_vouchers.update({
                    amount: freeShipmentVoucherCheck.amount + 1
                }, {
                    where: {
                        UserId: req.user.id,
                        VoucherId: 1
                    }
                });
                res.status(200).send({
                    status: true, 
                    message: "Added 1 free shipment voucher"
                });
            }
            else res.status(200).send({ status: true });

        } catch (err) {
            res.status(400).send(err);
        }
    },
    useVoucher: async(req, res) => {
        try {
            const filter = {
                where: {
                    UserId: req.user.id,
                    VoucherId: req.params.id
                }
            }
            const voucherCheck = await user_vouchers.findOne(filter);
            if (!voucherCheck.amount) throw { status: false, message: "You are out of voucher" };

            await user_vouchers.update({ amount: voucherCheck.amount - 1 }, filter);
            res.status(200).send({
                status: true,
                message: "Voucher applied"
            })
        } catch (err) {
            res.status(400).send(err);
        }
    }
}