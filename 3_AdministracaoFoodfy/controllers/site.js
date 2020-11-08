const data = require('../data.json')

exports.index = function(req, res){
  const recipesFiltered = []

  for(let i = 0; i < 6; i++){
      const obj = data.recipes[i]
      obj.index = i
      recipesFiltered.push(obj)
  }

  return res.render('site/home', {items: recipesFiltered})
}

exports.show = function (req, res) {
  const recipeIndex = req.params.index;
  const recipe = data.recipes[recipeIndex]

  if (!recipe) return res.send('Recipe not found!')

  return res.render('site/recipe', {item: recipe})
}

exports.recipes = function(req, res){
  const recipesFiltered = []

  for(let i = 0; i < data.recipes.length; i++){
    const obj = data.recipes[i]
    obj.index = i
    recipesFiltered.push(obj)
  }

  return res.render('site/recipes', {items: recipesFiltered})
}