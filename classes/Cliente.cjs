const Utente = require('./Utente.cjs');
const Carrello = require('./Carrello.cjs');

class Cliente extends Utente {
    constructor(name, surname, birthdate, email, username, password) {
        super();
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.carrello = new Carrello();
    }

    acquistaProdotto() { }

    visualizzaProdotto() { }

    visualizzaOrdini() { }

    visualizzaCarrello() {
        this.carrello.visualizzaProdotti();
    }
}

module.exports = Cliente;