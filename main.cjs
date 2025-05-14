const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const Venditore = require( "./classes/Venditore.cjs");
const {hashPassword,comparePassword}= require ("./passwordhasher.cjs")
const { getProductById } = require('./services/ProdottoService.cjs');
require('dotenv').config({ path: 'process.env' });

const Prodotto = require('./classes/prodotto.cjs')

const dbUrl = process.env.DB_URL;
const DBVendor=require('./models/vendorModel.cjs');
const DBEntrepeneur=require('./models/promoterModel.cjs');
const Productv2=require('./models/productModel.cjs');  
const DBPromotion=require('./models/promotionModel.cjs');
//const Order=require('./models/orderModel.cjs');     //Orders contiene un product
const DBClient=require('./models/clientModel.cjs');

const app = express();
const PORT = 3000;


// Middleware
//app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(express.static('public'));
    
    
    
    //FUNZIONE PER GENERARE COSE DA INSERIRE NEL DB PER TEST, con copilot su VSC SI FA MOLTO VELOCEMENTE
    async function insert(){
       /* var venditore=new Venditore('Mario','Tonina',21111947,'b@gm.com','fattori2','12345678','Via Roma 111', 'alleviamo mucche e coltiviamo mele male', 'fattoria', '128867890123456');
        DBVendor.create(venditore);
        var prodotto=new Prodotto('Mele','mele rosse',venditore.username,2.5,10,'frutta');
        Productv2.create(prodotto);*/
    
    

}


function popola()
{
    insert();

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
/*
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
*/
app.get('/api/prodotti/:id', async (req, res) => {
    try {
        const prodotto = await getProductById(req.params.id);
        res.json(prodotto);
    } catch (error) {
        res.status(500).send('Errore durante il recupero del prodotto');
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
        const venditore = await DBVendor.findOne({username: req.params.nome});
        if (!venditore) {
            return res.status(404).send('Venditore non trovato');
        }
        res.sendFile(path.join(__dirname, 'public', 'venditore.html'));
    } catch (error) {
        res.status(500).send('Errore del server');
    }
});


app.get('/carrello', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'carrello.html'));
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