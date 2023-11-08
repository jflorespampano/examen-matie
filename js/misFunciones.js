import ProfesorRepository from "./repositoryPofesor.js"
import MateriaRepository from "./repositoryMateria.js"
import TemaRepository from "./repositoryTema.js"
import PreguntaRepository from "./repositoryPregunta.js"
import getDao from "./factoryDao.js"

const dao=getDao()

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
        dao.open()
        .then(()=>{
            return Promise.all(Repos.map((repo)=>{
                return MisFunciones.crea_y_puebla(repo)
            }))
        })
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
        .finally(()=>{
            dao.close()
        })
    }
    static inicializa_DB(){
        //objetos
        const profeRepo=new ProfesorRepository(dao)
        const materiaRepo=new MateriaRepository(dao)
        const temaRepo = new TemaRepository(dao)
        const preguntaRepo = new PreguntaRepository(dao)
        return MisFunciones.inicializa_Repo([profeRepo,materiaRepo,temaRepo,preguntaRepo])
    }
}