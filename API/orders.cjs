const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const Order = require('../models/orderModel.cjs');
const Productv2 = require('../models/productModel.cjs');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const Consegna = require('../models/consegnaModel.cjs');

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
    console.error(err); 
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
        }catch (err) {
            console.error("Order creation error:", err);
            res.status(500).json({ error: "Errore durante il salvataggio dell'ordine.", details: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try { 
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Ordine non trovato' });
        }
        res.json(order);
    } catch (err) {
        console.error(err); 
        return res.status(500).json({ error: 'Errore nel recupero dell ordine' });
    }
});

router.post('/:id/approve', tokenChecker('Admin'), async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Ordine non trovato' });
        }
        order.stato = 'In consegna';
        await order.save();
        res.status(200).json({ message: 'Ordine approvato con successo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante l approvazione dell ordine' });
    }
});

router.post('/rifiuta/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Ordine non trovato' });
        }
        order.stato = 'Rifiutato';
        await order.save();
        res.status(200).json({ message: 'Ordine rifiutato con successo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante il rifiuto dell ordine' });
    }
}
);

router.put('/ritirato/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Ordine non trovato' });
        }
        order.stato = 'Ritirato';
        await order.save();
        res.status(200).json({ message: 'Ordine marcato come ritirato con successo' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore durante la marcatura dell ordine come ritirato' });
    }
}
);

router.get('/venditori/:id', async (req, res) => {
    try {
        const venditoreId = req.params.id;
        const orders = await Order.find({ venditore: venditoreId });
        const now = new Date();
        const twentyOneDaysAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

        const filteredOrders = orders.filter(order => {
            if (order.stato === 'Rifiutato') return false;
            if (
            (order.stato === 'Consegnato' || order.stato === 'Ritirato') &&
            order.pubblicazione < twentyOneDaysAgo
            ) {
            return false;
            }
            else return true;
        });
        res.json(filteredOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nel recupero degli ordini per il venditore' });
    }
});
module.exports = router;