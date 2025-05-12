const express =require( 'express');
const path = require('path');
const fs = require('fs');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const{ Cliente} = require( "./App.cjs");
const {hashPassword,comparePassword}= require ("./passwordhasher.cjs")
require('dotenv').config({ path: 'process.env' });
const{Prodotto} = require ("./prodotto.cjs");

const dbUrl = process.env.DB_URL;


const app = express();
const PORT = 3000;


// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

const cs=new mongoose.Schema(
    {
        id:Number,
        nome:String,
        cognome:String,
        birthdate:Number,
        email:String,
        username:String,
        password:String,
    
    });
    const Utente =mongoose.model('Clienti',cs);
    
    
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

function generateProduct()
{
    var p=new Prodotto('1 kg di Mele Golden', 'mele golden coltivate senza uso di fitofarmaci in Val di Non',2.20,'Mele');
    return p;
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
    res.send(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MarkeTrento Official Webapp</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0fff0;
                margin: 0;
                padding: 20px;
                color: #006400;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #e0ffe0;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 100, 0, 0.1);
            }
            h1 {
                color: #008000;
                text-align: center;
            }
            .description {
                margin-bottom: 20px;
                text-align: center;
                font-style: italic;
            }
            .form-group {
                margin-bottom: 15px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            input[type="text"],
            input[type="password"] {
                width: 100%;
                padding: 8px;
                border: 1px solid #008000;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .login-btn {
                background-color: #008000;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
                margin-bottom: 10px;
            }
            .login-btn:hover {
                background-color: #006400;
            }
            .register-btn {
                background-color: white;
                color: #008000;
                padding: 8px 15px;
                border: 1px solid #008000;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
                margin-bottom: 10px;
            }
            .register-btn:hover {
                background-color: #f0fff0;
            }
            .guest-btn {
                background-color: #008000;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
            }
            .guest-btn:hover {
                background-color: #006400;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>MarkeTrento - Pagina login</h1>
            <p class="description">Accedi alla web app con i tuoi dati personali.</p>
            
            <form action="/login" method="POST">
                <div class="form-group">
                    <label for="username">Nome utente:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="login-btn">Accedi</button>
            </form>
            
            <button class="register-btn" onclick="window.location.href='/registrazione'">Registrati</button>
            
            <form action="/mercato" method="GET">
                <button type="submit" class="guest-btn">Accedi senza registrazione</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Gestione del login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    var c=new Cliente('n','n',2,'nd',username,password)
    var au= await compareDB(c);
    if (au) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Accesso effettuato</title>
                <style>
                    .progress-container {
                        width: 100%;
                        background-color: #ddd;
                        border-radius: 5px;
                        margin: 20px 0;
                    }
                    .progress-bar {
                        height: 20px;
                        background-color: #4CAF50;
                        border-radius: 5px;
                        width: 0%;
                        transition: width 3s linear;
                    }
                </style>
                <script>
                    window.onload = function() {
                        document.getElementById('progress').style.width = '100%';
                        setTimeout(function() {
                            window.location.href = '/mercato';
                        }, 3000);
                    };
                </script>
            </head>
            <body>
                <h1 style="color: #008000;">Accesso effettuato come ${username}</h1>
                <div class="progress-container">
                    <div id="progress" class="progress-bar"></div>
                </div>
                <p>Reindirizzamento in corso...</p>
            </body>
            </html>
        `);
    }
    else res.send(`<h1 style="color: #008000;">Accesso NON EFFETTUATO!</h1>`)
});


app.get('/mercato', (req, res) => {
    // 1. Genera il prodotto
    const prodotto = generateProduct(); // Assicurati che questa funzione restituisca un oggetto Prodotto
    
    // 2. Leggi il template HTML
    const templatePath = path.join(__dirname,'public','templateprodotto.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // 3. Crea la card del prodotto
    const productCard = `
        <div class="product-card" style="border: 1px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>${prodotto.nome}</h3>
            <p>${prodotto.descrizione}</p>
            <p><strong>Prezzo:</strong> €${prodotto.prezzo}</p>
            <p><strong>Categoria:</strong> ${prodotto.tag}</p>
        </div>
    `;
    
    // 4. Invia la risposta con il template modificato
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Mercato</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px;
                    line-height: 1.6;
                }
                h1 { 
                    color: #0066cc; 
                    border-bottom: 2px solid #0066cc;
                    padding-bottom: 10px;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .description {
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                }
                .nav-links {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                    padding: 8px 15px;
                    border: 1px solid #0066cc;
                    border-radius: 5px;
                    transition: all 0.3s;
                }
                a:hover {
                    background-color: #0066cc;
                    color: white;
                }
                .product-card {
                    background-color: #f9f9f9;
                    padding: 15px;
                    margin: 20px 0;
                    border-left: 4px solid #0066cc;
                }
                .product-title {
                    color: #0066cc;
                    margin-top: 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>MarkeTrento - Mercato</h1>
                
                <div class="description">
                    <p>Ecco il prodotto disponibile nel nostro mercato:</p>
                </div>
                
                <!-- Inserisci la card del prodotto qui -->
                ${productCard}
                
                <h2>Azioni disponibili:</h2>
                
                <div class="nav-links">
                    <a href="/prodotti">Vedi tutti i prodotti</a>
                    <a href="/venditori">Vedi i venditori</a>
                    <a href="/promozioni">Promozioni</a>
                </div>
            </div>
        </body>
        </html>
    `);
});




//Va su tutti gli IP solo oggi 07/05, se non funziona chiedetemi che sblocco, Luzzani A
mongoose.connect(dbUrl
).then( ()=> {
    console.log("Connected!")
})
.catch(err => {
    console.log("Errore di connessione " ,err)
}).then(()=> {


// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});});