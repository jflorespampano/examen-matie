//dao para sqlite
const sqlite3 =require('sqlite3').verbose()

class AppDao{
    constructor(dbFilePath){
        this.dbFilePath=dbFilePath
        this.dbOpen=false
        this.db=null
    }
    open(){
        return new Promise((resolve, reject)=>{
            this.db = new sqlite3.Database(this.dbFilePath, (err) => {
                if (err) {
                    console.log('No se pudo conectar a la database: ', err)
                    this.dbOpen=false
                    reject("La base de datos no se pudo abrir")

                } else {
                    console.log('Connectado a la database')
                    this.dbOpen=true
                    resolve(true)
                }
            })
        })
    }
    run(sql, params = []) {
        // console.log(sql,params)
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.log('Error corriendo  sql ' + sql)
                    console.log(err)
                    reject("en run ",err)
                } else {
                    //si el statemet se ejcuta satisfactoriamente
                    //el objeto this contiene 2 propiedades:
                    //lastID contiene el inidce del ultimo registro insertado.
                    //changes contiene el indice del ultimo renglon afectado por la consulta.
                    //console.log("en run ",{ id: this.lastID, changes: this.changes })
                    // console.log({ id: this.lastID, changes: this.changes })
                    resolve({ id: this.lastID, changes: this.changes })
                }
            })
        })
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, result) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    //console.log(`consulta ${sql} correcta `,result)
                    resolve(result)
                    //resolve({ id: this.lastID, changes: this.changes })
                }
            })
        })
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    close(){
        console.log("base de datos cerrada")
        if(this.dbOpen) this.db.close()
    }
}

module.exports = AppDao