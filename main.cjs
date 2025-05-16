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
       var v=new Venditore('Caio','Borghese',19091990,'iosono@caioBorghese.com','CAIO', '$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa','Via Dani Pedrosa,26','vendo Pere, le pere sono il mio special','agricoltore','P9876');
       await DBVendor.create(v);
       console.log("Venditore inserito con successo!");
        /*
        const client = await DBClient.findOne({ _id: "68245a82ef2a089ff02b2a7b"}); // o usa l'email se preferisci

        if (!client) {
            console.log("Cliente non trovato!");
        return;
        }

        // Aggiungi le mele al carrello
        client.carrello.push({
            nome: "Mele",
            prezzo: 2.5,
            quantity: 3 // Ad esempio, 3 mele nel carrello
        });
        client.carrello.push({
            nome: "Banane",
            prezzo: 1.5,
            quantity: 5 // Ad esempio, 3 mele nel carrello
        });
        console.log("Prodotti aggiunti al carrello:", client.carrello);
        await client.save();
        */

}


async function popola()
{
      await insert();

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
//app.use('/default.html');
// Pagina principale
app.get('/', (req, res) => {
    //popola();
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

/*
app.get('/carrello', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'carrello.html'));
});
*/
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
        const carrello = await ClienteServizio.getClientCarrello(clientId); // Usa la funzione nella cartella services
        if (!carrello) {
            return res.status(404).send('Carrello non trovato');
        }
        res.json(carrello.prodotti); // Ritorna i prodotti nel carrello
    } catch (error) {
        console.error('Errore durante il recupero del carrello:', error);
        res.status(500).send('Errore del server');
    }
});

app.post('/api/carrello/:clientId/add', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const { nome, prezzo, quantity } = req.body;
        const client = await DBClient.findById(clientId);
        if (!client) return res.status(404).json({ error: 'Cliente non trovato' });

        // Recupera il prodotto dal database
        const prodotto = await Productv2.findOne({ nome });
        if (!prodotto) return res.status(404).json({ error: 'Prodotto non trovato' });

        // Recupera la quantita nel carrello
        const item = client.carrello.find(p => p.nome === nome);
        const currentQuantity = item ? item.quantity : 0;

        if (currentQuantity + quantity > prodotto.quantita) {
            return res.status(400).json({ error: 'Quantità totale nel carrello eccede la quantità disponibile' });
        }

        // Aggiungi il prodotto al carrello
        if (item) {
            item.quantity += quantity;
        } else {
            client.carrello.push({ nome, prezzo, quantity });
        }
        await client.save();
        res.status(200).json({ message: 'Prodotto aggiunto al carrello' });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
});

app.post('/api/carrello/:clientId/removeOne', async (req, res) => {
    try {
        const clientId = req.params.clientId;
        const { nome } = req.body;
        const client = await DBClient.findById(clientId);
        if (!client) return res.status(404).json({ error: 'Cliente non trovato' });
        const item = client.carrello.find(p => p.nome === nome);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                client.carrello = client.carrello.filter(p => p.nome !== nome);
            }
            await client.save();
        }
        res.status(200).json({ message: 'Prodotto aggiornato' });
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
});


app.get('/api/prodotti/venditore/:id', async (req, res) => {
    try {
        const prodotto = await ProdottoServizio.getProductByVendor(req.params.id);
        if (!prodotto) {
            return res.status(404).send('Prodotto non trovato');
        }
        res.json(prodotto);
    } catch (error) {
        console.error('Errore durante il recupero del prodotto:', error);
        res.status(500).send('Errore del server');
    }
});


app.post('/api/prodotto', async (req, res) => {
    try {
        const { nome, descrizione, venditore, costo, quantita, tag } = req.body;
        const prodotto = new Prodotto(nome, descrizione, venditore, costo, quantita, tag);
        await ProdottoServizio.addProduct(prodotto);
        res.status(201).json({ message: 'Prodotto aggiunto con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta del prodotto:', error);
        res.status(500).json({ error: 'Errore del server' });
    }
});



mongoose.connect(dbUrl).then( ()=> {
    console.log("Connected!")
})
.catch(err => {
    console.log("Errore di connessione " ,err)
}).then(()=> {


// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
});