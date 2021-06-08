const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  createFiles({filename, path}) {
    try {
      const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
      `
      const values = [filename, path]

      return db.query(query, values)

    } catch (error) {
      console.error(error)
    }
  },

  async deleteFiles(fileId){
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId])
      const file = results.rows[0]
      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [fileId])
      
    } catch (error) {
      console.log(error)
    }
  },

  createRecipeFiles({fileId, recipeId}){
    try {
      const query = `
      INSERT INTO recipe_files (
        file_id,
        recipe_id
      ) VALUES ($1, $2)
      RETURNING id
      `
      const values = [fileId, recipeId]

      return db.query(query, values)

    } catch (error) {
      console.error(error)
    }
  },

  async deleteRecipeFiles(fileId, recipeId){
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId])
      const file = results.rows[0]
      fs.unlinkSync(file.path)

      //antes de deletar o file deleta em recipe_files
      await db.query(`
        DELETE FROM recipe_files WHERE recipe_id = $1 AND file_id = $2
      `, [recipeId, fileId])
      return await db.query(`DELETE FROM files WHERE id = $1`, [fileId])

    } catch (error) {
      console.error(error)
    }
  },
}