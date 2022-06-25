const express = require("express")
const bodyParser = require("body-parser")
const { root, getRecipes, editRecipes, deleteRecipe, createClient } = require("./Routes/routes")


const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());


app.get("/", root);
app.get("/getRecipes", getRecipes);
app.post("/edit", editRecipes);
app.post("/delete", deleteRecipe);
app.post("/create", createClient);


app.listen(3000, 'localhost', () => {
    console.log(`API run in: http://localhost:3000.`);
})