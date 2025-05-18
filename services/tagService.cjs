const DBTags = require('../models/tagsModel.cjs');

async function getTags() {
    try {
        const tags = await DBTags.findById('682900cb94c2ec14e0b5895a');
        return tags;
    } catch (error) {
        console.error('Errore durante il recupero dei tag:', error.message);
        throw error;
    }
}

module.exports = {
    getTags,
};