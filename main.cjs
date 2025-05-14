const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const Venditore = require( "./classes/Venditore.cjs");
const Imprenditore = require( "./classes/Imprenditore.cjs");
const {hashPassword,comparePassword,compareDBbusiness,compareDBbusinessv2}= require ("./passwordhasher.cjs")
require('dotenv').config({ path: 'process.env' });

const Prodotto = require('./classes/prodotto.cjs');
const ProdottoServizio = require('./services/ProdottoService.cjs');
const ClienteServizio = require('./services/clienteService.cjs');
const dbUrl = process.env.DB_URL;
const DBVendor=require('./models/vendorModel.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');
const Productv2=require('./models/productModel.cjs');  
const DBPromotion=require('./models/promotionModel.cjs');
//const Order=require('./models/orderModel.cjs');     //Orders contiene un product
const DBClient=require('./models/clientModel.cjs');
const VenditoreServizio = require('./services/VenditoreService.cjs');

const app = express();
const PORT = 3000;


// Middleware
//app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(express.static('public'));
    
    
    
    //FUNZIONE PER GENERARE COSE DA INSERIRE NEL DB PER TEST, con copilot su VSC SI FA MOLTO VELOCEMENTE
    async function insert(){
       /* var venditore=new Venditore('Antonello','Piscitelli',20021990,'p@gm.com','venditore','$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa','Via Lodrone 11', 'Antonello ha le galline', 'fattoria', '33');
        DBVendor.create(venditore);*/
        /*var prodotto=new Prodotto('Mele','mele rosse',venditore.username,2.5,10,'frutta');
        Productv2.create(prodotto);*/
        /*var Cliente1=new Cliente('Pecco','Bagnaia',121299,'bagnaia@bagnaia.it','cliente','$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa');
        await DBClient.create(Cliente1);*/
        
    

}


function popola()
{
     insert();

}


async function compareDB(username, password) {
    // Create a new instance of the Client class

    const cc = new Cliente('a','b',10102000,'a',username, password);
    try {
        // Find user by username
        const user = await DBClient.findOne({ 
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
        const prodotto = await ProdottoServizio.getProductById(req.params.id);
        if (!prodotto) {
            return res.status(404).send('Prodotto non trovato');
        }
        res.json(prodotto);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).send('Errore del server');
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
    var au = await compareDB(username, password);
    if (au) {
        res.send(`
            <script>
                window.username = "${username}";
                window.localStorage.setItem("username", window.username);
                window.location.href = "/login.html";
            </script>
        `);
    } else {
        res.send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`);
    }
});

app.post('/loginbusiness', async (req, res) => {
    const { username, password } = req.body;
    var au= await compareDBbusiness(username, password);
    if (au) {
        res.sendFile(path.join(__dirname, 'public', '/loginbusiness.html'));
    }
    else
    {
        au= await compareDBbusinessv2(username, password);
        if (au) {
            res.sendFile(path.join(__dirname, 'public', '/loginbusiness.html'));
        }
        else res.send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`)
    }

});

/*
app.get('/agenda', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public', '/agenda.html'));
});*/

app.get('/mercato', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `/mercato.html`));
});



app.get('/api/venditore/:id', async (req, res) => {
    try {
        const venditore = await VenditoreServizio.getVendorById(req.params.id);
        if (!venditore) {
            return res.status(404).send('Venditore non trovato');
        }
        res.json(venditore);
    } catch (error) {
        res.status(500).send('Errore del server');
    }
});


app.get('/carrello', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'carrello.html'));
});

app.get('/api/venditori', async (req, res) => {
    try {
        const venditori = await VenditoreServizio.getAllVenditori();
        res.json(venditori);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recupero dei venditori' });
    }
});

app.get('/api/carrello/:clientId', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const carrello = await clienteService.getClientCarrello(clientId); // Usa la funzione nella cartella services
        if (!carrello) {
            return res.status(404).send('Carrello non trovato');
        }
        res.json(carrello.prodotti); // Ritorna i prodotti nel carrello
    } catch (error) {
        console.error('Errore durante il recupero del carrello:', error);
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