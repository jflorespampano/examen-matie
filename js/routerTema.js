import  express from "express"
import AppDao from "./dao.cjs"
import MiRepository from "./temaRepository.js"
import dotenv from 'dotenv'

dotenv.config() 
const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME

const miRouter=express()
// let dao = null
// let miRepo= null
miRouter.use((req,res,next)=>{
    console.log(req.ip)
    // dao = new AppDao(SQLITE3_DB_NAME)
    // miRepo=new MiRepository(dao)
    next()
})
//espera una url asi: http://localhost:3000/profesor/1
//el '/profesor' se maneja al cargar el middleware cuando se pone: app.use("/user",profesorRouter)
miRouter.get("/:id",(req,res)=>{
    //console.log(req.params)
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    const {id}=req.params
    miRepo.getById(id)
    .then(data=>{
        if(data===undefined){
            data={}
        }
        console.log(data)
        return Promise.resolve(data)
    })
    .then(registro=>{
        if(!registro){
            res.status(400).send("no existe el dato")
        }else{
            res.set({"content-type":"application/json; charset=utf-8"})
            //console.log(req.params)
            res.send(registro)
        }
    })
    .catch(err=>{
        res.status(400).send("error deconocido al obtener un dato ", err);
    })
    .finally(()=>{
        dao.close()
    })
})
//
miRouter.get("",(_,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    miRepo.getAll()
    .then(data=>{
        if(data===undefined){
            data={}
        }
        console.log(data)
        return Promise.resolve(data)
    })
    .then(data=>{
        if(!data) {
            res.status(400).send("sin datos")
        }else{
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        }
    })
    .catch(err=>{
        res.status(400).send("error desconocido al obtener todos los datos ", err);
    })
    .finally(()=>{
        dao.close()
    })
})
//espera:http://localhost:3000/profesor  con un body
miRouter.post('',(req,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {fk_materia,num_tema,nombre,objetivo}=req.body
    if(!fk_materia || !num_tema || !nombre || !objetivo){
        res.status(418).send('Faltan datos')
    }else{
        miRepo.create({fk_materia,num_tema,nombre,objetivo})
        .then(data=>{
            //console.log(data)
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        })
        .catch(err=>{
            res.status(400).send("error desconocido al insertar un dato", err);
        })
        .finally(()=>{
            dao.close()
        })
    }
})

//actualizar el campo nombre
miRouter.patch('/:id',(req,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    const {id}=req.params
    //console.log(req.body)
    const {fk_materia,num_tema,nombre,objetivo}=req.body
    if(!fk_materia || !num_tema || !nombre || !objetivo){
        res.status(418).send('Faltan datos')
    }else{
        miRepo.update({id,fk_materia,num_tema,nombre,objetivo})
        .then(data=>{
            console.log(data)
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        })
        .catch(err=>{
            res.status(400).send("error desconocido al insertar un dato", err)
        })
        .finally(()=>{
            dao.close()
        })
    }
    
})
miRouter.delete('/:id',(req,res)=>{
    //console.log(req.params)
    const dao = new AppDao(SQLITE3_DB_NAME)
    const miRepo=new MiRepository(dao)
    const {id}=req.params
    miRepo.delete(id)
    .then(data=>{
        res.set({"content-type":"application/json; charset=utf-8"})
        res.send(data)
    })
    .catch(err=>{
        res.status(400).send("error desconocido al eliminar un dato", err)
    })
    .finally(()=>{
        dao.close()
    })
})

export default miRouter