const recipes = document.querySelectorAll('.recipe')
const recipesContent = document.querySelectorAll('.recipe-content')

for (let recipe of recipes){
  recipe.addEventListener('click', function(){
    const recipeId = recipe.getAttribute('id')
    window.location.href = `/recipe/${recipeId}`
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





// const modalOverlay = document.querySelector('.modal-overlay')
// const recipes = document.querySelectorAll('.recipe')

// for(let recipe of recipes) {
//   recipe.addEventListener('click', function() {
//     const cardId = recipe.getAttribute("id")
//     modalOverlay.classList.add('active')
//     modalOverlay.querySelector('img').src = `/assets/${cardId}.png`
//     modalOverlay.querySelector('img').alt = `Imagem de ${cardId}`
//     modalOverlay.querySelector('h2').innerHTML = recipe.querySelector('strong').textContent
//     modalOverlay.querySelector('p').innerHTML = recipe.querySelector('p').textContent
//   })
// }

// document.querySelector('.close-modal').addEventListener('click', function(){
//   modalOverlay.classList.remove('active')
// })



  

