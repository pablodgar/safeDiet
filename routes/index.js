/* Controllers */
const patologiaController = require('../controllers/patologias');
const usuarioController = require('../controllers/usuarios');
const usuarios_patologiasController = require('../controllers/usuarios_patologias');

module.exports = (app) => {
   app.get('/api', (req, res) => res.status(200).send ({
        message: 'Example project did not give you access to the api web services',
   }));
   app.post('/api/patologias/create', patologiaController.create);
   app.get('/api/patologias/list', patologiaController.list);
   app.get('/api/patologias/findOne', patologiaController.findOne);
   app.delete('/api/patologias/deleteByIdPatologia', patologiaController.deleteByIdPatologia);
   app.delete('/api/patologias/deleteAll', patologiaController.deleteAll);

   app.post('/api/usuarios/create', usuarioController.create);
   app.get('/api/usuarios/list', usuarioController.list);
   app.get('/api/usuarios/findOne', usuarioController.findOne);
   app.delete('/api/usuarios/deleteByIdUsuario', usuarioController.deleteByIdUsuario);
   app.delete('/api/usuarios/deleteAll', usuarioController.deleteAll);

   app.post('/api/usuarios_patologias/create', usuarios_patologiasController.create);
   app.get('/api/usuarios_patologias/list', usuarios_patologiasController.list);
   app.get('/api/usuarios_patologias/findOne', usuarios_patologiasController.findOne);

};