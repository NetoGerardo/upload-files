const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(morgan('dev'));
app.use(cors());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const { id } = req.body

        //const folder = `./uploads/${id}`;

        const folder = `../sistema-financeiro-corretora/public/assets/images/uploads/${id}`;

        console.log("TESTE");
        console.log("Path - " + folder);

        fs.mkdirSync(folder, { recursive: true })

        return cb(null, folder)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES";

        return cb(error, false);
    }

    return cb(null, true);
}

const upload = multer({
    storage: fileStorage,
    fileFilter,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/upload', upload.single('file'), (req, res) => {

    let rs = {
        "status": "OK",
    }

    console.log(req.file);

    return res.json({ file: req.file });
});

app.get('/', upload.single('file'), (req, res) => {

    let rs = {
        "status": "OK",
        "message": "Upload api Running!",
    }

});

app.use(function (err, req, res, next) {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "Somente imagens e PDF são permitidos" });
        return;
    }
})

app.listen(3333, () => {
    console.log("Upload started at 3333");
})