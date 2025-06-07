const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

router.post('/mail', async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    var emailreg= req.body.email;
    var userreg= req.body.username;
    const msg = {
      to: emailreg, // Email del destinatario
      from: 'marketrentowebapp@gmail.com', // Mittente verificato SendGrid
      subject: 'Registrazione Marketrento - nuovo cliente',
      text: 'Buongiorno, \n\ngrazie per essersi registrato su MarkeTrento. Il suo account è ora attivo e può iniziare a utilizzare il servizio.\n\nCordiali saluti,\nIl Team di Marketrento',
    };
    await sgMail.send(msg);
    console.log('Email sent');
    res.status(200).json({ message: "Email inviata con successo!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'invio dell'email." });
  }
});

router.post('/mail/rifiuto-ordini', async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const { orderId, username , email } = req.body;
    const msg = {
      to: email, // Email del destinatario
      from: 'marketrentowebapp@gmail.com', // Mittente verificato SendGrid
      subject:' Rifiuto dell\'ordine #' + orderId,
      text: `Buongiorno ${username},\n\nSiamo spiacenti di informarla che un suo ordine è stato rifiutato. Può verificare di quale ordine si tratta nella sezione dedicata della WebApp.\n\nCordiali saluti,\nIl Team di Marketrento`,
    };
        await sgMail.send(msg);
    console.log('Email di rifiuto inviata');
    res.status(200).json({ message: "Email inviata con successo!" });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'invio dell'email di rifiuto." });
  }});

module.exports = router;