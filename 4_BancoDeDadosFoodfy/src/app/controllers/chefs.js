const Chef = require('../models/Chef')

module.exports = {
  index(req, res){
    Chef.all(function(chefs){
      if(!chefs) return res.send("Não há chefs cadastrados")

      return res.render('admin/chefs/index', {chefs})
    })
  },

  create(req, res){
    return res.render('admin/chefs/create')
  },

  show(req, res){
    Chef.find(req.params.index, function(chef){
      if(!chef) return res.send("Chef não encontrado!")

      Chef.chefRecipes(req.params.index, function(recipes){
        return res.render('admin/chefs/show', {chef, recipes})
      })
    })
  },

  edit(req, res){
    Chef.find(req.params.index, function(chef){
      if(!chef) return res.send("Chef não encontrado!")

      return res.render('admin/chefs/edit', {chef})
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)

    for (const key of keys) {
      if(req.body[key] == "")
        return res.send("Preencha todos os campos corretamente")
    }

    Chef.create(req.body, function(chef){
      return res.redirect(`/admin/chefs/${chef.id}`)
    })
  },

  put(req, res){
    const keys = Object.keys(req.body)

    for(const key of keys) {
      if(req.body[key] == "")
        return res.send("Preencha todos os campos corretamente")
    }

    Chef.update(req.body, function(){
      return res.redirect(`/admin/chefs/${req.body.id}`)
    })
  },

  delete(req, res){

    Chef.find(req.body.id, function(chef){
      if(chef.total_recipes > 0) return res.send("Não é possível excluir chef com receitas atreladas")

      Chef.delete(req.body.id, function(){
        return res.redirect('/admin/chefs')
      })
    })
  }
}