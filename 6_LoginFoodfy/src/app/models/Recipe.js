const {date} = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
  all(){
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
      ORDER BY recipes.created_at DESC`)

    } catch (error) {
      console.log(error)
    }
  },

  allOfUser(id){
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
      WHERE user_id = ${id}`)
    } catch (error) {
      console.log(error)
    }
  },

  ChefSelectOptions(){
    try {
      return db.query("SELECT id, name FROM chefs ORDER BY chefs.name")
      
    } catch (error) {
      console.log(error)
    }
  },

  create(data){
    try {
      const query = `
      INSERT INTO recipes(
        chef_id,
        title,
        ingredients,
        preparations,
        information,
        created_at,
        update_at,
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
      `

      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparations,
        data.information,
        date(Date.now()).iso,
        date(Date.now()).iso,
        data.userId
      ]

      return db.query(query, values)

    } catch (error) {
      console.log(error)
    }
  },

  find(index){
    try {
      return db.query(`
      SELECT recipes.*, chefs.name AS name_chef 
      FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [index])

    } catch (error) {
      console.log(error)
    }
  },

  update(data){
    try {
      const query = `
      UPDATE recipes SET
        chef_id = ($1),
        title = ($2),
        ingredients = ($3),
        preparations = ($4),
        information = ($5)
      WHERE id = $6
      RETURNING id
      `

      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparations,
        data.information,
        data.id
      ]

      return db.query(query, values)

    } catch (error) {
      console.log(error)
    }
  },

  delete(id){
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id])  

    } catch (error) {
      console.log(error)
    }
  },

  RecipeFiles(id){
    try {
      return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [id])
      
    } catch (error) {
      console.log(error)
    }
  },

  findBy(params) {
    try {
      const {filter, limit, offset} = params

      let query = "",
          filterQuery = "",
          totalQuery = "(SELECT COUNT(*) FROM recipes) AS total"

      
      if(filter) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
        `

        totalQuery = `(
        SELECT COUNT(*) FROM recipes
        ${filterQuery}
        ) AS total`
      }

      query = `
      SELECT recipes.*, ${totalQuery},
      chefs.name AS name_chef, single_file.path AS file_path
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN (
        SELECT DISTINCT on (recipe_files.recipe_id) recipe_files.recipe_id, files.path
        FROM recipe_files
        JOIN files ON recipe_files.file_id = files.id
        ) single_file ON (single_file.recipe_id = recipes.id)
      ${filterQuery}
      ORDER BY recipes.update_at DESC
      LIMIT $1 OFFSET $2
      `

      return db.query(query, [limit, offset])

    } catch (error) {
      console.log(error)
    }
  },

  paginate(params){
    try {
      const {limit, offset} = params

      let query = `
      SELECT recipes.*, 
      (SELECT COUNT(*) FROM recipes) AS total, chefs.name AS name_chef, single_file.path AS file_path
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      LEFT JOIN (
        SELECT DISTINCT on (recipe_files.recipe_id) recipe_files.recipe_id, files.path
        FROM recipe_files
        JOIN files ON recipe_files.file_id = files.id
        ) single_file ON (single_file.recipe_id = recipes.id)
      `
      query = `${query}
      ORDER BY recipes.created_at DESC
      LIMIT $1 OFFSET $2
      `
      return db.query(query, [limit, offset])

    } catch (error) {
      console.log(error)
    }
  },

  files(id){
    try {
      return db.query(`
      SELECT files.*, recipe_id
      FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_id = $1
      `, [id])
      
    } catch (error) {
      console.log(error)
    }
  }
}