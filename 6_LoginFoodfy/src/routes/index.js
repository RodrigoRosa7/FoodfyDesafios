const express = require('express')
const routes = express.Router()

//Home
const home = require('./home')
routes.use('', home)

//Users
const users = require('./users')
routes.use('/admin/users', users)

//Recipes
const recipes = require('./recipes')
routes.use('/admin/receitas', recipes)

//Chefs
const chefs = require('./chefs')
routes.use('/admin/chefs', chefs)

//Site
routes.get('/',function(req, res){
  return res.redirect("/home")
})

//Alias
routes.get('/accounts', function(req, res){
  return res.redirect('/admin/users/register')
})


module.exports = routes