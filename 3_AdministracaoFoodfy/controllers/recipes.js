const fs = require('fs')
const data = require('../data.json')

exports.index = function(req, res){
  const recipesFiltered = []

  for(let i = 0; i < data.recipes.length; i++){
      const obj = data.recipes[i]
      obj.index = i
      recipesFiltered.push(obj)
  }

  return res.render('admin/home', {items: recipesFiltered})
}

exports.create = function(req, res) {
  res.render('admin/create')
}

exports.edit = function(req, res) {
  const recipeIndex = req.params.index
  const recipeFound = data.recipes[recipeIndex]

  if (!recipeFound) return res.send('Recipe not found!')

  const recipe = {
    ...recipeFound,
    index: recipeIndex
  }
  
  res.render('admin/edit', {item: recipe})
}

exports.show = function (req, res) {
  const recipeIndex = req.params.index
  const recipeFound = data.recipes[recipeIndex]

  if (!recipeFound) return res.send('Recipe not found!')

  const recipe = {
    ...recipeFound,
    index: recipeIndex
  }

  return res.render('admin/show', {item: recipe})
}

exports.post = function(req, res) {
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if(req.body[key] == "")
      return res.send("Preencha todos os campos corretamente")
  }

  let { recipe_url, title, author, ingredients, preparations, information} = req.body

  data.recipes.push({
    recipe_url,
    title,
    author,
    ingredients,
    preparations,
    information
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if(err) return res.send("Erro ao gravar receita.")

    return res.redirect(`/admin/receitas/${data.recipes.length -1}`)
  })
}

exports.put = function(req, res) {
  const keys = Object.keys(req.body)

  for (const key of keys) {
    if(req.body[key] == "")
      return res.send("Preencha todos os campos corretamente")
  }
  
  const {index} = req.body
  const recipeFound = data.recipes[index]

  if(!recipeFound) return res.send("Receita não encontrada")

  const recipeDados = { recipe_url, title, author, ingredients, preparations, information} = req.body

  const recipe = {
    ...recipeFound,
    ...recipeDados
  }

  data.recipes[index] = recipe

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if(err) return res.send("Erro ao gravar receita.")

    return res.redirect(`/admin/receitas/${index}`)
  })
}

exports.delete = function(req, res) {
  const {index} = req.body

  const recipesFiltered = data.recipes.filter(function(recipe, foundIndex){
    return foundIndex != index
  })

  data.recipes = recipesFiltered

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
    if(err) return res.send("Erro ao deletar receita")

    return res.redirect("/admin/receitas/")
  })
}