const Sequelize  = require('sequelize');
const Op  = Sequelize.Op;
const usuarios_patologias = require('../models').usuarios_patologias;
const usuarios   = require('../models').usuarios;
const patologias = require('../models').patologias;

module.exports = {
    
    create(req, res) {
        // Usuarios
        const responseUsuario = usuarios.findOne({
             where: {
                 [Op.or]: [{
                      id_usuario: req.body.usuario,
                 },{
                    id_usuario: req.body.usuario,
                 }]
             }
        });
        // patologias
        const responsePatologia = patologias.findOne({
             where: {
                 [Op.or]: [{
                      id_patologia: req.body.patologia,
                 },{
                    id_patologia: req.body.patologia,
                 }]
             }
        });
        const req1 = req.body.status
        Promise
        .all ([responseUsuario, responsePatologia])
        .then(responses => {
             return usuarios_patologias
                 .findOrCreate ({
                    where: {
                      id_usuario: responses[0].id_usuario,
                      id_patologia: responses[1].id_patologia, 
                    } 
                 })
                 .then(usuarios_patologias => res.status(200).send(usuarios_patologias))
         })
         .catch(err => {
            res.status(400).send({
              message: "Could not create Usuario_Patologias   Error: "+ err
            });
          });
   },


   list(_, res) {
    return usuarios_patologias.findAll({
          include: [{
               model: usuarios,
               as: 'usuarios',
          },{
               model: patologias,
               as: 'patologias',
          }]
    })
    .then(usuarios_patologias => res.status(200).send(usuarios_patologias))
    .catch(err => {
        res.status(400).send({
          message: "Could not List usuarios_patologias   Error: "+ err
        });
      });
 },


// Este metodo retorna solo los ids relacionados
//     findOne (req, res) {
//        const id = req.body.id;
//        return usuarios_patologias.findByPk(id)
//          .then(data => {
//            if (data) {
//              res.send(data);
//            } else {
//              res.status(404).send({
//                message: `Cannot find usuarios_patologias with id=${id}.`
//              });
//            }
//          })
//          .catch(err => {
//            res.status(500).send({
//              message: "Error retrieving usuarios_patologias with id=" + id
//            });
//          });
//      },

//Este metodo retorna todos los atributos de los objetos
  findOne (req, res) {
        return usuarios_patologias.findAll({
             where: {
                   id: req.body.id,
             },
             include: [{
              model: usuarios,
              as: 'usuarios',
         },{
              model: patologias,
              as: 'patologias',
         }]
        })
        .then(usuarios_patologias => res.status(200).send(usuarios_patologias))
        .catch(err => {
          res.status(400).send({
            message: "Could not findOne usuarios_patologias   Error: "+ err
          });
        });
     },

     deleteByIdUsuario_IdPatologia (req,res) {    
          const id_patologia =req.body.id_patologia;
          const id_usuario =req.body.id_usuario;
          return usuarios_patologias.destroy({
            where: { id_patologia: id_patologia, id_usuario: id_usuario }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Usuarios_Patologias was deleted successfully!"
                });
              } else {
                res.send({
                  message: `Cannot delete Usuarios_Patologias with id_patologia=${id_patologia} and id_usuario=${id_usuario} . Maybe Usuarios_Patologias was not found!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not delete Usuarios_Patologias with id_patologia=" + id_patologia +" and id_usuario=" + id_usuario +"  Error:"+ err
              });
            });
  },


};