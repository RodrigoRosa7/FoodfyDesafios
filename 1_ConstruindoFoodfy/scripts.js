const modalOverlay = document.querySelector('.modal-overlay')
const recipes = document.querySelectorAll('.recipe')

for(let recipe of recipes) {
  recipe.addEventListener('click', function() {
    const cardId = recipe.getAttribute("id")
    modalOverlay.classList.add('active')
    modalOverlay.querySelector('img').src = `/assets/${cardId}.png`
    modalOverlay.querySelector('img').alt = `Imagem de ${cardId}`
    modalOverlay.querySelector('h2').innerHTML = recipe.querySelector('strong').textContent
    modalOverlay.querySelector('p').innerHTML = recipe.querySelector('p').textContent
  })
}

document.querySelector('.close-modal').addEventListener('click', function(){
  modalOverlay.classList.remove('active')
})



  

