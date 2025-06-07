const DBPictureProduct = require('../models/pictureProductModel.cjs');
const Prodotti = require('../models/productModel.cjs');
const mongoose = require('mongoose');

async function addProductImage(productId, imageBuffer, contentType) {
    try {
        const existingImage = await DBPictureProduct.findOne({ prodottoId });
        if (existingImage) {
            // Update existing image
            existingImage.img.data = imageBuffer;
            existingImage.img.contentType = contentType;
            await existingImage.save();
        } else {
            // Create new image entry
            const newImage = new DBPictureProduct({
                prodottoId,
                img: {
                    data: imageBuffer,
                    contentType
                }
            });
            await newImage.save();
        }
        //console.log('Immagine del prodotto aggiunta con successo');
    } catch (error) {
        console.error('Errore durante l\'aggiunta dell\'immagine del prodotto:', error);
    }
}
