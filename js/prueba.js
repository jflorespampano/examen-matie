import dotenv from 'dotenv'
import AppDao from "./dao.cjs"

dotenv.config() 
const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME
const dao = new AppDao(SQLITE3_DB_NAME)


function existe_tabla(){
    const sql=`SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_pregunta';`
    return dao.get(sql)
}

function crea_y_puebla(){
    return existe_tabla()
    .then(result=>{
        if(result ===  undefined){
            console.log("si no xiste la tabla se crea y se puebla")
            console.log(result)
        }
        else{
            console.log("en crea y puebla , tabla existente")
            console.log(result)
            return Promise.resolve("tabla existente")
        }
    })
    .catch((err)=>{
        return new Promise((_,reject)=>{
            reject("Error "+err)
        })
    })
}

crea_y_puebla()