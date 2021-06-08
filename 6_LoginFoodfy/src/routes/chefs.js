const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const controllerChefs = require('../app/controllers/chefs')

routes.get("/", controllerChefs.index)
routes.get("/criar", controllerChefs.create)
routes.get("/:index", controllerChefs.show)
routes.get("/:index/editar", controllerChefs.edit)

routes.post("/", multer.single('photo'), controllerChefs.post)
routes.put("/", multer.single('photo'), controllerChefs.put)
routes.delete("/", controllerChefs.delete)

module.exports = routes