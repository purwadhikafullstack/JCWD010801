const db = require("../models");
const orders = db.Orders;

module.exports = {
    uploadPaymentProof: async(req, res) => {
        try {
            const imgURL = req?.file?.filename;

            await orders.update({ paymentProof: imgURL, status: "Pending payment confirmation" }, { where: { id: req.params.id } });

            res.status(200).send({
                status: true,
                message: "Payment proof uploaded"
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }
}