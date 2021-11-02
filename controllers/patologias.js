const Sequelize     = require('sequelize');
const patologias       = require('../models').patologias;

module.exports = {
    create(req, res) {
       return patologias
           .findOrCreate ({
            where: {
                descripcion: req.query.descripcion
            },
            descripcion: req.query.descripcion
           })
           .then(patologias => res.status(200).send(patologias))
           .catch(error => res.status(400).send(error))
    },

    list(_, res) {
        return patologias.findAll({})
           .then(patologias => res.status(200).send(patologias))
           .catch(error => res.status(400).send(error))
    },


 //     findOne (req, res) {
 //       return patologias.findAll({
 //           where: {
 //               descripcion: req.body.descripcion,
 //           }
 //       })
 //       .then(patologias => res.status(200).send(patologias))
 //       .catch(error => res.status(400).send(error))
 //    },

 
      findOne (req, res) {
        const id = req.body.id_patologia;
        return patologias.findByPk(id)
          .then(data => {
            if (data) {
              res.send(data);
            } else {
              res.status(404).send({
                message: `Cannot find Patologia with id=${id}.`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error retrieving Patologia with id=" + id +"  Error:"+ err
            });
          });
      },

     
     deleteByIdPatologia (req,res) {    
            const id =req.body.id_patologia;
            return patologias.destroy({
              where: { id_patologia: id }
            })
              .then(num => {
                if (num == 1) {
                  res.send({
                    message: "Patologia was deleted successfully!"
                  });
                } else {
                  res.send({
                    message: `Cannot delete Patologia with id=${id}. Maybe Patologia was not found!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Could not delete Patologia with id=" + id +"  Error:"+ err
                });
              });
    },
     
    deleteAll (_, res) {
        return patologias.destroy({
          where: {},
          truncate: false
        })
          .then(nums => {
            res.send({ message: `${nums} Patologias were deleted successfully!` });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while removing all Patologias."
            });
          });
      },

   };