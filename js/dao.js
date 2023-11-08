//aun no usada
class Dao{
    constructor(db_host='',db_name='',db_user='',db_pass='',dbFilePath=''){
        this.db_host=db_host
        this.db_name=db_name
        this.db_user=db_user
        this.db_pass=db_pass
        this.dbFilePath=dbFilePath
        this.dbOpen=false
        this.db=null
    }
    open(){
        throw new Error("open() debe ser implementado")
    }
    run(sql, params = []) {
        throw new Error("run() debe ser implementado")
    }
    get(sql, params = []) {
        throw new Error("get() debe ser implementado")
    }

    all(sql, params = []) {
        throw new Error("all() debe ser implementado")
    }
    close(){
        throw new Error("close() debe ser implementado")
    }
}

module.exports = Dao