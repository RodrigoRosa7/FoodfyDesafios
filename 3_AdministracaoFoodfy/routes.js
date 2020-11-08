const express = require('express')
const routes = express.Router()
const controllerRecipes = require('./controllers/recipes')
const controllerSite = require('./controllers/site')

//rotas site
routes.get('/', controllerSite.index)
routes.get('/sobre', function(req, res){
  return res.render('site/about')
})
routes.get('/receitas', controllerSite.recipes)
routes.get("/receita/:index", controllerSite.show)

//rotas admin
routes.get("/admin/receitas", controllerRecipes.index)
routes.get("/admin/receitas/criar", controllerRecipes.create)
routes.get("/admin/receitas/:index/editar", controllerRecipes.edit)
routes.get("/admin/receitas/:index", controllerRecipes.show)

routes.post("/admin/receitas", controllerRecipes.post)
routes.put("/admin/receitas", controllerRecipes.put)
routes.delete("/admin/receitas", controllerRecipes.delete)

module.exports = routes