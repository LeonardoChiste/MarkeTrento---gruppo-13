const express =require( 'express');
require('dotenv').config({ path: 'process.env' });
const VenditoreServizio = require('../services/VenditoreService.cjs');
const router = express.Router();
const tokenChecker = require('../tokenchecker.cjs').tokenChecker;
const DBFormVend = require('../models/regVend.cjs');

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

router.post('/registrazione', upload.single('pdfFile'), tokenChecker('Imprenditore'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const newFile = new DBFormVend({
            imprenditore: new DBEntrepreneur(req.user._id), 
            pdf: new DBFormVend.fileSchema({
                data: req.file.buffer,
                contentType: req.file.mimetype,
                fileName: req.file.originalname
            }),
            uploadDate: new Date()
        });
        await newFile.save();
        res.status(201).json({
            message: 'File uploaded successfully',
            id: newFile._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});