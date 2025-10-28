window.onload = init
returnStorage()
function init(){
    const btn = document.getElementById('btn')
    const lien = document.querySelectorAll('.lien')
    

    lien.forEach(a => {
        a.addEventListener('mousedown', () => {
            a.style.transform = 'scale(0.95)'
        })
        a.addEventListener('mouseover', () => {
            a.style.backgroundColor = 'lightgray'
        })
        a.addEventListener('mouseleave', () => {
            a.style.backgroundColor = 'white'
        })

    })

    btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)'
    })

    btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = 'lightgray'
           btn.style.cursor = 'pointer'
    })

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'white'
    })

    btn.addEventListener('click', err => { err.preventDefault()})
        
    btn.addEventListener('click',enregistrer)

    
}


function enregistrer(){
    let theme = document.getElementById('theme').value
    let choix = document.querySelector('input[name="affichage2"]:checked').value

    localStorage.setItem("theme", theme)
    localStorage.setItem("choix", choix)
}


function returnStorage(){
    const storeTheme = localStorage.getItem('theme')
    if(storeTheme){
        let select = document.getElementById('theme')
        select.value = storeTheme
    }
    const storeChoice = localStorage.getItem('choix')

    if(storeChoice){
        let radio = document.querySelectorAll('input[name="affichage2"]')

        radio.forEach(rad => {
            if(rad.value === storeChoice){
                rad.checked = true
            }
        })
    }       
}
