const express =require( 'express');
const path = require('path');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require( "./classes/Cliente.cjs");
const Imprenditore = require('./classes/Imprenditore.cjs');
const Venditore = require( "./classes/Venditore.cjs");
const {hashPassword,comparePassword,compareDBbusiness,compareDBbusinessv2,compareDB, compareDBadmin}= require ("./passwordmanager.cjs");
const {tokenChecker,TokenGen,TokenGenEnt,TokenGenVend, TokenGenAdmin, st} = require ("./tokenchecker.cjs");
require('dotenv').config({ path: 'process.env' });
const {LocalStorage} = require('node-localstorage');
const authcheck = require('./API/authcheck.cjs');

const Prodotto = require('./classes/prodotto.cjs');

const dbUrl = process.env.DB_URL;

const DBVendor=require('./models/vendorModel.cjs');
const DBTags=require('./models/tagsModel.cjs');
const CityTags=require('./models/citytagsModel.cjs');
const TagServizio=require('./services/tagService.cjs');
const ImprenditoreServizio = require('./services/businessService.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');
const Productv2=require('./models/productModel.cjs');  
const DBPromotion=require('./models/promotionModel.cjs');
//const Order=require('./models/orderModel.cjs');     //Orders contiene un product
const DBClient=require('./models/clientModel.cjs');
const DBFormVend = require ('./models/upgradeModel.cjs');
const DBAdmin = require('./models/adminModel.cjs');

//API imports
const carrelli = require('./API/carrello.cjs');
const promozioni = require('./API/promozione.cjs');
const venditori = require('./API/venditore.cjs');
const prodotti = require('./API/prodotto.cjs');
const accounts = require('./API/account.cjs');
const tags = require('./API/tags.cjs');
const citytags = require('./API/citytags.cjs');
const order = require('./API/order.cjs');
const mail = require('./API/mail.cjs');
const clienti = require('./API/clienti.cjs');
const upgrade = require('./API/upgrade.cjs');
const imprenditore = require('./API/imprenditore.cjs');
const consegne = require('./API/consegne.cjs')
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

        /*
       const tagsToAdd = [
            { tag: 'Gardolo' },
            { tag: 'Ravina' },
            { tag: 'Romagnano' },
            { tag: 'Baselga del Bondone' },
            { tag: 'Cadine' },
            { tag: 'Candrai' },
            { tag: 'Celva' },
            { tag: 'Cognola' },
            { tag: 'Gabbiolo' },
            { tag: 'Gardolo di Mezzo' },
            { tag: 'Gazzadina' },
            { tag: 'Martignano' },
            { tag: 'Mattarello' },
            { tag: 'Meano' },
            { tag: 'Mesiano' },
            { tag: 'Mezzocorona' },
            { tag: 'Mezzolombardo' },
            { tag: 'Montevaccino' },
            { tag: 'Lavis' },
            { tag: 'Oltrecastello' },
            { tag: 'Povo' },
            { tag: 'Roncafort' },
            { tag: 'Rovereto' },
            { tag: 'San Michele' },
            { tag: 'Sardagna' },
            { tag: 'Sopramonte' },
            { tag: 'Tavernaro' },
            { tag: 'Trento città' },
            { tag: 'Valsorda' },
            { tag: 'Vason' },
            { tag: 'Vela' },
            { tag: 'Vigo Meano' },
            { tag: 'Vigolo Baselga' },
            { tag: 'Villamontagna' },
            { tag: 'Villazzano' },
        ];

        await CityTags.create(tagsToAdd);
        console.log("Tags inseriti con successo!");
        */
       /*const imprenditore = new DBEntrepreneur({
            nome: 'Maya',
            cognome: 'Lona',
            birthdate: new Date('1980-01-01'),
            email: 'mayalona@tmail.com',
            username: 'maya',
            password: await hashPassword('maya123'),
            sede: 'Pressano',
            descrizione: 'Promotore di prodotti locali',
            tipo: 'Imprenditore',
            carrello: [], 
       });
       await imprenditore.save()*/

}


async function popola()
{
      await insert();

}

