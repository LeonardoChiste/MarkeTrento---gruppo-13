const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

router.post('/mail', async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'alessandro.luzzani@studenti.unitn.it', // Cambia destinatario se serve
      from: 'marketrentowebapp@gmail.com', // Mittente verificato SendGrid
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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