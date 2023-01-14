const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer');

const app = express();
app.use(morgan('dev'));
app.use(cors());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id } = req.body
        const path = `./uploads/${id}`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    }
})

const fileFilter = function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/PNG","image/gif", "application/pdf"]

    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Wrong file type");
        error.code = "LIMIT_FILE_TYPES";

        return cb(error, false);
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter,
})

app.post('/upload', upload.single('file'), (req, res) => {
    let rs = {
        "status": "OK",
    }

    return res.json(rs);
});

app.use(function (err, req, res, next) {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "Somente imagens e PDF são permitidos" });
        return;
    }
})

app.listen(3333, () => {
    console.log("Started at http://localhost:3333");
})