app.use(express.urlencoded({ extended: true })); // Per form HTML
app.use(express.json()); // Per dati JSON (opzionale ma utile)
//app.use('/login.html');
// Pagina principale
app.get('/', (req, res) => {
    //addCarrelloToVendors();
    //addCarrelloToPromoters();
    //popola();
    //cleanCarts();
    res.status(200).sendFile(path.join(__dirname, 'public', `/login.html`));
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

app.use('/api/v1/carrelli', carrelli);
app.use('/api/v1/promozioni', promozioni);  
app.use('/api/v1/venditori', venditori);    
app.use('/api/v1/prodotti', prodotti);  
app.use('/api/v1/tags', tags);
app.use('/api/v1/accounts',accounts)
app.use('/api/v1/citytags', citytags);
app.use('/api/v1/orders', order);
app.use('/api/v1/service',mail);
app.use('/api/v1/clienti', clienti);
app.use('/check', authcheck);
app.use('/api/v1/upgrades', upgrade);
app.use('/api/v1/imprenditori', imprenditore);
app.use('/api/v1/consegne', consegne);

//login stuff
app.post('/login', async (req, res) => {
    const { usermail, password } = req.body;
    var usermail1 = usermail.toLowerCase();
    var au = await compareDB(usermail1, password);
    if (au) {
    const token = TokenGen(usermail1);
    res.send(`
        <html>
        <head><title>Login</title></head>
        <body>
            <script>
                localStorage.setItem('token', '${token}');
                window.location.href = '/caricamento.html';
            </script>
        </body>
        </html>
    `);
}
    else {
        res.status(401).send(`<h1 style="color: #008000;">Accesso non effettuato!</h1>`);
    }
});

app.post('/loginbusiness', async (req, res) => {
    const { usermail, password } = req.body;
    var usermail1 = usermail.toLowerCase();
    var au= await compareDBbusiness(usermail1, password);
    if (au) {
        const token = TokenGenEnt(usermail1);
        st(token);
        res.send(`
        <html>
        <head><title>Login</title></head>
        <body>
            <script>
                localStorage.setItem('token', '${token}');
                window.location.href = '/caricamento-business.html';
            </script>
        </body>
        </html>
    `);
    }
    else
    {
        au= await compareDBbusinessv2(usermail, password);
        if (au) {
            const token = TokenGenVend(usermail);
            st(token);
            res.send(`
        <html>
        <head><title>Login</title></head>
        <body>
            <script>
                localStorage.setItem('token', '${token}');
                window.location.href = '/caricamento-business.html';
            </script>
        </body>
        </html>
    `);
        }
        else res.status(401).send(`<h1 style="color: #008000;">Accesso non effettuato!</h1>`)
    }

});

app.post('/loginadmin', async (req, res) => {
    const { usermail, password } = req.body;
    var usermail1 = usermail.toLowerCase();
    var au= await compareDBadmin(usermail1, password);
    if (au) {
        const token = TokenGenAdmin(usermail1);
        st(token);
        res.send(`
        <html>
        <head><title>Login</title></head>
        <body>
            <script>
                localStorage.setItem('token', '${token}');
                window.location.href = '/admin-home.html';
            </script>
        </body>
        </html>
    `);
    } else res.status(401).send(`<h1 style="color: #008000;">Accesso non effettuato!</h1>`)
});



app.get('/homev1', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', `/business.html`));
});



//AGGIUNTA DI API IN FONDO AL MAIN, DA ORGANIZZARE, UNA SU IMPRENDITORE, UNA SU CLIENTE


//DEBUGGING CARRELLI
async function cleanCarts() {
    const clients = await DBClient.find();
    for (const client of clients) {
        if (Array.isArray(client.carrello)) {
            // Remove null or invalid products
            client.carrello = client.carrello.filter(p => p && p._id);
            await client.save();
        }
    }
    console.log('Carrelli puliti!');
}

async function addCarrelloToVendors() {
    const vendors = await DBVendor.find();
    for (const vendor of vendors) {
        if (!Array.isArray(vendor.carrello)) {
            vendor.carrello = [];
            await vendor.save();
        }
    }
    console.log('Carrello aggiunto a tutti i venditori!');
}

// Utility function to add carrello to all promoters
async function addCarrelloToPromoters() {
    const promoters = await DBEntrepreneur.find();
    for (const promoter of promoters) {
        if (!Array.isArray(promoter.carrello)) {
            promoter.carrello = [];
            await promoter.save();
        }
    }
    console.log('Carrello aggiunto a tutti i promotori!');
}





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