const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel.cjs');
const Productv2 = require('../models/productModel.cjs');

router.get('/', async (req, res) => {
    try {
        const { userType, userId } = req.query;
        let filter = {};
        if (userType === 'cliente' || userType === 'venditore' || userType === 'imprenditore') {
            filter.cliente = userId;
        }
        const orders = await Order.find(filter)
        .populate('venditore', 'nome cognome sede')
        .populate({ path: 'cliente', select: 'nome cognome email', strictPopulate: false }) 
        .sort({ pubblicazione: -1 });
        res.json(orders);
    } catch (err) {
    console.error(err); // <--- add this
    res.status(500).json({ error: 'Errore nel recupero degli ordini' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { prodotti, venditore, cliente, clienteModel, zona, tipo } = req.body; 
        const newOrder = new Order({
            prodotti,
            venditore,
            cliente,
            clienteModel, 
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