import AppDao from "./dao.cjs"
import ProfesorRepository from "./profesorRepository.js"
import MateriaRepository from "./materiaRepository.js"
import TemaRepository from "./temaRepository.js"
import PreguntaRepository from "./preguntaRepository.js"
import dotenv from 'dotenv'

dotenv.config() //cargar los datos del archivo .env en processs.env
const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME

export class MisFunciones{
    static crea_y_puebla(xRepo){
        return xRepo.crea_y_puebla()
        .then(()=>{
            console.log("tabla creada y poblada correctaente")
            return Promise.resolve("tabla creada ")
        })
        .catch((err)=>{
            console.log("Error en mis crear tabla : ")
            return Promise.reject(err)
        })
    }
    static inicializa_Repo(Repos){
        //crea las tablas recibidas en el arrgelo Repos
        return Promise.all(Repos.map((repo)=>{
            return MisFunciones.crea_y_puebla(repo)
        }))
        .then((result)=>{
            //para probar, muestra el primer datos de cada tabla
            return Promise.all(Repos.map((repo)=>{
                repo.getById(1)
                .then(data=>{
                    if(data===undefined)
                        console.log({})
                    else
                        console.log(data)
                    return Promise.resolve("ok")
                })
            }))
        })
        .catch(err=>{
            console.log("Error en inicializa ", err)
            return Promise.reject(err)
        })
    }
    static inicializa_DB(){
        const dao = new AppDao(SQLITE3_DB_NAME)
        //objetos
        const profeRepo=new ProfesorRepository(dao)
        const materiaRepo=new MateriaRepository(dao)
        const temaRepo = new TemaRepository(dao)
        const preguntaRepo = new PreguntaRepository(dao)
        return MisFunciones.inicializa_Repo([profeRepo,materiaRepo,temaRepo,preguntaRepo])
    }
}