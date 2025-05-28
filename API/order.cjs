const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel.cjs');
const Productv2 = require('../models/productModel.cjs');

router.post('/', async (req, res) => {
    try {
        const { prodotti, venditore, cliente, zona, tipo } = req.body;
        const newOrder = new Order({
            prodotti,
            venditore,
            cliente,
            zona,
            tipo,
            pubblicazione: new Date(),
            stato: "In elaborazione"
        });
        await newOrder.save();

        for (const item of prodotti) {
            const prodotto = await Productv2.findById(item._id);
            if (prodotto && prodotto.quantita >= item.quantity) {
                await Productv2.findByIdAndUpdate(
                    item._id,
                    { $inc: { quantita: -Math.abs(item.quantity) } },
                    { new: true }
                );
            } else {
                return res.status(400).json({ error: `Quantità insufficiente per il prodotto ${prodotto ? prodotto.nome : item._id}` });
            }
        }

        res.status(201).json({ message: "Ordine salvato con successo!" });
    } catch (err) {
        res.status(500).json({ error: "Errore durante il salvataggio dell'ordine." });
    }
});

module.exports = router;