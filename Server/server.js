"use strict"
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');


const app = express();
dotenv.config();
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 3000;
var host = process.env.PORT || '0.0.0.0';

var PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

const client = new cassandra.Client({
    contactPoints: ['css_node_1', 'css_node_2', 'css_node_3'],
    localDataCenter: 'datacenter1',
    keyspace: 'm1',
    authProvider: new PlainTextAuthProvider('cassandra', 'cassandra'),
})

const client_2 = new cassandra.Client({
    contactPoints: ['css_node_1', 'css_node_2', 'css_node_3'],
    localDataCenter: 'datacenter1',
    keyspace: 'm2',
    authProvider: new PlainTextAuthProvider('cassandra', 'cassandra'),
});

async function root(req, res) {

    res.send("Ola api 👻")
}

async function getRecipes(req, res) {
    const query = 'SELECT * FROM recetas';
    const response = await client_2.execute(query);
    res.json(response.rows);
};

async function editRecipes(req, res) {
    const query = 'select * from recetas where id = ? ALLOW FILTERING';
    const { id, comentario, farmacos, doctor } = req.body;
    client_2.execute(query, [id], { prepare: true }).then(response => {
        if (response.rows[0] != undefined) {
            console.log(response.rows);
            const query2 = `update recetas 
                        set 
                            comentario = ?, 
                            farmacos = ?,
                            doctor = ? 
                      where 
                            id=?;`;
            client_2.execute(query2, [comentario, farmacos, doctor, id]).then(response_ => {
                res.json("Receta actualizadisima! 🫣");
            }).catch(err => { console.log(err); });
        } else {
            res.json("Receta no encontrada! 😠 ");
        }
    }).catch(err => {
        console.log(err);
    })();
}

async function deleteRecipe(req, res) {
    const query2 = 'select * from recetas where id = ? ALLOW FILTERING';
    client_2.execute(query2, [req.body.id], { prepare: true }).then(response => {
        if (response.rows[0] != undefined) {
            // Existe el registro, a Deletear
            const query = `delete from recetas where id=?;`;
            console.log(response.rows);
            client_2.execute(query, [req.body.id]).then(response_ => {
                console.log(response_)
                res.json("La receta 📄 de ID: " + req.body.id + " ha sido eliminada! 👊🏼");
            }).catch(err => { console.log(err); });
        } else {
            res.json("Receta no encontrada! 🧐 ");
        }
    }).catch(err => {
        console.log(err);
    }
    )();
}

async function createClient(req, res) {

    const query = 'SELECT * FROM pacientes WHERE rut=? ALLOW FILTERING';
    const query2 = `INSERT INTO 
                                   pacientes (id, 
                                              nombre,
                                              apellido,
                                              rut,
                                              email,
                                              fecha_nacimiento) 
                                              VALUES(?,?,?,?,?,?);`;
    const query3 = `INSERT INTO 
                                   recetas (id, 
                                            id_paciente,
                                            comentario,
                                            farmacos,
                                            doctor) 
                                            VALUES(?,?,?,?,?);`;
    const receta = req.body;
    var uuid_1 = uuidv4();
    var uuid_2 = uuidv4();

    await client.execute(query, [receta.rut]).then(response => {
        console.log('Resultado 💸' + response.rows[0]);

        if (response.rows[0] != undefined) {
            console.log("existe el paciente")
            client_2.execute(query3, [uuid_2, response.rows[0].id, receta.comentario, receta.farmacos, receta.doctor]).then(response_ => {
                console.log('Resultado 💸' + response_);
                res.json({ 'ID_Receta 📄': uuid_2 })
            }).catch((err) => { console.log('ERROR:', err); });

        } else {
            console.log("No existe el paciente")
            client.execute(query2, [uuid_1, receta.nombre, receta.apellido, receta.rut, receta.email, receta.fecha_nacimiento]).then(response => {
                console.log('Result ' + response);
                client_2.execute(query3, [uuid_2, uuid_1, receta.comentario, receta.farmacos, receta.doctor]).then(response_ => {
                    console.log('Result ' + response_);
                    res.json({ 'ID_Receta 📄': uuid_2 })
                }).catch((err) => { console.log('ERROR:', err); });
            }).catch((err) => { console.log('ERROR:', err); });
        }
    }).catch((err) => { console.log('ERROR:', err); });
}

app.get('/', root);
app.get('/getRecipes', getRecipes);
app.get('/edit', editRecipes);
app.get('/delete', deleteRecipe);
app.get('/create', createClient);



app.listen(port, host, () => {
    console.log(`API corriendo (mela) en el puorto 😈💦  : 3000.`);
    console.log(`Necesitamos un 7 para eximirnos 🙏🏻`)
})