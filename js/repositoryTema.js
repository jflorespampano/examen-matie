const mis_temas=[
    {
        "id":"1",
        "fk_materia":"1",
        "num_tema":1,
        "nombre":"conceptos básicos",
        "objetivo":"entender los conceptos teoricos de la programación"
    },
    {
        "id":"2",
        "fk_materia":"1",
        "num_tema":2,
        "nombre":"variables y expresiones",
        "objetivo":"entender los conceptos aplicados del manejo de memoria"
    },
    {
        "id":"3",
        "fk_materia":"1",
        "num_tema":3,
        "nombre":"entrada salida",
        "objetivo":"entender los conceptos aplicados de la e/s"
    },
    {
        "id":"4",
        "fk_materia":"1",
        "num_tema":4,
        "nombre":"if/switch",
        "objetivo":"entender los conceptos aplicados de la toma de decisiones"
    },
    {
        "id":"5",
        "fk_materia":"1",
        "num_tema":5,
        "nombre":"ciclos",
        "objetivo":"entender los conceptos de ciclos"
    },
    {
        "id":"6",
        "fk_materia":"1",
        "num_tema":6,
        "nombre":"arreglos y cadenas",
        "objetivo":"entender los conceptos dearreglos"
    },
    {
        "id":"7",
        "fk_materia":"1",
        "num_tema":7,
        "nombre":"funciones",
        "objetivo":"entender los conceptos de funciones"
    }
]
const SQL_CREA_TABLA=`CREATE TABLE IF NOT EXISTS c_tema (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_materia varchar(10) NOT NULL,
    num_tema smallint(6) NOT NULL,
    nombre varchar(100) DEFAULT NULL,
    objetivo varchar(250) DEFAULT NULL,
    FOREIGN KEY (fk_materia) REFERENCES c_materia (clave)
  );`
const SQL_INSERT=`INSERT INTO c_tema (fk_materia,num_tema,nombre,objetivo) VALUES (?,?,?,?)`
const SQL_SELECT_ALL=`SELECT * FROM c_tema`
const SQL_SELECT_ONE=`SELECT * FROM c_tema WHERE id = ?`
const SQL_UPDATE=`UPDATE c_tema SET fk_materia = ?, num_tema = ?, nombre = ?, objetivo = ?  WHERE id = ?`
const SQL_DELETE=`DELETE FROM c_tema WHERE id = ?`

class TemaaRepository{
    constructor(dao){
        this.dao=dao;
    }
    createTable(){
        const sql = SQL_CREA_TABLA
        return this.dao.run(sql)
    }
    create(tema) {
        const { fk_materia,num_tema,nombre,objetivo} = tema
        return this.dao.run(
            SQL_INSERT,
            [fk_materia,num_tema,nombre,objetivo])
    }
    update(tema) {
        const { id,fk_materia,num_tema,nombre,objetivo } = tema
        return this.dao.run(
            SQL_UPDATE,
            [fk_materia,num_tema,nombre,objetivo,id]
        )
    }
    delete(id) {
        return this.dao.run(
            SQL_DELETE,
            [id]
        )
    }
    getById(id) {
        return this.dao.get(
            SQL_SELECT_ONE,
            [id])
    }
    getAll() {
        return this.dao.all(SQL_SELECT_ALL)
    }
    existe_tabla(){
        const sql=`SELECT name FROM sqlite_master WHERE type='table' AND name='c_tema';`
        return this.dao.get(sql)
    }
    crea_y_puebla(){
        return this.existe_tabla()
        .then(result=>{
            if(result ===  undefined){
                console.log("si no xiste la tabla se crea y se puebla")
                return this.createTable()
                .then(
                    (data)=>{
                        //console.log("en crea y puebla: ",data)
                        return Promise.all(mis_temas.map((tema)=>{
                            return this.create(tema)
                        }))
                    }
                )
            }
            else{
                console.log("en crea y puebla , tabla existente")
                return Promise.resolve("tabla existente")
            }
        })
        .catch((err)=>{
            return new Promise((_,reject)=>{
                reject("Error "+err)
            })
        })
    }
}

export default TemaaRepository