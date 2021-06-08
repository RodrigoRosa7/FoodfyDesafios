const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')
const controllerRecipes = require('../app/controllers/recipes')

routes.get("/", controllerRecipes.index)
routes.get("/criar", controllerRecipes.create)
routes.get("/:index/editar", controllerRecipes.edit)
routes.get("/:index", controllerRecipes.show)

routes.post("/", multer.array('photos', 5), controllerRecipes.post)
routes.put("/", multer.array('photos', 5), controllerRecipes.put)
routes.delete("/", controllerRecipes.delete)

module.exports = routes