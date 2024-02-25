const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = 80;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('audio'), async (req, res) => {
    const fileUrl = 'http://localhost:5000/upload'; 

    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const uploadedFilePath = req.file.path;
        
        const response = await axios.post(fileUrl, { fileUrl: req.file.path });
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }

        const result = response.data.result.text;

        fs.unlinkSync(uploadedFilePath);

        res.render("result", { result: result });
    } catch (error) {
        console.error('Error processing file:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
