const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./data')

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.get('/', function(req, res){
  const recipesFiltered = []

  for(let i = 0; i < 6; i++){
    const obj = recipes[i]
    obj.index = i
    recipesFiltered.push(obj)
  }

  return res.render('home', {items: recipesFiltered})
})

server.get('/about', function(req, res){
  return res.render('about')
})

server.get('/recipes', function(req, res){
  const recipesFiltered = []

  for(let i = 0; i < 6; i++){
    const obj = recipes[i]
    obj.index = i
    recipesFiltered.push(obj)
  }

  return res.render('recipes', {items: recipesFiltered})
})

server.get("/recipe/:index", function (req, res) {
  const recipeIndex = req.params.index;
  const recipe = recipes[recipeIndex]; // Array de receitas carregadas do data.js

  if (!recipe) return res.send('Recipe not found!')

  return res.render('recipe', {item: recipe})
})

server.listen(5000, function(){
  console.log('server is running')
})