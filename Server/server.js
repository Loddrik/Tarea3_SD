const express = require("express")
const bodyParser = require("body-parser");
const router = require("./Routes/routes");



const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(router);


app.listen(3000, 'localhost', () => {
    console.log(`API corriendo (mela) en el puorto 😈💦  : 3000.`);
    console.log(`Necesitamos un 7 para eximirnos 🙏🏻`)
})