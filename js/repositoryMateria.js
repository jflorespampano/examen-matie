const mis_materias=[
    {
        "id":"1",
        "clave":"pr1",
        "nombre":"programación 1",
        "objetivo":"desarrollo de habilidades de  programación",
        "carrera":"isc"
    },
    {
        "id":"2",
        "clave":"ia",
        "nombre":"inteligencia artificial",
        "objetivo":"desarrollo de habilidades de  programación aplicados a la ia",
        "carrera":"isc"
    },
    {
        "id":"3",
        "clave":"rd",
        "nombre":"redes y telecominicaciones",
        "objetivo":"desarrollo de habilidades en la immplementación de redes",
        "carrera":"isc"
    }
]
const SQL_CREA_TABLA=`CREATE TABLE IF NOT EXISTS c_materia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clave varchar(15) DEFAULT NULL,
    nombre varchar(80) DEFAULT NULL,
    objetivo varchar(100),
    carrera varchar(20)
  );`
const SQL_INSERT=`INSERT INTO c_materia (clave,nombre,objetivo,carrera) VALUES (?,?,?,?)`
const SQL_SELECT_ALL=`SELECT * FROM c_materia`
const SQL_SELECT_ONE=`SELECT * FROM c_materia WHERE id = ?`
const SQL_UPDATE=`UPDATE c_materia SET clave = ?, nombre = ?, objetivo = ?, carrera = ? WHERE id = ?`
const SQL_DELETE=`DELETE FROM c_materia WHERE id = ?`

class MateriaRepository{
    constructor(dao){
        this.dao=dao;
    }
    createTable(){
        const sql = SQL_CREA_TABLA
        return this.dao.run(sql)
    }
    create(materia) {
        const { clave,nombre,objetivo,carrera } = materia
        return this.dao.run(
            SQL_INSERT,
            [clave,nombre,objetivo,carrera])
    }
    update(materia) {
        const { id, clave, nombre, objetivo, carrera } = materia
        return this.dao.run(
            SQL_UPDATE,
            [clave, nombre, objetivo, carrera, id]
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
        const sql=`SELECT name FROM sqlite_master WHERE type='table' AND name='c_materia';`
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
                        return Promise.all(mis_materias.map((materia)=>{
                            return this.create(materia)
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

export default MateriaRepository