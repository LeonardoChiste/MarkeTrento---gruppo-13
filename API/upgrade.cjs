const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('../services/VenditoreService.cjs');
const router = express.Router();
const multer = require('multer');
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBFormVend = require('../models/upgradeModel.cjs');

// Multer configuration for PDF uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

router.post('/registrazione', upload.single('file'), tokenChecker('Imprenditore'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('No PDF file uploaded');
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const newFile = new DBFormVend({
            imprenditoreId: req.imprenditore, 
            file: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
                fileName: req.file.originalname
            },
            uploadDate: req.body.uploadDate || new Date()
        });
        await newFile.save();
        res.status(201).json({
            message: 'File uploaded successfully',
            id: newFile._id
        });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('', async (req, res) => {
    try {
        const files = await DBFormVend.find();
        res.status(200).json(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/registrazione/:id', async (req, res) => {
    try {
        const file = await DBFormVend.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        res.set('Content-Type', file.file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.file.fileName}"`);
        res.send(file.file.data);
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;