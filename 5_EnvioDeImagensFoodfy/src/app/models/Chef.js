const {date} = require("../../lib/utils")
const db = require("../../config/db")

module.exports = {
  all(){
    try {
      return db.query(`
        SELECT chefs.*, files.name AS avatar_name, files.path AS avatar_path
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        GROUP BY chefs.id, files.id
        ORDER BY chefs.id
        `)
    } catch (error) {
      console.log(error)
    }
  },

  create(data, avatarId) {
    try {
      const query = `
        INSERT INTO chefs (
          name,
          created_at,
          file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
      const values = [
        data.name,
        date(Date.now()).iso,
        avatarId
      ]

      return db.query(query, values)

    } catch (error) {
      console.error(error)
    }
  },

  find(index) {
    try {
      return db.query(`
        SELECT chefs.*, COUNT(recipes) AS total_recipes, files.name AS avatar_name, files.path AS avatar_path
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id, files.id`, [index])

    } catch (error) {
      console.error(error)
    }
  },

  update(data, avatarId) {
    try {
      const query = `
        UPDATE chefs SET
          name = ($1),
          file_id = ($2)
        WHERE id = $3
        `
      const values = [
        data.name,
        avatarId,
        data.id
      ]

      return db.query(query, values)

    } catch (error) {
      console.log(error)
    }
  },

  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id])

    } catch (error) {
      console.log(error)      
    }
  },

  chefRecipes(id){
    try {
      return db.query(`
      SELECT recipes.*, chefs.name AS name_chef, single_file.path AS file_path
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN (
        SELECT DISTINCT on (recipe_files.recipe_id) recipe_files.recipe_id, files.path
        FROM recipe_files
        JOIN files ON recipe_files.file_id = files.id
        ) single_file ON (single_file.recipe_id = recipes.id)
      WHERE chefs.id = $1
      ORDER BY recipes.created_at DESC`, [id])
      
    } catch (error) {
      console.log(error)
    }
  }
}