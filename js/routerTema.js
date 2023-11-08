import MiRepository from "./repositoryTema.js"
import express from "express"
import getDao from "./factoryDao.js"

const miRouter=express()
const dao=getDao()

miRouter.use((req,res,next)=>{
    // console.log(req.ip)
    next()
})
//espera una url asi: http://localhost:3000/tema/1
//el '/tema' se maneja al cargar el middleware cuando se pone: app.use("/tema",profesorRouter)
miRouter.get("/:id",(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    dao.open()
    .then((d)=>{
        console.log(d)
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
            const resp=`
            {
                "error":"el dato no existe",
                "msg": ""
            }
            `
            res.status(400).send(resp);
        }else{
            res.set({"content-type":"application/json; charset=utf-8"})
            //console.log(req.params)
            res.send(registro)
        }
    })
    .catch(err=>{
        const resp=`
        {
            "error":"error al obtener un dato",
            "msg": "${err}"
        }
        `
        res.status(400).send(resp);
    })
    .finally(()=>{
        dao.close()
    })
})

//espera una url asi: http://localhost:3000/tema
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
        //console.log(data)
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
        const resp=`
        {
            "error":"error al obtener los datos",
            "msg": "${err}"
        }
        `
        res.status(400).send(resp);
    })
    .finally(()=>{
        dao.close()
    })
})
//espera:http://localhost:3000/tema  con un body
miRouter.post('',(req,res)=>{
    const miRepo=new MiRepository(dao)
    // console.log(req.body)
    const {fk_materia,num_tema,nombre,objetivo}=req.body
    if(!fk_materia || !num_tema || !nombre || !objetivo){
        res.status(418).send('Faltan datos')
    }else{
        console.log("antes de arir")
        dao.open()
        .then(()=>{
            console.log("abrierta .....")
            return miRepo.create({fk_materia,num_tema,nombre,objetivo})
        })
        .then(data=>{
            //console.log(data)
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        })
        .catch(err=>{
            const resp=`
            {
                "error":"error desconocido al insertar un dato",
                "msg": "${err}"
            }
            `
            res.status(400).send(resp);
        })
        .finally(()=>{
            dao.close()
        })
    }
})

//espera una url asi: http://localhost:3000/tema/1 con un body
miRouter.patch('/:id',(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {fk_materia,num_tema,nombre,objetivo}=req.body
    if(!fk_materia || !num_tema || !nombre || !objetivo){
        res.status(418).send('<p>Faltan datos (fkmateria/numtema/nombre/objetivo)</p>')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.update({id,fk_materia,num_tema,nombre,objetivo})
        })
        .then(data=>{
            console.log(data)
            res.set({"content-type":"application/json; charset=utf-8"})
            res.send(data)
        })
        .catch(err=>{
            const resp=`
            {
                "error":"error desconocido al actualizar un dato",
                "msg": "${err}"
            }
            `
            res.status(400).send(resp)
        })
        .finally(()=>{
            dao.close()
        })
    }
    
})

//espera una url asi: http://localhost:3000/tema/1
miRouter.delete('/:id',(req,res)=>{
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
        const resp=`
        {
            "error":"error al eliminar un dato",
            "msg": "${err}"
        }
        `
        res.status(400).send(resp);
    })
    .finally(()=>{
        dao.close()
    })
})

export default miRouter