import  express from "express"
import AppDao from "./dao.cjs"
import ProfesorRepository from "./profesorRepository.js"
import dotenv from 'dotenv'

dotenv.config() //cargar los datos del archivo .env en processs.env
const SQLITE3_DB_NAME=process.env.SQLITE3_DB_NAME

const userRouter=express()
let dao = null
let profeRepo= null
userRouter.use((req,res,next)=>{
    console.log(req.ip)
    dao = new AppDao(SQLITE3_DB_NAME)
    profeRepo=new ProfesorRepository(dao)
    next()
})
//espera una url asi: http://localhost:3000/profesor/1
//el '/profesor' se maneja al cargar el middleware cuando se pone: app.use("/user",profesorRouter)
userRouter.get("/:id",(req,res)=>{
    //console.log(req.params)
    const {id}=req.params
    profeRepo.getById(id)
    .then(data=>{
        if(data===undefined){
            data={}
        }
        console.log(data)
        return Promise.resolve(data)
    })
    .then(profe=>{
        if(!profe){
            res.status(400).send("no existe el dato")
        }else{
            res.set({"content-type":"application/json; charset=utf-8"})
            //console.log(req.params)
            res.send(profe)
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
userRouter.get("",(req,res)=>{
    profeRepo.getAll()
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
userRouter.post('',(req,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const profeRepo=new ProfesorRepository(dao)
    //console.log(req.body)
    const {num_emp,name,mail1,mail2,telefon}=req.body
    if(!num_emp || !name || !mail1 || !mail2 || !telefon){
        res.status(418).send('Faltan datos')
    }else{
        profeRepo.create({num_emp,name,mail1,mail2,telefon})
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
userRouter.patch('/:id',(req,res)=>{
    const dao = new AppDao(SQLITE3_DB_NAME)
    const profeRepo=new ProfesorRepository(dao)
    const {id}=req.params
    //console.log(req.body)
    const {num_emp,name,mail1,mail2,telefon}=req.body
    if(!num_emp || !name || !mail1 || !mail2 || !telefon){
        res.status(418).send('Faltan datos')
    }else{
        profeRepo.update({id,num_emp,name,mail1,mail2,telefon})
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
userRouter.delete('/:id',(req,res)=>{
    //console.log(req.params)
    const dao = new AppDao(SQLITE3_DB_NAME)
    const profeRepo=new ProfesorRepository(dao)
    const {id}=req.params
    profeRepo.delete(id)
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

export default userRouter