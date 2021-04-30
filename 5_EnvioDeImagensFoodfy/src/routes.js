const express = require('express')
const routes = express.Router()
const controllerRecipes = require('./app/controllers/recipes')
const controllerSite = require('./app/controllers/site')
const controllerChefs = require('./app/controllers/chefs')
const multer = require('./app/middlewares/multer')

//rotas site
routes.get('/',function(req, res){
  return res.redirect("/home")
})
routes.get('/home', controllerSite.indexRecipes)
routes.get('/sobre', controllerSite.about)
routes.get('/receitas', controllerSite.recipes)
routes.get('/receita/:index', controllerSite.show)
routes.get('/chefs', controllerSite.indexChefs)
routes.get('/chefs/:index', controllerSite.showChef)
routes.get('/receitas_filtradas', controllerSite.filter)

//rotas admin

//recipes
routes.get("/admin/receitas", controllerRecipes.index)
routes.get("/admin/receitas/criar", controllerRecipes.create)
routes.get("/admin/receitas/:index/editar", controllerRecipes.edit)
routes.get("/admin/receitas/:index", controllerRecipes.show)

routes.post("/admin/receitas", multer.array('photos', 5), controllerRecipes.post)
routes.put("/admin/receitas", multer.array('photos', 5), controllerRecipes.put)
routes.delete("/admin/receitas", controllerRecipes.delete)

//chefs
routes.get("/admin/chefs", controllerChefs.index)
routes.get("/admin/chefs/criar", controllerChefs.create)
routes.get("/admin/chefs/:index", controllerChefs.show)
routes.get("/admin/chefs/:index/editar", controllerChefs.edit)

routes.post("/admin/chefs", multer.single('photo'), controllerChefs.post)
routes.put("/admin/chefs", multer.single('photo'), controllerChefs.put)
routes.delete("/admin/chefs", controllerChefs.delete)

module.exports = routes