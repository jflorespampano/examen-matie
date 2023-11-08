import MiRepository from "./repositoryPofesor.js"
import  express from "express"
import getDao from "./factoryDao.js"

const miRouter=express()
const dao=getDao()

miRouter.use((req,res,next)=>{
    // console.log(req.ip)
    next()
})

//espera una url asi: http://localhost:3000/profesor/1
//el '/profesor' se maneja al cargar el middleware cuando se pone: app.use("/user",profesorRouter)
miRouter.get("/:id",(req,res)=>{
    //console.log(req.params)
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
miRouter.get("",(req,res)=>{
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
        res.status(400).send("error desconocido al obtener todos los datos ", err);
    })
    .finally(()=>{
        dao.close()
    })
})
//espera:http://localhost:3000/profesor  con un body
miRouter.post('',(req,res)=>{
    const miRepo=new MiRepository(dao)
    const {num_emp,name,mail1,mail2,telefon}=req.body
    if(!num_emp || !name || !mail1 || !mail2 || !telefon){
        res.status(418).send('Faltan datos')
    }else{
        dao.open()
        .then(()=>{
            console.log("abrierta .....")
            return miRepo.create({num_emp,name,mail1,mail2,telefon})
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
    const {num_emp,name,mail1,mail2,telefon}=req.body
    if(!num_emp || !name || !mail1 || !mail2 || !telefon){
        res.status(418).send('<p>Faltan datos (num_emp/name/mail1/mil2/telefon)</p>')
    }else{
        dao.open()
        .then(()=>{
            return miRepo.update({num_emp,name,mail1,mail2,telefon,id})
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
        res.status(400).send("error desconocido al eliminar un dato", err)
    })
    .finally(()=>{
        dao.close()
    })
})

export default miRouter