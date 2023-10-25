const mis_profesores=[
    {
        "id":1,
        "num_emp": 779,
        "name":"Jesús Alejandro Flores Hernández",
        "mail1":"jflores@gmail",
        "mail2":"jflores@pampano",
        "telefon":"9381111"
    },
    {
        "id":2,
        "num_emp": 301,
        "name":"Juan Canto",
        "mail1":"canto@gmail",
        "mail2":"canto@pampano",
        "telefon":"9381111"
    },
    {
        "id":3,
        "num_emp": 302,
        "name":"Jose Angel",
        "mail1":"angel@gmail",
        "mail2":"angel@pampano",
        "telefon":"9382222"
    },
    {
        "id":4,
        "num_emp": 303,
        "name":"Damaris Perez",
        "mail1":"ddama@gmail",
        "mail2":"dama@pampano",
        "telefon":"9383333"
    }

]
const SQL_CREA_TABLA=`
CREATE TABLE IF NOT EXISTS c_profesor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    num_emp varchar(10) NOT NULL,
    name varchar(50) DEFAULT NULL,
    mail1 varchar(50) DEFAULT NULL,
    mail2 varchar(50) DEFAULT NULL,
    telefon varchar(20) DEFAULT NULL
);`
const SQL_INSERT='INSERT INTO c_profesor (num_emp,name,mail1,mail2,telefon) VALUES (?,?,?,?,?)'
const SQL_SELECT_ALL=`SELECT * FROM c_profesor`
const SQL_SELECT_ONE=`SELECT * FROM c_profesor WHERE id = ?`
const SQL_UPDATE=`UPDATE c_profesor SET num_emp= ?, name = ?, mail1= ?, mail2= ?, telefon= ? WHERE id = ?`
const SQL_DELETE=`DELETE FROM c_profesor WHERE id = ?`
class ProfesorRepository{
    constructor(dao){
        this.dao=dao;
    }
    createTable(){
        const sql = SQL_CREA_TABLA
        return this.dao.run(sql)
    }
    create(profesor) {
        const { num_emp,name,mail1,mail2,telefon } = profesor
        return this.dao.run(
            SQL_INSERT,
            [num_emp,name,mail1,mail2,telefon])
    }
    update(profesor) {
        const { id, num_emp, name, mail1, mail2, telefon } = profesor
        return this.dao.run(
            SQL_UPDATE,
            [num_emp, name, mail1, mail2, telefon, id]
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
        const sql=`SELECT name FROM sqlite_master WHERE type='table' AND name='c_profesor';`
        return this.dao.get(sql)
    }
    crea_y_puebla(){
        return this.existe_tabla()
        .then(result=>{
            if(result ===  undefined){
                //si no existe la tabla, la creo y la pueblo
                return this.createTable()
                .then(
                    (data)=>{
                        //console.log("en crea y puebla: ",data)
                        return Promise.all(mis_profesores.map((profesor)=>{
                            //const{num_emp, name, mail1, mail2, telefon}=profesor
                            return this.create(profesor)
                        }))
                    }
                )
            }
            else{
                //console.log("en crea y puebla , tabla existente")
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

export default ProfesorRepository