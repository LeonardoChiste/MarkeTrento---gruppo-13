const Utente = require('./Utente.cjs');

class Admin extends Utente {
    constructor(name, surname, birthdate, email, username, password) {
        super();
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
    }

    visualizzaCandidature() { }
}

module.exports = Admin;