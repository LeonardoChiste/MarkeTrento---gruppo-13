const bcrypt = require('bcrypt');
const Cliente = require('./classes/Cliente.cjs');
const  Imprenditore  = require('./classes/Imprenditore.cjs');
const Venditore = require('./classes/Venditore.cjs');
const DBClient = require('./models/clientModel.cjs');
const DBVendor=require('./models/vendorModel.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');
const DBAdmin=require('./models/adminModel.cjs');




async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 5);
    return hashedPassword;
  }

  async function comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

async function compareDBbusiness(usermail, password) {
    // Create a new instance of the Client class

    const cc = new Imprenditore('', '', new Date(),usermail, ' ', password, '', '', '');
    try {
        // Find user by username
        const user = await DBEntrepreneur.findOne({ 
            email: cc.email 
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
}

async function compareDBadmin(usermail, password) {
    // Create a new instance of the Client class

    const cc = new Imprenditore('', '', new Date(),usermail, ' ', password, '', '', '');
    try {
        // Find user by username
        const user = await DBAdmin.findOne({ 
            email: cc.email 
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
}

async function compareDBbusinessv2(usermail, password) {
    

    const cc = new Venditore('', '', new Date(),usermail, 'username', password, '', '', '',1);
    try {
        const user = await DBVendor.findOne({ 
            email: cc.email 
        });
        
        if (!user) {
            return false;
        }
        else{
        return comparePassword(cc.password,user.password)
        
        }
    } catch (error) {
        console.error("Error in compareDB:", error);
        return false;
    }
}

async function compareDB(usermail, password) {

    const cc = new Cliente('a','b',10102000, usermail,'c', password);
    try {
        // Find user by email
        const user = await DBClient.findOne({ 
            email: cc.email
        });
        
        if (!user) {
            return false;
        }
        else{
        return comparePassword(cc.password,user.password)
        
        }
    } catch (error) {
        console.error("Error in compareDB:", error);
        return false;
    }
};


  module.exports= {hashPassword,comparePassword,compareDBbusiness,compareDBbusinessv2,compareDB,compareDBadmin};