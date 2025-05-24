const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const Venditore = require( "./classes/Venditore.cjs");
const Imprenditore = require( "./classes/Imprenditore.cjs");
const {compareDBbusiness,compareDBbusinessv2,compareDB}= require ("./passwordmanager.cjs");
const {tokenChecker,TokenGen,st} = require ("./tokenchecker.cjs");
require('dotenv').config({ path: 'process.env' });

const Prodotto = require('./classes/prodotto.cjs');
const ProdottoServizio = require('./services/ProdottoService.cjs');
const ClienteServizio = require('./services/clienteService.cjs');
const dbUrl = process.env.DB_URL;
const DBVendor=require('./models/vendorModel.cjs');
const DBTags=require('./models/tagsModel.cjs');
const TagServizio=require('./services/tagService.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');
const Productv2=require('./models/productModel.cjs');  
const DBPromotion=require('./models/promotionModel.cjs');
//const Order=require('./models/orderModel.cjs');     //Orders contiene un product
const DBClient=require('./models/clientModel.cjs');
const VenditoreServizio = require('./services/VenditoreService.cjs');
const carrello = require('./carrello.cjs');
const promozione = require('./promozione.cjs');
const venditore = require('./venditore.cjs');
const prodotto = require('./prodotto.cjs');
const tags = require('./tags.cjs');
const app = express();
const port = process.env.PORT || 3000;


// Middleware
//app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(express.static('public'));
    
    
    
    //FUNZIONE PER GENERARE COSE DA INSERIRE NEL DB PER TEST, con copilot su VSC SI FA MOLTO VELOCEMENTE
    async function insert(){
       /*var v=new Venditore('Caio','Borghese',19091990,'iosono@caioBorghese.com','CAIO', '$2b$10$nKxnTjFuyq6JGKYuDWbq.uvJvHXV3g/JBiHmtSAL0Gxtf8Axr9kSa','Via Dani Pedrosa,26','vendo Pere, le pere sono il mio special','agricoltore','P9876');
       await DBVendor.create(v);
       console.log("Venditore inserito con successo!");*/

       /*var tg=new DBTags({tags:['mele','pere','frutti di bosco','castagne','asparagi','ciliege','olio','alcolici','gastronomia','sughi','tuberi','carne','pesce','formaggi','miele','bevande','dolci','salumi','funghi','frutta']})
        await DBTags.create(tg);*/
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
        /*
        await DBPromotion.create({ data: '2025-05-20', titolo: 'Castagnata', promotore: 'Dario Lampa', descrizione: 'Una castagnata a Mezzocorona dalle 16.00 fino a mezza notte',
            img: 'https://pbs.twimg.com/media/FbbTu_sWIAEIR9T.jpg', tipoAnnuncio: 'Evento'}).catch(err => console.error('Error:', err));

        console.log("Promozione inserita con successo!");
        const copia = await DBPromotion.findOne({titolo: 'Castagnata'});
        if(!copia){
            console.log("non aggiunta");
            return;
        }*/
}


async function popola()
{
      await insert();

}

app.use(express.urlencoded({ extended: true })); // Per form HTML
app.use(express.json()); // Per dati JSON (opzionale ma utile)
//app.use('/default.html');
// Pagina principale
app.get('/', (req, res) => {
    //popola();
    res.status(200).sendFile(path.join(__dirname, 'public', `/default.html`));
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

app.use('/api/v1/carrello', carrello);
app.use('/api/v1/promozione', promozione);  
app.use('/api/v1/venditore', venditore);    
app.use('/api/v1/prodotto', prodotto);  
app.use('/api/v1/tags', tags);

//login stuff
app.post('/login', async (req, res) => {
    const { usermail, password } = req.body;
    var au = await compareDB(usermail, password);
    if (au) {
          const token = TokenGen(usermail);
        /*res.status(200).json({
            message: "Login effettuato!",
            token: token
        });*/
        st(token);
        res.status(200).send(`
            <script>
                window.usermail = "${usermail}";
                window.localStorage.setItem("usermail", window.usermail);
                window.location.href = "/login.html";
            </script>
        `);
    } else {
        res.status(401).send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`);
    }
});

app.post('/loginbusiness', async (req, res) => {
    const { usermail, password } = req.body;
    var au= await compareDBbusiness(usermail, password);
    if (au) {
        res.status(200).sendFile(path.join(__dirname, 'public', '/loginbusiness.html'));
    }
    else
    {
        au= await compareDBbusinessv2(usermail, password);
        if (au) {
            res.status(200).sendFile(path.join(__dirname, 'public', '/loginbusiness.html'));
        }
        else res.status(401).send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`)
    }

});



app.get('/mercato', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', `/home.html`));
});





mongoose.connect(dbUrl).then( ()=> {
    console.log("Connected!")
})
.catch(err => {
    console.log("Errore di connessione " ,err)
}).then(()=> {


// Avvio del server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});
});