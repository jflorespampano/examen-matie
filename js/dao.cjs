const sqlite3 =require('sqlite3').verbose()

// const x=new sqlite3.Database("base1.sqlite")
// const db = new sqlite3.Database(':memory:');

class AppDao{
    constructor(dbFilePath){
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('No se pudo conectar a la database: ', err)
                this.open=false
            } else {
                console.log('Connectado a la database')
                this.open=true
            }
        })
    }
    open(){
        return new Promise((resolve, reject)=>{
            if(this.open){
                resolve(true)
            }else{
                reject("La base de datos no esta abierta")
            }
        })
    }
    run(sql, params = []) {
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
        this.db.close()
    }
}

module.exports = AppDao