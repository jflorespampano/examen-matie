import AppDao from "./daoSqlite.cjs"
// import AppDaoMysql from "./daoMysql.cjs"
import dotenv from 'dotenv'

dotenv.config()
const DB_PLATFORM=process.env.DB_PLATFORM

//patron factory para devolver el dbms adecuado:
function getDAO(){
    if(DB_PLATFORM === "sqlite"){
        //crear obejto de sqlite
        console.log("ES Sqlite")
        //no usados en sqlite
        // const MYSQL_HOST=""
        // const MYSQL_DB_NAME=""
        // const MYSQL_USER=""
        // const MYSQL_PASSWORD=""
        //
        const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME
        return new AppDao(SQLITE3_DB_NAME)
    }else if(DB_PLATFORM === "mysql"){
        //crear objeto de mysql
        console.log("es Mysql")
        // const MYSQL_HOST=process.env.MYSQL_HOST
        // const MYSQL_DB_NAME=process.env.MYSQL_DB_NAME
        // const MYSQL_USER=process.env.MYSQL_USER
        // const MYSQL_PASSWORD=process.env.MYSQL_PASSWORD
        // return new AppDaoMysql(DB_HOST,DB_NAME,DB_USER,DB_PASS)
        return null
    }
}
export default getDAO