const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
  async index(req, res){
    try {
      const results = await Recipe.all()
      let recipes = results.rows

      if(!recipes) return res.render('admin/recipes/index')

      recipes = recipes.map(recipe => ({
        ...recipe,
        recipePhoto: `${req.protocol}://${req.headers.host}${recipe.file_path.replace("public", "")}`
      }))

      return res.render('admin/recipes/index', {recipes})
      
    } catch (error) {
      console.log(error)
    }
  },

  async create(req, res){
    try {
      let results = await Recipe.ChefSelectOptions()
      const chefs = results.rows
      res.render('admin/recipes/create', {chefsOptions: chefs})

    } catch (error) {
      console.log(error)
    }
  },

  async edit(req, res){
    try {
      let results = await Recipe.find(req.params.index)
      const recipe = results.rows[0]

      if(!recipe) return res.send("Receita não encontrada!")

      results = await Recipe.ChefSelectOptions()
      const chefs = results.rows

      results = await Recipe.files(recipe.id)
      let files = results.rows
      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render('admin/recipes/edit', {recipe, chefsOptions: chefs, files})

    } catch (error) {
      console.log(error)
    }
  },

  async show(req, res){
    try {
      let results = await Recipe.find(req.params.index)
      const recipe = results.rows[0] 
      
      if(!recipe) return res.send("Receita não encontrada!")

      results = await Recipe.files(recipe.id)
      let files = results.rows

      files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
      }))

      return res.render(`admin/recipes/show`, {recipe, files})

    } catch (error) {
      console.log(error)
    }
  },

  async post(req, res){
    try {
      const keys = Object.keys(req.body)

      for (const key of keys) {
        if(req.body[key] == "")
          return res.send("Preencha todos os campos corretamente")
      }

      if(req.files.length == 0){
        return res.send('Por favor inclua pelo menos uma imagem')
      }

      let results = await Recipe.create(req.body)
      const recipeId = results.rows[0].id

      const filesPromises = req.files.map(file => File.createFiles({...file}))
      let filesResults = await Promise.all(filesPromises)

      const recipeFilesPromises = filesResults.map(file => {
        const fileId = file.rows[0].id

        File.createRecipeFiles({fileId, recipeId})
      })
      await Promise.all(recipeFilesPromises)

      return res.redirect(`/admin/receitas/${recipeId}`)

    } catch (error) {
      console.log(error)
    }
  },

  async put(req, res){
    try {
      const keys = Object.keys(req.body)

      for (const key of keys) {
        if(req.body[key] == "" && key != "removed_files")
          return res.send("Preencha todos os campos corretamente")
      }

      let results = await Recipe.update(req.body)
      const recipeId = results.rows[0].id

      if(req.body.removed_files){
        const removedFiles = req.body.removed_files.split(",")
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        const removedFilesPromise = removedFiles.map(FileId => File.deleteRecipeFiles(FileId, recipeId))

        await Promise.all(removedFilesPromise)
      }

      if(req.files.length > 0){
        const oldFiles = await Recipe.files(req.body.id)
        const totalFiles = oldFiles.rows.length + req.files.length

        if(totalFiles <= 5){
          const filesPromises = req.files.map(file => File.createFiles({...file}))
          let filesResults = await Promise.all(filesPromises)
          
          const recipeFilesPromises = filesResults.map(file => {
            const fileId = file.rows[0].id
      
            File.createRecipeFiles({fileId, recipeId})
          })
          await Promise.all(recipeFilesPromises)
        }        
      }
      
      return res.redirect(`/admin/receitas/${recipeId}`)

    } catch (error) {
      console.log(error)
    }
  },

  async delete(req, res) {
    try {
      const results =  await Recipe.RecipeFiles(req.body.id)
      let recipeFiles = results.rows

      const removedRecipeFilesPromise = recipeFiles.map(recipeFile => File.deleteRecipeFiles(recipeFile.file_id, recipeFile.recipe_id))
      await Promise.all(removedRecipeFilesPromise)

      Recipe.delete(req.body.id)

      return res.redirect("/admin/receitas")

    } catch (error) {
      console.log(error)
    }
  }
}