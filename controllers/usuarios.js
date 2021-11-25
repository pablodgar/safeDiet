const config = require("../config/config");
const Sequelize     = require('sequelize');
const usuarios       = require('../models').usuarios;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


module.exports = {
    create(req, res) {
       return usuarios
           .findOrCreate ({
            where: {
                email: req.body.email,
                //password: req.body.password,
                password: bcrypt.hashSync(req.body.password, 8),
                apellido: req.body.apellido,
                nombre: req.body.nombre
            },
                email: req.body.email,
                //password:  req.body.password,
                password: bcrypt.hashSync(req.body.password, 8),
                apellido:  req.body.apellido,
                nombre:  req.body.nombre
           })
           .then(usuarios => res.status(200).send(usuarios))
           .catch(err => {
            res.status(400).send({
              message: "Could not create Usuario   Error: "+ err
            });
          });
    },

   
    signin(req, res) {
      usuarios.findOne({
        where: {
          email: req.body.email
        }
      })
        .then(usuarios => {
          if (!usuarios) {
            return res.status(404).send({ message: "Usuario Not found." });
          }
    
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            usuarios.password
          );
    
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
    
          let token = jwt.sign({ id: usuarios.id }, config.auth.secret, {
            expiresIn: 86400 // 24 hours
          });
            res.status(200).send({
              idUsuario: usuarios.id_usuario,
              nombre: usuarios.nombre,
              email: usuarios.email,
              accessToken: token
          });
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        })
      },



    list(_, res) {
        return usuarios.findAll({})
           .then(usuarios => res.status(200).send(usuarios))
           .catch(error => res.status(400).send(error))
    },


 //     findOne (req, res) {
 //       return usuarios.findAll({
 //           where: {
 //               apellido: req.body.apellido,
 //           }
 //       })
 //       .then(usuarios => res.status(200).send(usuarios))
 //       .catch(error => res.status(400).send(error))
 //    },

 
      findOne (req, res) {
        const id = req.body.id_usuario;
        return usuarios.findByPk(id)
          .then(data => {
            if (data) {
              res.send(data);
            } else {
              res.status(404).send({
                message: `Cannot find Usuario with id=${id}.`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error retrieving Usuario with id=" + id
            });
          });
      },

     
     deleteByIdUsuario (req,res) {    
            const id =req.body.id_usuario;
            return usuarios.destroy({
              where: { id_usuario: id }
            })
              .then(num => {
                if (num == 1) {
                  res.send({
                    message: "Usuario was deleted successfully!"
                  });
                } else {
                  res.send({
                    message: `Cannot delete Usuario with id=${id}. Maybe Usuario was not found!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Could not delete Usuario with id=" + id +"  Error:"+ err
                });
              });
    },
     
    deleteAll (_, res) {
        return usuarios.destroy({
          where: {},
          truncate: false
        })
          .then(nums => {
            res.send({ message: `${nums} Usuarios were deleted successfully!` });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while removing all Usuarios."
            });
          });
      },


      logout(req, res){
        const authHeader = req.headers["authorization"];
        jwt.sign(authHeader, "", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
            res.send({msg : 'You have been Logged Out' });
        } else {
            res.send({msg:'Error'});
          }
        })
      },

   };