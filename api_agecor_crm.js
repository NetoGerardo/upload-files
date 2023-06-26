const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const axios = require('axios');

const app = express();
app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/supervisores', (req, res) => {

    axios
        .post('http://207.180.228.250/api/supervisores/search')
        .then((req) => {
            let rs = {
                "status": "OK",
                "supervisores": req.data.supervisores
            }

            console.log(rs);

            return res.json(rs);
        })
        .catch((error) => {
            let rs = {
                "status": "Erro insperado",
                "error": error
            }

            return res.json(rs);
        })
});

app.listen(3315, () => {
    console.log("Ageocr Api started at 3315");
})