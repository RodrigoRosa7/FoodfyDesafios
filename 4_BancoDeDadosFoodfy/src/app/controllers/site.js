const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

module.exports = {
  indexRecipes(req, res){
    Recipe.all(function(recipes){
      const recipesMostViews = []

      for(let i = 0; i < 6; i++){
              const obj = recipes[i]
              recipesMostViews.push(obj)
      }

      return res.render('site/index', {items: recipesMostViews})
    })
  },

  about(req, res){
    return res.render('site/about')
  },

  recipes(req, res){
    let {page, limit} = req.query

    page = page || 1
    limit = limit || 2
    let offset = limit * (page - 1)

    const params = {
      page,
      limit,
      offset,
      callback(recipes) {
        const pagination = {
          page,
          total: Math.ceil(recipes[0].total / limit)
        }

        return res.render('site/recipes', {items: recipes, pagination})
      }
    }
    
    Recipe.paginate(params)
  },

  show(req, res){
    Recipe.find(req.params.index, function(recipe){
      if(!recipe) return res.send("Receita não encontrada!")

      return res.render('site/recipe', {item: recipe})
    })
  },

  indexChefs(req, res){
    Chef.all(function(chefs){
      if(!chefs) return res.send("Não há chefs cadastrados")

      return res.render('site/chefs', {chefs})
    })
  },

  showChef(req, res){
    Chef.find(req.params.index, function(chef){
      if(!chef) return res.send("Chef não encontrado")

      Chef.chefRecipes(req.params.index, function(recipes){
        return res.render('site/chef', {chef, recipes})
      })
    })
  },

  filter(req, res){
     let {filter, page, limit} = req.query

     page = page || 1
     limit = limit || 2
     let offset = limit * (page - 1)
 
     const params = {
       filter,
       page,
       limit,
       offset,
       callback(filteredRecipes) {
         if(filteredRecipes[0]){
          const pagination = {
            total: Math.ceil(filteredRecipes[0].total / limit),
            page
          }
      
           return res.render('site/filterRecipes', {items: filteredRecipes, pagination, filter})

         } else {
           return res.render('site/filterNotFound', {filter})
         }

       }
     }
     
     Recipe.findBy(params)
  }
}