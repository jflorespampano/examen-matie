import MiRepository from "./repositoryPregunta.js"
import  express from "express"
import getDao from "./factoryDao.js"

const miRouter=express()
const dao=getDao()

miRouter.use((req,res,next)=>{
    // console.log("en /pregunta/")
    next()
})
//espera una url asi: http://localhost:3000/pregunta/1
//el '/profesor' se maneja al cargar el middleware cuando se pone: app.use("/user",profesorRouter)
miRouter.get("/:id",(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    dao.open()
    .then((d)=>{
        // console.log(d)
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
        const resp=`
            {
                "error":"error desconocido al obtener un dato",
                "msg": "${err}"
            }
            `
            res.status(400).send(resp);
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
        const resp=`
            {
                "error":"error desconocido al recuperar los datos",
                "msg": "${err}"
            }
            `
            res.status(400).send(resp);
    })
    .finally(()=>{
        dao.close()
    })
})
    
//espera:http://localhost:3000/pregunta  con un body
miRouter.post('',(req,res)=>{
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {pregunta,d1,d2,d3,d4,correcta,fk_profesor,fk_materia,fk_tema,fe_crea,fe_mod,activo}=req.body
    if(!pregunta || !d1 || !d2 || !d3 || !d4 || !correcta || !fk_profesor || !fk_materia || !fe_crea || !fe_mod || !activo){
        res.status(418).send('Faltan datos')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.create({pregunta,d1,d2,d3,d4,correcta,fk_profesor,fk_materia,fk_tema,fe_crea,fe_mod,activo})
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

//actualizar el campo nombre
miRouter.patch('/:id',(req,res)=>{
    const {id}=req.params
    const miRepo=new MiRepository(dao)
    //console.log(req.body)
    const {pregunta,d1,d2,d3,d4,correcta,fk_profesor,fk_materia,fk_tema,fe_crea,fe_mod,activo}=req.body
    if(!pregunta || !d1 || !d2 || !d3 || !d4 || !correcta || !fk_profesor || !fk_materia || !fe_crea || !fe_mod || !activo){
        res.status(418).send('Faltan datos')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.update({id,pregunta,d1,d2,d3,d4,correcta,fk_profesor,fk_materia,fk_tema,fe_crea,fe_mod,activo})
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
            res.status(400).send(resp);
        })
        .finally(()=>{
            dao.close()
        })
    }
    
})
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
                "error":"error desconocido al eliminar un dato",
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