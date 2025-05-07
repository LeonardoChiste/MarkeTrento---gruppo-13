const express =require( 'express');
const  bodyParser= require ('body-parser');
const mongoose = require ('mongoose');
const{ Cliente} = require( "./App.cjs");
const {hashPassword,comparePassword}= require ("./passwordhasher.cjs")




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

async function compareDB(cc) {
    try {
        // Find user by username
        const user = await Utente.findOne({ 
            username: cc.username 
        });
        
        if (!user) {
            return false;
        }
        else{

        var w= await hashPassword(cc.password)
        console.log(w);
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
                background-color: #f0fff0; /* verde molto chiaro */
                margin: 0;
                padding: 20px;
                color: #006400; /* verde scuro */
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #e0ffe0; /* verde chiaro */
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 100, 0, 0.1); /* ombra verde */
            }
            h1 {
                color: #008000; /* verde */
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
            button {
                background-color: #008000;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
            }
            button:hover {
                background-color: #006400;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>MarkeTrento - Pagina login</h1>
            <p class="description"Accedi alla web app con i tuoi dati personali.</p>
            
            <form action="/login" method="POST">
                <div class="form-group">
                    <label for="username">Nome utente:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit">Accedi</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Gestione del login (POST)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    var c=new Cliente(username,password,'nd')
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
            </style>
        </head>
        <body>
            <div class="container">
                <h1>TITOLO: MERCATO</h1>
                
                <div class="description">
                    <p>Questo è il mercato. Qui si possono selezionare i prodotti dai diversi venditori o reindirizzarsi alla sezione promozioni. Per ora ci sono 3 link vuoti</p>
                </div>
                
                <h2>Azioni disponibili:</h2>
                
                <div class="nav-links">
                    <a href="/prodotti">tasto1</a>
                    <a href="/venditori">tasto2</a>
                    <a href="/promozioni">tasto3</a>
                </div>
            </div>
        </body>
        </html>
    `);
});





mongoose.connect('mongodb+srv://luciangorie:Ciambella2021+@cluster0.uty9hib.mongodb.net/AuthNams').then( ()=> {
    console.log("Connected!")
})
.catch(err => {
    console.log("Errore di connessione " ,err)
}).then(()=> {


// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});});