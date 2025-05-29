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
      text: 'Buongiorno, \n\ngrazie per esserti registrto su MarkeTrento. Il suo account è ora attivo e può iniziare a utilizzare il servizio.\n\nCordiali saluti,\nIl Team di Marketrento',
    };
    await sgMail.send(msg);
    console.log('Email sent');
    res.status(200).json({ message: "Email inviata con successo!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore durante l'invio dell'email." });
  }
});

module.exports = router;