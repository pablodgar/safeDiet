const Sequelize = require('sequelize');
const express = require('express');
let productos = require('../models').productos;
let bebidas = require('../models').bebidas;
let recetas = require('../models').recetas;

const sequelize = new Sequelize('recetas','root','admin', {
    host:'127.0.0.1',
    dialect:'mysql',
  });

 
module.exports = {
    getPlan(req,res){
        let aptoCeliaco = 0;
        let aptoDiabetico = 0
        let aptoObesidad = 0;
        

        if(req.query.aptoCeliaco != undefined){
            if(req.query.aptoCeliaco == '1'){
                aptoCeliaco = 1
            }
        }
    
        if(req.query.aptoDiabetico != undefined){
            if(req.query.aptoDiabetico == '1'){
                aptoDiabetico = 1
            }
        } 
    
        if(req.query.aptoObesidad != undefined){
            if(req.query.aptoObesidad == '1'){
                aptoObesidad = 1
            }
        }
    
        console.log(`Plan dietario params: aptoCeliaco: ${aptoCeliaco}; aptoDiabetico: ${aptoDiabetico}; aptoObesidad: ${aptoObesidad};`)
    
        let sqlRecetas = ""
        let sqlColaciones = ""
        let sqlBebidas = ""
    
        if(aptoCeliaco && aptoDiabetico){
            sqlRecetas = `SELECT * FROM recetas WHERE apto_celiaco=${aptoCeliaco} AND apto_diabetico=${aptoDiabetico}`
            sqlBebidas = `SELECT * FROM bebidas WHERE apto_celiaco=${aptoCeliaco} AND apto_diabetico=${aptoDiabetico}`
            sqlColaciones = `SELECT * FROM productos WHERE colacion= 1 AND apto_celiaco=${aptoCeliaco} AND apto_diabetico=${aptoDiabetico}`
        } else {
            if(aptoCeliaco){
                sqlRecetas = `SELECT * FROM recetas WHERE apto_celiaco=${aptoCeliaco}`
                sqlBebidas = `SELECT * FROM bebidas WHERE apto_celiaco=${aptoCeliaco}`
                sqlColaciones = `SELECT * FROM productos WHERE apto_celiaco=${aptoCeliaco} AND colacion= 1`
            } else{
                if(aptoDiabetico){
                    sqlRecetas = `SELECT * FROM recetas WHERE apto_diabetico=${aptoDiabetico}`
                    sqlBebidas = `SELECT * FROM bebidas WHERE apto_diabetico=${aptoDiabetico}`
                    sqlColaciones = `SELECT * FROM productos WHERE apto_diabetico=${aptoDiabetico} AND colacion= 1`
                } else {
                    if(aptoObesidad){
                        sqlRecetas = `SELECT * FROM recetas`
                        sqlBebidas = `SELECT * FROM bebidas`
                        sqlColaciones = `SELECT * FROM productos WHERE colacion= 1`
                    }
                }
            }
        } 
        
        let bebidasDesayunoMeriendas = [];
        let bebidasAlmuerzoCenas = [];
        let colaciones = [];
 
if(sqlBebidas != "" && sqlColaciones != "" && sqlRecetas != ""){

    bebidas = sequelize.query(sqlBebidas, { type: sequelize.QueryTypes.SELECT}).then(function(bebidas){
 //       console.log("bebidas:",bebidas)

        if(bebidas != undefined && bebidas.length > 0){
            bebidasDesayunoMeriendas = bebidas.filter((e) => e.tipo === "Desayuno/Merienda")
            bebidasAlmuerzoCenas = bebidas.filter((e) => e.tipo === "Almuerzo/Cena")
            productos = sequelize.query(sqlColaciones, { type: sequelize.QueryTypes.SELECT}).then(function(productos){
            colaciones = productos
//            console.log("colaciones",colaciones)

                   recetas = sequelize.query(sqlRecetas, { type: sequelize.QueryTypes.SELECT}).then(function(recetas){
                    const maxKcalDiarios = 2000
                    const maxHcDiarios = 200
                    const maxHcComida = 33

                    const maxKcalDesayuno = 400
                    const maxKcalColacion = 200
                    const maxKcalAlmuerzo = 600
                    //DESCOMENTAR CUANDO HAYA MAS OPCIONES DE MERIENDAS CON MENOS DE 200K o SUBIR a 2500KCAL
                    // const maxKcalMerienda = 200
                    const maxKcalMerienda = 300
                    const maxKcalCena = 600
            
                    //TODO: 
                    //Ver opciones de postre.
                    //En caso de resto, sumar una porción más de almuerzo/cena
                    
                    if(recetas != undefined && recetas.length > 0){
                        let desayunosMeriendas = recetas.filter((e) => e.tipo === 'Desayuno/Merienda')
                        let almuerzosCenas = recetas.filter((e) => e.tipo === 'Almuerzo/Cena')
                         //Desayuno (Celiaco: Max 250kcal c/u)
                            let desayuno = {
                            id:0,
                            type:"Desayuno",
                            maxKcal: maxKcalDesayuno,
                            kcal: 0,
                            hc: 0,
                            receta:{
                                descripcion:"",
                                cantidades:0,
                                url_imagen:""
                            },
                            bebida:{
                                descripcion:"",
                                cantidades:1
                            },
                        }


                //Estrategia en las comidas:
                // Primero se elige una receta.
                // Luego una bebida
                // Si queda resto de calorias, se elige otra porción de la misma receta
                let desayunoIdx = -1
                while(desayuno.kcal === 0 && desayunosMeriendas.length > 0){
                    desayunoIdx = Math.floor(Math.random()*desayunosMeriendas.length)
                    let desayunoElegido = desayunosMeriendas[desayunoIdx]

                    let kcalPorCantidad = (desayunoElegido.total_kcal / desayunoElegido.rendimiento)
                    let hcPorCantidad = (desayunoElegido.total_hc / desayunoElegido.rendimiento)
    
                    if(kcalPorCantidad < maxKcalDesayuno){
                        let elegirComida = false
                        if(aptoDiabetico){
                            if(hcPorCantidad < maxHcComida){
                                elegirComida = true
                            }
                        } else {
                            elegirComida = true
                        }
    
                        if(elegirComida){
                            desayuno.receta.descripcion = desayunoElegido.descripcion
                            desayuno.kcal += kcalPorCantidad
                            desayuno.receta.cantidades++
                            desayuno.receta.url_imagen = desayunoElegido.url_imagen
                            desayuno.hc += (desayunoElegido.total_hc / desayunoElegido.rendimiento)
            
                            let bebidaIdx = Math.floor(Math.random()*bebidasDesayunoMeriendas.length)
                            let bebida = bebidasDesayunoMeriendas[bebidaIdx]
                            desayuno.bebida.descripcion = bebida.descripcion
                            desayuno.kcal += bebida.kcal
    
                            let elegirOtraPorcion = false
                            if((desayuno.kcal + kcalPorCantidad) < maxKcalDesayuno){
                                if(aptoDiabetico){
                                    if(desayuno.hc + hcPorCantidad < maxHcComida){
                                        elegirOtraPorcion = true
                                    }                                
                                } else {
                                    elegirOtraPorcion = true
                                }
                            }
            
                            while(elegirOtraPorcion){
                                elegirOtraPorcion = false
                                desayuno.kcal += kcalPorCantidad
                                desayuno.hc += hcPorCantidad
                                desayuno.receta.cantidades++
    
                                if((desayuno.kcal + kcalPorCantidad) < maxKcalDesayuno){
                                    if(aptoDiabetico){
                                        if(desayuno.hc + hcPorCantidad < maxHcComida){
                                            elegirOtraPorcion = true
                                        }                                
                                    } else{
                                        elegirOtraPorcion = true
                                    }
                                }
                            }
                        }
                    }
                }
                desayunosMeriendas.splice(desayunoIdx,1)
//                console.log("desayunosMeriendas1:",desayunosMeriendas)

                //Colación
                let colacion = {
                id:1,
                type:"Colación",
                kcal:0,
                hc: 0,
                maxKcal: maxKcalColacion,
                receta:{
                descripcion:"",
                cantidades:0,
                },
                bebida:{
                descripcion:"",
                cantidades: 1
                  }
            }

            let colacionIdx = -1
                while(colacion.kcal === 0){
                    colacionIdx = Math.floor(Math.random()*colaciones.length)
                    let colacionElegido = colaciones[colacionIdx]
                    kcalPorCantidad = colacionElegido.kcal * colacionElegido.gr_unidad_media /100
    
                    if(kcalPorCantidad < maxKcalColacion){
                        let elegirComida = false
                        if(aptoDiabetico){
                            if(colacionElegido.hc < maxHcComida){
                                elegirComida = true
                            }
                        } else {
                            elegirComida = true
                        }
                        if(elegirComida){
                            colacion.receta.descripcion = colacionElegido.descripcion;
                            colacion.kcal += kcalPorCantidad
                            colacion.receta.url_imagen = colacionElegido.url_imagen
                            colacion.receta.cantidades++
                            colacion.hc += (colacionElegido.hc * colacionElegido.gr_unidad_media /100)
            
                            let bebidaIdx = Math.floor(Math.random()*bebidasDesayunoMeriendas.length)
                            let bebida = bebidasDesayunoMeriendas[bebidaIdx]
                            colacion.bebida.descripcion = bebida.descripcion
                            colacion.kcal += bebida.kcal
    
                            let elegirOtraPorcion = false
                            if((colacion.kcal + kcalPorCantidad) < maxKcalColacion){
                                if(aptoDiabetico){
                                    if(colacion.hc + colacionElegido.hc < maxHcComida){
                                        elegirOtraPorcion = true
                                    }                                
                                }
                            }
            
                            while(elegirOtraPorcion){
                                elegirOtraPorcion = false
                                colacion.kcal += kcalPorCantidad
                                if(aptoDiabetico){
                                    colacion.hc += (colacionElegido.hc * colacionElegido.gr_unidad_media /100)
                                }
                                colacion.receta.cantidades++
    
                                if((colacion.kcal + kcalPorCantidad) < maxKcalColacion){
                                    if(aptoDiabetico){
                                        if(colacion.hc + colacionElegido.hc < maxHcComida){
                                            elegirOtraPorcion = true
                                        }                                
                                    } else {
                                        elegirOtraPorcion = true
                                    }
                                }
                            }
                        }
                    }
                }

                //Almuerzo
                let almuerzo = {
                    id:1,
                    type:"Almuerzo",
                    kcal:0,
                    hc: 0,
                    maxKcal: maxKcalAlmuerzo,
                    receta:{
                        descripcion:"",
                        cantidades:0,
                        url_imagen:""
                    },
                    bebida:{
                        descripcion:"",
                        cantidades: 1
                    }
                }


                let almuerzoIdx = -1
                while(almuerzo.kcal === 0){
                    almuerzoIdx = Math.floor(Math.random()*almuerzosCenas.length)
                    let almuerzoElegido = almuerzosCenas[almuerzoIdx]
                    kcalPorCantidad = (almuerzoElegido.total_kcal / almuerzoElegido.rendimiento)
                    let hcPorCantidad = (almuerzoElegido.total_hc / almuerzoElegido.rendimiento)
    
                    if(kcalPorCantidad < maxKcalAlmuerzo){
                        let elegirComida = false
                        if(aptoDiabetico){
                            let hcPorCantidad = (almuerzoElegido.total_hc / almuerzoElegido.rendimiento)
                            if(hcPorCantidad < maxHcComida){
                                elegirComida = true
                            }
                        } else {
                            elegirComida = true
                        }
    
                        if(elegirComida){
                            almuerzo.receta.descripcion = almuerzoElegido.descripcion;
                            almuerzo.kcal += kcalPorCantidad
                            almuerzo.receta.cantidades++
                            almuerzo.receta.url_imagen = almuerzoElegido.url_imagen
                            almuerzo.hc += (almuerzoElegido.total_hc / almuerzoElegido.rendimiento)
            
                            let bebidaIdx = Math.floor(Math.random()*bebidasAlmuerzoCenas.length)
                            let bebida = bebidasAlmuerzoCenas[bebidaIdx]
                            almuerzo.bebida.descripcion = bebida.descripcion
                            almuerzo.kcal += bebida.kcal
    
                            let elegirOtraPorcion = false
                            if((almuerzo.kcal + kcalPorCantidad) < maxKcalAlmuerzo){
                                if(aptoDiabetico){
                                    if(almuerzo.hc + hcPorCantidad < maxHcComida){
                                        elegirOtraPorcion = true
                                    }                                
                                } else{
                                    elegirOtraPorcion = true
                                }
                            }
            
                            while(elegirOtraPorcion){
                                elegirOtraPorcion = false
                                almuerzo.kcal += kcalPorCantidad
                                almuerzo.hc += (almuerzoElegido.total_hc / almuerzoElegido.rendimiento)
                                almuerzo.receta.cantidades++
    
                                if((almuerzo.kcal + kcalPorCantidad) < maxKcalAlmuerzo){
                                    if(aptoDiabetico){
                                        if(almuerzo.hc + hcPorCantidad < maxHcComida){
                                            elegirOtraPorcion = true
                                        }                                
                                    } else {
                                        elegirOtraPorcion = true
                                    }
                                }
                            }
                        }
                    }
                }
                almuerzosCenas.splice(almuerzoIdx,1)
//                console.log("almuerzosCenas:",almuerzosCenas)

                //Merienda
                let merienda = {
                    id:2,
                    type:"Merienda",
                    kcal:0,
                    hc: 0,
                    maxKcal: maxKcalMerienda,
                    receta:{
                        descripcion:"",
                        cantidades:0,
                        url_imagen:""
                    },
                    bebida:{
                        descripcion:"",
                        cantidades:1
                    }
                }                

                let meriendaIdx = -1;
                while(merienda.kcal === 0 ){
                    meriendaIdx = Math.floor(Math.random()*desayunosMeriendas.length)
                    let meriendaElegida = desayunosMeriendas[meriendaIdx]
                    let kcalPorCantidad = (meriendaElegida.total_kcal / meriendaElegida.rendimiento)
                    let hcPorCantidad = (meriendaElegida.total_hc / meriendaElegida.rendimiento)
                  
                    if(kcalPorCantidad < maxKcalMerienda){
                        let elegirComida = false
                        if(aptoDiabetico){
                            let hcPorCantidad = (meriendaElegida.total_hc / meriendaElegida.rendimiento)
                            if(hcPorCantidad < maxHcComida){
                                elegirComida = true
                            }
                        } else {
                            elegirComida = true
                        }
    
                        if(elegirComida){

                            merienda.receta.descripcion = meriendaElegida.descripcion;
                            merienda.kcal += kcalPorCantidad
                            merienda.receta.cantidades++
                            merienda.receta.url_imagen = meriendaElegida.url_imagen
                            merienda.hc += (meriendaElegida.total_hc / meriendaElegida.rendimiento)
            
                            let bebidaIdx = Math.floor(Math.random()*bebidasDesayunoMeriendas.length)
                            let bebida = bebidasDesayunoMeriendas[bebidaIdx]
                            merienda.bebida.descripcion = bebida.descripcion
                            merienda.kcal += bebida.kcal
    
                            let elegirOtraPorcion = false
                            if((almuerzo.kcal + kcalPorCantidad) < maxKcalMerienda){
                                if(aptoDiabetico){
                                    if(almuerzo.hc + hcPorCantidad < maxHcComida){
                                        elegirOtraPorcion = true
                                    }                                
                                }
                            }
            
                            while(elegirOtraPorcion){
                                elegirOtraPorcion = false
                                merienda.kcal += kcalPorCantidad
                                merienda.hc += (meriendaElegida.total_hc / meriendaElegida.rendimiento)
                                merienda.receta.cantidades++
    
                                if((almuerzo.kcal + kcalPorCantidad) < maxKcalMerienda){
                                    if(aptoDiabetico){
                                        if(almuerzo.hc + hcPorCantidad < maxHcComida){
                                            elegirOtraPorcion = true
                                        }                                
                                    } else {
                                        elegirOtraPorcion = true
                                    }
                                }
                            }
                        }
                    }
                }
                desayunosMeriendas.splice(meriendaIdx,1)

                if (desayunosMeriendas.length ==0 ) {
                    res.json({
                                    msg: 'Plan dietario',
                                    plan : [],  
                                })
                                //res.status(200).send(plan);
                                              
                   }
        if (desayunosMeriendas.length > 0 ) {

                //Cena
                let cena = {
                    id:3,
                    type:"Cena",
                    kcal:0,
                    hc: 0,
                    maxKcal:maxKcalCena,
                    receta:{
                        descripcion:"",
                        cantidades:0,
                        url_imagen:""
                    },
                    bebida:{
                        descripcion:"",
                        cantidades:1
                    }
                }
                let cenaIdx = -1
                while(cena.kcal === 0){
                    cenaIdx = Math.floor(Math.random()*almuerzosCenas.length)
                    let cenaElegida = almuerzosCenas[cenaIdx]
                    kcalPorCantidad = (cenaElegida.total_kcal / cenaElegida.rendimiento)
                    let hcPorCantidad = (cenaElegida.total_hc / cenaElegida.rendimiento)
    
                    if(kcalPorCantidad < maxKcalCena){
                        let elegirComida = false
                        if(aptoDiabetico){
                            let hcPorCantidad = (cenaElegida.total_hc / cenaElegida.rendimiento)
                            if(hcPorCantidad < maxHcComida){
                                elegirComida = true
                            }
                        } else {
                            elegirComida = true
                        }
    
                        if(elegirComida){
                            cena.receta.descripcion = cenaElegida.descripcion;
                            cena.kcal += kcalPorCantidad
                            cena.receta.cantidades++
                            cena.receta.url_imagen = cenaElegida.url_imagen
                            cena.hc += (cenaElegida.total_hc / cenaElegida.rendimiento)
            
                            let bebidaIdx = Math.floor(Math.random()*bebidasAlmuerzoCenas.length)
                            let bebida = bebidasAlmuerzoCenas[bebidaIdx]
                            cena.bebida.descripcion = bebida.descripcion
                            cena.kcal += bebida.kcal
    
                            let elegirOtraPorcion = false
                            if((cena.kcal + kcalPorCantidad) < maxKcalCena){
                                if(aptoDiabetico){
                                    if(cena.hc + hcPorCantidad < maxHcComida){
                                        elegirOtraPorcion = true
                                    }                                
                                } else {
                                    elegirOtraPorcion = true
                                }
                            }
            
                            while(elegirOtraPorcion){
                                elegirOtraPorcion = false
                                cena.kcal += kcalPorCantidad
                                cena.hc += (cenaElegida.total_hc / cenaElegida.rendimiento)
                                cena.receta.cantidades++
    
                                if((cena.kcal + kcalPorCantidad) < maxKcalCena){
                                    if(aptoDiabetico){
                                        if(cena.hc + hcPorCantidad < maxHcComida){
                                            elegirOtraPorcion = true
                                        }                                
                                    } else {
                                        elegirOtraPorcion = true
                                    }
                                }
                            }
                        }
                    }
                    
                }
                almuerzosCenas.splice(cenaIdx,1)
                 plan = [
                    desayuno,
                    colacion,
                    almuerzo,
                    merienda,
                    cena
                ]
                    //Para la respuesta
                    res.json({
                        msg: 'Plan dietario',
                        plan : plan,   
                    })

                    } // fin if hay recetas
            }//del if desayunosMeriendas.length > 0       
    })   //fin select recetas segun criterio
                                     
            }) 

        }else {
            res.json({
             msg: 'Plan dietario',
             plan : [],  
         })
     }
   
    })

  }
}
    };