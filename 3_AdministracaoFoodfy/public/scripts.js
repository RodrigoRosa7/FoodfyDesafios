const recipes = document.querySelectorAll('.recipe')
const recipesAdmin = document.querySelectorAll('.recipeAdmin')
const recipesContent = document.querySelectorAll('.recipe-content')

for (let recipe of recipes){
  recipe.addEventListener('click', function(){
    const recipeId = recipe.getAttribute('id')
    window.location.href = `/receita/${recipeId}`
  })
}

for (let recipe of recipesAdmin){
  recipe.addEventListener('click', function(){
    const recipeId = recipe.getAttribute('id')
    window.location.href = `/admin/receitas/${recipeId}`
  })
}

for (let recipeContent of recipesContent) {
  let btn = recipeContent.querySelector('h6')
  let recipeChangeClass = recipeContent.querySelector('.info-content')
  
  btn.addEventListener('click', function(){
    if(btn.innerHTML === 'ESCONDER'){
      
      btn.innerHTML = 'MOSTRAR'

      recipeChangeClass.classList.remove('visible')
      recipeChangeClass.classList.add('hidden')

    } else if (btn.innerHTML === 'MOSTRAR'){
      
      btn.innerHTML = 'ESCONDER'
      recipeChangeClass.classList.add('visible')
      recipeChangeClass.classList.remove('hidden')
      
    }
  })
}

//Adiciona novo ingrediente
function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  // Realiza um clone do último ingrediente adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);


//Adiciona novo passo
function addPreparation() {
  const preparations = document.querySelector("#preparations");
  const fieldContainer = document.querySelectorAll(".preparation");

  // Realiza um clone do último passo adicionado
  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  // Não adiciona um novo input se o último tem um valor vazio
  if (newField.children[0].value == "") return false;

  // Deixa o valor do input vazio
  newField.children[0].value = "";
  preparations.appendChild(newField);
}

document
  .querySelector(".add-preparation")
  .addEventListener("click", addPreparation);