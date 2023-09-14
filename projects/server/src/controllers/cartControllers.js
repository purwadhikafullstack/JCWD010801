const db = require('../models');
const { sequelize } = require('../models')
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const categories = db.Categories;

module.exports = {
    addToCart: async(req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const { ProductId, quantity, BranchId } = req.body;

            const checkBranch = await carts.findOne({
                where: {
                    UserId: req.user.id,
                    status: 'ACTIVE'
                }
            });

            // if ( checkBranch?.BranchId !== +BranchId && checkBranch )  throw { status: 'Switched' };
            if ( checkBranch?.BranchId !== +BranchId && checkBranch ) return res.status(200).send({ status: 'Switched' })

            const [ result ] = await carts.findOrCreate({
                where: {
                    UserId: req.user.id,
                    status: 'ACTIVE',
                    BranchId
                },
                transaction
            });

            // // Stock available ?
            // const product_item = await products.findOne({ where: { id: ProductId } });
            // if (product_item.aggregateStock < 1) throw { status: false, message: 'Product out of stock' }

            const cart_item = await cartItems.findOne({
                where: {
                    CartId: result.id,
                    ProductId
                }
            });
            
            // await products.update({ aggregateStock: aggregateStock - quantity }, transaction);

            // Update product quantity in cart
            if ( cart_item ) await cartItems.update({ quantity: cart_item.quantity + quantity }, {
                where: {
                    CartId: result.id,
                    ProductId
                },
                transaction
            })
            else await cartItems.create({
                CartId: result.id,
                ProductId,
                quantity
            }, { transaction });

            await transaction.commit();

            res.status(201).send({
                status: true,
                message: 'Product added to cart'
            });

        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        }
    },
    getCartItems: async(req, res) => {
        try {
            const condition = {
                UserId: req.user.id,
                status: 'ACTIVE'
            }
            const result = await carts.findOne({ where: condition });

            if ( !result ) throw { status: false, message: 'Cart not found' };

            const cart_items = await cartItems.findAll({
                where: {
                    CartId: result.id
                },
                include: {
                    model: products,
                    attributes: { exclude: [ 'isDeleted', 'createdAt', 'updatedAt' ] },
                    include: { model: categories, attributes: { exclude: [ 'isDeleted' ] } }
                },
                attributes: { exclude: [ 'isDeleted' ] }
            });

            const total = await cartItems.count({ where: { CartId: result.id } })

            res.status(200).send({
                status: true,
                total,
                cart: result,
                cart_items
            });

        } catch (err) {
            res.status(404).send(err);
        }
    },
    switchBranch: async(req, res) => {
        const transaction = await sequelize.transaction();
        try {
            console.log(req.body.BranchId)
            await carts.update({
                status: 'ABANDONED',
                description: 'Switched branch'
            }, {
                where: {
                    UserId: req.user.id,
                    status: 'ACTIVE'
                },
                transaction
            });

            await carts.create({
                UserId: req.user.id,
                status: 'ACTIVE',
                BranchId: req.body.BranchId
            }, { transaction });

            await transaction.commit();

            res.status(200).send({
                status: true,
                message: 'Cart abandoned'
            })
        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        }
    }
}