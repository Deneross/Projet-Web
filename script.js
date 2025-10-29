window.onload = init

fetch('promo.json')
  .then(response => response.json()).then(promo => {
      affichageAcceuil(promo.apprenants) //acceuil
      affichageCarte(promo.apprenants)  //carte
  })

returnStorage()


//icon maps
const AvatarIcon = L.Icon.extend({
    options: {
        // shadowUrl: 'leaf-shadow.png',
        iconSize:     [40, 40],
        // shadowSize:   [50, 64],
        iconAnchor:   [20, 50],
        // shadowAnchor: [4, 62],
        popupAnchor:  [0, -20]
    }
});

//map geolocalisé sur Paris
const map = L.map('map').setView([48.8592479529692, 2.3466913776675606], 5)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

function affichageCarte(promo){
    const marker = {}
    promo.forEach(apprenants => {
        const lat = apprenants.coordonnees.latitude;
        const lon = apprenants.coordonnees.longitude;

        const avatar = new AvatarIcon({ iconUrl: apprenants.avatar })
        const point = L.marker([lat, lon],{icon: avatar}).addTo(map)

        marker[apprenants.id] = point
        marker[apprenants.id].bindPopup(
            `
            <strong>${apprenants.prenom} ${apprenants.nom}</strong><br>
            ${apprenants.ville}
            `
        )
    })
}


//---------------------fonction----------------------------------------------
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

    if (!btn) return
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

    // changement de theme
    const select = document.getElementById("theme")

    select.addEventListener("change", () => {
           // mise à zero
    document.body.className = "";
    document.body.classList.add(select.value);
    });

}

//---------------------------en dehors de la fonction init---------------------------

function enregistrer(){
    let theme = document.getElementById('theme').value
    let choix = document.querySelector('input[name="affichage"]:checked').value

    localStorage.setItem("theme", theme)
    localStorage.setItem("choix", choix)
    alert("Paramètres enregistrés")
}

//-----------------Recup du local storage----------
function returnStorage(){
    // pour le theme
    const storeTheme = localStorage.getItem('theme')

    if(storeTheme){
        // applique toujours le theme
        document.body.className = "";
        document.body.classList.add(storeTheme);

        // si il y a le select, mis à jour
        let select = document.getElementById('theme');
        if(select){
            select.value = storeTheme;
        }
    }

    // pour l'affichage
    const storeChoice = localStorage.getItem('choix')

    if(storeChoice){
        let radio = document.querySelectorAll('input[name="affichage"]')
        
        radio.forEach(rad => {
            if(rad.value === storeChoice){
                rad.checked = true
            }
        })
    }  
}





function affichageAcceuil(promo){
    //lecture du local storage ou par default position liste
    let choix = localStorage.getItem('choix') || 'liste';

    //si on touche au radio 
    const radios = document.querySelectorAll('input[name="affichage"]');
    
    // Quand clique radio on met à jour
    radios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            choix = event.target.value;
            render();
        });
    });
    
    //affichage de base
    render();

    function render(){
        //ecoute du tableau
        const listeApprenantsBody = document.querySelector('#tableau tbody')
        const tableau = document.getElementById('tab')
        const grille = document.getElementById('grille')
        //eviter erreur
        if(!grille || !tableau) return;

        //pour vider le tableau et la grille avant de le remplir
        listeApprenantsBody.innerHTML = ''
        grille.innerHTML = ''

        // si liste
        if(choix === 'liste'){
            // montrer tableau, cacher grille
            tableau.removeAttribute('hidden');
            grille.setAttribute('hidden','');

            promo.forEach(apprenants => {

                let tr = document.createElement("tr")

                tr.innerHTML = `
                    <td>${apprenants.nom}</td>
                    <td>${apprenants.prenom}</td>
                    <td>${apprenants.ville}</td>
                    <td><a href="#">Détail</a></td>
                    `
                listeApprenantsBody.appendChild(tr)
            })
        }else{
            // montrer grille, cacher tableau
            grille.removeAttribute('hidden');
            tableau.setAttribute('hidden','');


            promo.forEach(apprenants => {
                let div = document.createElement("div")
                div.className = 'case';
                div.innerHTML = `
                    <h3> ${apprenants.nom}</h3>
                    <p>${apprenants.prenom}</p>
                    <p><a href="#" class="lien">Détail</a></p>`;
                grille.appendChild(div);
            });

        }
    }
}
