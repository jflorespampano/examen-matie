import MiRepository from "./repositoryMateria.js"
import express from "express"
import getDao from "./factoryDao.js"

const miRouter=express()
const dao=getDao()

miRouter.use((req,res,next)=>{
    next()
})
//espera una url asi: http://localhost:3000/materia/1
//el '/materia' se maneja al cargar el middleware cuando se pone: app.use("/materia",materiaRouter)
miRouter.get("/:id",(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    dao.open()
    .then(()=>{
        return miRepo.getById(id)
    })
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
    const miRepo=new MiRepository(dao)
    dao.open()
    .then(()=>{
        return miRepo.getAll()
    })
    .then(data=>{
        if(data===undefined){
            data={}
        }
        // console.log(data)
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
//espera:http://localhost:3000/materia  con un body
miRouter.post('',(req,res)=>{
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {clave,nombre,objetivo,carrera}=req.body
    if(!clave || !nombre || !objetivo || !carrera){
        res.status(418).send('Faltan datos')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.create({clave,nombre,objetivo,carrera})
        })
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

//actualizar
miRouter.patch('/:id',(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {clave,nombre,objetivo,carrera}=req.body
    if(!clave || !nombre || !objetivo || !carrera){
        res.status(418).send('Faltan datos')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.update({id,clave,nombre,objetivo,carrera})
        })
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
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    dao.open()
    .then(()=>{
        return miRepo.delete(id)
    })
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