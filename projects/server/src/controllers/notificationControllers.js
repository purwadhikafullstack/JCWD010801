const { Sequelize, Op } = require('sequelize');
const db = require('../models');
const notifications = db.Notifications;
const users = db.Users;

module.exports = {
    getNotifications: async(req, res) => {
        try {
            const type = req.query.type || "" ;
            // const page = +req.query.page || 1 ;
            // const limit = +req.query.limit || 10 ;

            const filter = {
                where: {
                    UserId: req.user.id,
                    type: { [Op.like]: `${type}%` }
                },
                // limit,
                // offset: (page - 1) * limit,
                order: [[Sequelize.col("createdAt"), "DESC"]]
            }

            const result = await notifications.findAll(filter);
            const unreadTotal = await notifications.count({
                where: {
                    UserId: req.user.id,
                    isRead: false
                }
            })
            res.status(200).send({
                status: true,
                result,
                unreadTotal
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 500,
                message: "Internal server error",
                err
            })
        }
    },
    readNotification: async(req, res) => {
        try {
            console.log(req.user)
            await notifications.update({ isRead: true }, {
                where: {
                    UserId: req.user.id,
                    id: req.params.id
                }
            });
            res.status(200).send({
                status: true,
                message: "Notification read"
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 500,
                message: "Internal server error"
            })
        }
    },
    deleteNotification: async(req, res) => {
        try {
            await notifications.destroy({
                where: {
                    UserId: req.user.id,
                    id: req.params.id
                }
            });
            res.status(200).send({
                status: true,
                message: "Notification deleted"
            })
        } catch (err) {
            res.status(500).send({
                status: 500,
                message: "Internal server error"
            })
        }
    },
    clearNotifications: async(req, res) => {
        try {
            await notifications.destroy({
                where: {
                    UserId: req.user.id
                }
            });
            res.status(200).send({
                status: true,
                message: "Notifications cleared"
            })
        } catch (err) {
            res.status(500).send({
                status: 500,
                message: "Internal server error"
            })
        }
    },
}