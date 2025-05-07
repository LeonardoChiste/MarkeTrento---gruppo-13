const bcrypt = require('bcrypt');
const saltRounds = 14;



async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 5);
    return hashedPassword;
  }

  async function comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

  module.exports= {hashPassword,comparePassword};