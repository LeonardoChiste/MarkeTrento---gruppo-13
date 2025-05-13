const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const {hashPassword,comparePassword}= require ("./passwordhasher.cjs")
require('dotenv').config({ path: 'process.env' });
const {Prodotto,Product} = require('./prodotto.cjs');

const dbUrl = process.env.DB_URL;


const app = express();
const PORT = 3000;


// Middleware
//app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(express.static('public'));

/*const cs=new mongoose.Schema(
    {
        id:Number,
        nome:String,
        cognome:String,
        birthdate:Number,
        email:String,
        username:String,
        password:String,
    
    });
    const Utente =mongoose.model('Clienti',cs);*/
    
    
    let Clienti = [
        new Cliente('Nome','Cognome',151103,'a@gmail.com','cliente', '$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa'),
        new Cliente('Nome','Cognome',12062000,'b@alicemail,com','cliente2', '$2b$10$VX38pk7kmY/Re4QpLWvJZ.QcfgFJgkLBPxRquiQd.9BKZFcvRenpa'),
    ];
    
    
    
    
    async function insertUsernames(){
    
    var ce=0;
    while(ce<2){
    
    const sameUsername = await Utente.findOne({ 
        username: Clienti[ce].username 

    });
    if(!sameUsername)await Utente.create(Clienti[ce])


    ++ce;
    }

}

function popola()
{
    insertUsernames();


}

function generaProdotto() {
            return new Prodotto(
                '1 kg di Mele Golden', 
                'Mele golden coltivate senza uso di fitofarmaci in Val di Non',
                2.20,
                'Mele',
            );
        }

async function compareDB(cc) {
    try {
        // Find user by username
        const user = await Utente.findOne({ 
            username: cc.username 
        });
        
        if (!user) {
            return false;
            //var w=await hashPassword(cc.password);
            //console.log(w);
        }
        else{

        //var w= await hashPassword(cc.password)
        //console.log(w);
        return comparePassword(cc.password,user.password)
        
        }
    } catch (error) {
        console.error("Error in compareDB:", error);
        return false;
    }
};

app.use(express.urlencoded({ extended: true })); // Per form HTML
app.use(express.json()); // Per dati JSON (opzionale ma utile)

// Pagina principale
app.get('/', (req, res) => {
    popola();
    res.sendFile(path.join(__dirname, 'public', `/default.html`));
});

// Gestione del login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    var c=new Cliente('n','n',2,'nd',username,password)
    var au= await compareDB(c);
    if (au) {
        res.sendFile(path.join(__dirname, 'public', '/login.html'));
    }
    else res.send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`)
});
/*
app.get('/agenda', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public', '/agenda.html'));
});*/

app.get('/mercato', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `/mercato.html`));
});





//Va su tutti gli IP solo oggi 07/05, se non funziona chiedetemi che sblocco, Luzzani A
mongoose.connect(dbUrl).then( ()=> {
    console.log("Connected!")
})
.catch(err => {
    console.log("Errore di connessione " ,err)
}).then(()=> {


// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});});