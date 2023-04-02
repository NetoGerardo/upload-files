const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');

const fse = require('fs-extra');
const axios = require('axios').default;

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '200mb' }));

let pathRaiz = "../whatsz-gerador/public/assets/images/downloads/";

app.get('/', (req, res) => {

    let response = {
        "status": "OK",
        "message": "Download api Running"
    }

    return res.json(response);
})

app.post('/download', (req, res) => {

    let contRetornos = 0;

    for (let i = 0; i < req.body.urls.length; i++) {

        startDownload(req.body.urls[i].url, decodeURI(req.body.urls[i].fileName), () => {

            contRetornos++;

            console.log("Retorno " + contRetornos);

            if (contRetornos == req.body.urls.length) {

                console.log("Respondendo");

                let response = {
                    "status": "OK",
                    "message": "Download concluído"
                }

                return res.json(response);
            }
        });
    }

    async function startDownload(url, fileName, cb) {

        const buffer = await getBase64(url);

        fse.outputFile(pathRaiz + "/" + fileName, buffer, err => {
            if (err) {
                console.log(err);
            } else {
                cb();
            }
        })
    }
})

async function getBase64(url) {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then((response) => {
            return Buffer.from(response.data, 'binary');
        });
}

app.listen(3322, () => {
    console.log("Download at 3322");
})