const bcrypt = require('bcrypt');
const  Imprenditore  = require('./classes/Imprenditore.cjs');
const DBEntrepreneur=require('./models/promoterModel.cjs');
const saltRounds = 14;



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


  module.exports= {hashPassword,comparePassword,compareDBbusiness};