const express = require("express")
const bodyParser = require("body-parser");
const router = require("./Routes/routes");
const dotenv = require("dotenv");



const app = express();
dotenv.config();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors());
app.use(router);


app.listen(3000, 'localhost', () => {
    console.log(`API corriendo (mela) en el puorto 😈💦  : 3000.`);
    console.log(`Necesitamos un 7 para eximirnos 🙏🏻`)
})