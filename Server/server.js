const express = require("express")
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const { root, getRecipes, editRecipes, deleteRecipe, createClient } = require("./Routes/routes");
const { Router } = require("express");
const router = Router()


const app = express();
dotenv.config();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors());

app.use(router.get("/", root));
app.use(router.get("/getRecipes", getRecipes))
app.use(router.post("/edit", editRecipes))
app.use(router.post("/delete", deleteRecipe));
app.use(router.post("/create", createClient));


app.listen(3000, 'localhost', () => {
    console.log(`API corriendo (mela) en el puorto 😈💦  : 3000.`);
    console.log(`Necesitamos un 7 para eximirnos 🙏🏻`)
})