const bcrypt = require('bcrypt');
const  Imprenditore  = require('./classes/Imprenditore.cjs');
const Venditore = require('./classes/Venditore.cjs');
const DBVendor=require('./models/vendorModel.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');




async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 5);
    return hashedPassword;
  }

  async function comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

async function compareDBbusiness(username, password) {
    // Create a new instance of the Client class

    const cc = new Imprenditore('', '', new Date(), '', username, password, '', '', '');
    try {
        // Find user by username
        const user = await DBEntrepreneur.findOne({ 
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
}

async function compareDBbusinessv2(username, password) {
    // Create a new instance of the Client class

    const cc = new Venditore('', '', new Date(), '', username, password, '', '', '',1);
    try {
        // Find user by username
        const user = await DBVendor.findOne({ 
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
}


  module.exports= {hashPassword,comparePassword,compareDBbusiness,compareDBbusinessv2};