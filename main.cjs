const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const Venditore = require( "./classes/Venditore.cjs");
const {hashPassword,comparePassword}= require ("./passwordhasher.cjs")
require('dotenv').config({ path: 'process.env' });

const Prodotto = require('./classes/prodotto.cjs')

const dbUrl = process.env.DB_URL;
const Vendor=require('./models/vendorModel.cjs');
const Promoter=require('./models/promoterModel.cjs');
const Productv2=require('./models/productModel.cjs');  //Product è già definito, ma manca immagine, quantità, venditore etc.
const Promotion=require('./models/promotionModel.cjs');
//const Order=require('./models/orderModel.cjs');     //Orders contiene un product
const Client=require('./models/clientModel.cjs');

const app = express();
const PORT = 3000;


// Middleware
//app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(express.static('public'));
    
    let Clienti = [
        new Cliente('Nome','Cognome',151103,'a@gmail.com','cliente', '$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa'),
        new Cliente('Nome','Cognome',12062000,'b@alicemail,com','cliente2', '$2b$10$VX38pk7kmY/Re4QpLWvJZ.QcfgFJgkLBPxRquiQd.9BKZFcvRenpa'),
    ];
    
    
    async function insertUsernames(){
    
    var ce=0;
    while(ce<2){
    
    const sameUsername = await Client.findOne({ 
        username: Clienti[ce].username 

    });
    if(!sameUsername)await Client.create(Clienti[ce])


    ++ce;
    }
   // var p=generaProdotto();
    //Productv2.create(p);
    

}

function popola()
{
    insertUsernames();

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

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/promotions', async (req, res) => {
    try {
        const promotions = await Promotion.find();
        res.json(promotions);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
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



app.get('/venditore/:nome', async (req, res) => {
    try {
        const venditore = await Vendor.findOne({nome: req.params.nome});
        if (!venditore) {
            return res.status(404).send('Venditore non trovato');
        }
        res.sendFile(path.join(__dirname, 'public', 'venditore.html'));
    } catch (error) {
        res.status(500).send('Errore del server');
    }
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