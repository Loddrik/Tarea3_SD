const cassandra = require("cassandra-driver")
const { Router } = require('express')
const { v4: uuidv4 } = require('uuid');




var authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');

const client = new cassandra.Client({
    contactPoints: ['css_node_1', 'css_node_2', 'css_node_3'],
    localDataCenter: 'datacenter1',
    keyspace: 'medic_1',
    authProvider: authProvider,
})

const client_2 = new cassandra.Client({
    contactPoints: ['css_node_1', 'css_node_2', 'css_node_3'],
    localDataCenter: 'datacenter1',
    keyspace: 'medic_2',
    authProvider: authProvider,
});

const root = (req, res) => {

    res.send("Ola api 👻")
}

const getRecipes = async (req, res) => {
    const query = 'SELECT * FROM recetas';
    const result = await client_2.execute(query);
    res.json(result.rows);
};

const editRecipes = async (req, res) => {
    const query = 'select * from recetas where id = ? ALLOW FILTERING';
    const { id, comentario, farmacos, doctor } = req.body;
    client_2.execute(query, [id], { prepare: true }).then(result => {
        if (result.rows[0] != undefined) {
            // Existe el registro, a Updatear
            console.log(result.rows);
            const query2 = `update recetas 
                        set 
                            comentario = ?, 
                            farmacos = ?,
                            doctor = ? 
                      where 
                            id=?;`;
            client_2.execute(query2, [comentario, farmacos, doctor, id]).then(result2 => {
                console.log(result2)
                res.json("Receta actualizadisima! 🫣");
            }).catch(err => { console.log(err); });
        } else {
            res.json("Receta no encontrada! 😠 ");
        }
    }).catch(err => {
        console.log(err);
    })();
}

const deleteRecipe = async (req, res) => {
    const query2 = 'select * from recetas where id = ? ALLOW FILTERING';
    client_2.execute(query2, [req.body.id], { prepare: true }).then(result => {
        if (result.rows[0] != undefined) {
            // Existe el registro, a Deletear
            const query = `delete from recetas where id=?;`;
            console.log(result.rows);
            client_2.execute(query, [req.body.id]).then(result2 => {
                console.log(result2)
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

const createClient = async (req, res) => {

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
    var gen_id_1 = uuidv4();
    var gen_id_2 = uuidv4();

    await client.execute(query, [receta.rut]).then(result => {
        console.log('Result 💸' + result.rows[0]);

        if (result.rows[0] != undefined) {
            console.log("existe el paciente")
            client_2.execute(query3, [gen_id_2, result.rows[0].id, receta.comentario, receta.farmacos, receta.doctor]).then(result2 => {
                console.log('Result 💸' + result2);
                res.json({ 'ID_Receta 📄': gen_id_2 })
            }).catch((err) => { console.log('ERROR:', err); });

        } else {
            console.log("No existe el paciente")
            client.execute(query2, [gen_id_1, receta.nombre, receta.apellido, receta.rut, receta.email, receta.fecha_nacimiento]).then(result => {
                console.log('Result ' + result);
                client_2.execute(query3, [gen_id_2, gen_id_1, receta.comentario, receta.farmacos, receta.doctor]).then(result2 => {
                    console.log('Result ' + result2);
                    res.json({ 'ID_Receta 📄': gen_id_2 })
                }).catch((err) => { console.log('ERROR:', err); });
            }).catch((err) => { console.log('ERROR:', err); });
        }
    }).catch((err) => { console.log('ERROR:', err); });
}
var router = Router()

router.get("/", root);
router.get("/getRecipes", getRecipes)
router.post("/edit", editRecipes);
router.post("/delete", deleteRecipe);
router.post("/create", createClient);

module.exports = router