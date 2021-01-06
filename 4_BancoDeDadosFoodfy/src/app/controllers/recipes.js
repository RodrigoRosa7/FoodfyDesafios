const Recipe = require('../models/Recipe')

module.exports = {
  index(req, res){
    Recipe.all(function(recipes){
      return res.render('admin/recipes/index', {recipes})
    })
  },

  create(req, res){
    Recipe.ChefSelectOptions(function(options){
      res.render('admin/recipes/create', {chefsOptions: options})
    })  
  },

  edit(req, res){
    Recipe.find(req.params.index, function(recipe){
      if(!recipe) return res.send("Receita não encontrada!")

      Recipe.ChefSelectOptions(function(options){
        return res.render('admin/recipes/edit', {recipe, chefsOptions: options})
      })
    })
  },

  show(req, res){
    Recipe.find(req.params.index, function(recipe){
      if(!recipe) return res.send("Receita não encontrada!")

      return res.render(`admin/recipes/show`, {recipe})
    })
  },

  post(req, res){
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if(req.body[key] == "")
        return res.send("Preencha todos os campos corretamente")
    }

    Recipe.create(req.body, function(recipe){
      return res.redirect(`/admin/receitas/${recipe.id}`)
    })
  },

  put(req, res){
    Recipe.update(req.body, function(){
      return res.redirect(`/admin/receitas/criar`)
    })
  },

  delete(req, res) {
    Recipe.delete(req.body.id, function(){
      return res.redirect("/admin/receitas")
    })
  }
}