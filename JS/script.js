window.onload = init


let DATA 

fetch('../JSON/promo.json')
  .then(r => r.json())
  .then(promo => {
    PROMOINFO = promo.promo,
    DATA = promo?.promo?.apprenants ?? []
    //acceuil 
    affichageAcceuil(DATA)
    //affichage info
    affichageInfo(PROMOINFO)
    //carte
    if (document.getElementById('map') && typeof affichageCarte === 'function') {
    affichageCarte(DATA)
    returnStorage()
    }
  })

// ------ tentative pour lié l'api geaopify à la carte leaflet-------
let map
let searchMarker



//evite erreur sur autre page
if (document.getElementById('map')) {
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
    })
    //map geolocalisé sur Paris
    map = L.map('map').setView([48.8592479529692, 2.3466913776675606], 5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    function affichageCarte(DATA){
        const marker = {}
        DATA.forEach(apprenants => {
            const lat = apprenants.coordonnees.latitude
            const lon = apprenants.coordonnees.longitude

            let avatar

            if (apprenants.avatar) {
            avatar = new AvatarIcon({ iconUrl: apprenants.avatar })
            } else {
            avatar = new AvatarIcon({ iconUrl: '../Ressources/avatar.png' })
            }

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

}






//---------------------fonction init----------------------------------------------
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

    if (btn) {
    btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)'
    })

    btn.addEventListener('mouseover', () => {
        btn.style.backgroundColor = 'lightgray'
    })

    btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'white'
    })

    btn.addEventListener('click', err => { err.preventDefault()})
    
    btn.addEventListener('click',enregistrer)
    }

    // changement de theme
    const select = document.getElementById("theme")

    if(select){
        select.addEventListener("change", () => {
        // mise à zero
        document.body.className = ""
        document.body.classList.add(select.value)
    })

    }
   

    //ecoute d'appel modal détail
    document.getElementById('grille').addEventListener('click', (event) => {
        const  id = event.target.dataset.id 
        if (id){
            event.preventDefault()
            afficherModal(id)
        }
    })

    document.getElementById('tableau').addEventListener('click', (event) => {
        const  id = event.target.dataset.id 
        if (id){
            event.preventDefault()
            afficherModal(id)
        }
    })

}

//---------------------------en dehors de la fonction init---------------------------


//Remplissage info site by json
function affichageInfo(PROMOINFO){
    document.querySelector('.ban2 h1').textContent = `Promo ${PROMOINFO.nom}`

    const date = document.querySelector('.info-header__date')
    if(date) date.textContent = `Formation du ${PROMOINFO.date_debut} au ${PROMOINFO.date_fin}`

    const count = document.querySelector('.info-header__count')
    if(count) count.textContent = `Nombre d'apprenants : ${PROMOINFO.nombre}`

    const desc = document.querySelector('.info-panels__description')
    if(desc) desc.textContent = PROMOINFO.description
}



// enregistrement des prefs
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
        document.body.className = ""
        document.body.classList.add(storeTheme)

        // si il y a le select, mis à jour
        let select = document.getElementById('theme')
        if(select){
            select.value = storeTheme
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
    let choix = localStorage.getItem('choix') || 'liste'

    //si on touche au radio 
    const radios = document.querySelectorAll('input[name="affichage"]')
    
    // Quand clique radio on met à jour
    radios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            choix = event.target.value
            render()
        })
    })
    
    //affichage de base
    render()

    function render(){
        //ecoute du tableau
        const listeApprenantsBody = document.querySelector('#tableau tbody')
        const tableau = document.getElementById('tab')
        const grille = document.getElementById('grille')
        //eviter erreur
        if(!grille || !tableau) return

        //pour vider le tableau et la grille avant de le remplir
        listeApprenantsBody.innerHTML = ''
        grille.innerHTML = ''

        // si liste
        if(choix === 'liste'){
            // montrer tableau, cacher grille
            tableau.removeAttribute('hidden')
            grille.setAttribute('hidden','')

            DATA.forEach(apprenants => {

                let tr = document.createElement("tr")

                tr.innerHTML = `
                    <td>${apprenants.nom}</td>
                    <td>${apprenants.prenom}</td>
                    <td>${apprenants.ville}</td>
                    <td><a href="#" data-id="${apprenants.id}">Détail</a></td>
                    `
                listeApprenantsBody.appendChild(tr)
            })
        }else{
            // montrer grille, cacher tableau
            grille.removeAttribute('hidden')
            tableau.setAttribute('hidden','')


            DATA.forEach(apprenants => {
                let div = document.createElement("div")
                div.className = 'case'
                div.innerHTML = `
                    <h3> ${apprenants.nom}</h3>
                    <p>${apprenants.prenom}</p>
                    <p><a href="#" class="lien" data-id="${apprenants.id}">Détail</a></p>`
                grille.appendChild(div)
            })
        }
    }
}




// affichage de la modal
function afficherModal(id){
    const apprenants = DATA.find(apprenants => apprenants.id == id)
    if(!apprenants) return

    document.getElementById('detailNom').textContent  = `${apprenants.nom}`
    document.getElementById('detailPrenom').textContent  = `${apprenants.prenom}`
    document.getElementById('detailVille').textContent  = `${apprenants.ville}`
    document.getElementById('detailAnecdotes').textContent  = `${apprenants.anecdotes}`
    
    const avatar = document.getElementById('detailAvatar')
    avatar.src = apprenants.avatar || '../Ressources/avatar.png'
    avatar.alt = `avatar : ${apprenants.prenom} ${apprenants.nom}`


    // affichage
    document.getElementById('detailModal').removeAttribute('hidden')

    //fermeture
    const modal = document.getElementById('detailModal')

    modal.addEventListener('click', (event) => {
        // clic à l'extérieur du contenu
        if (event.target === modal) {        
            modal.setAttribute('hidden','')
            document.getElementById('tableau')
        }
    })
}



/* ------------- Mode Halloween -------------*/
let previousTheme = localStorage.getItem("theme") || 'clair'
document.body.className = previousTheme

const modeH = document.querySelector('.eni')

modeH.addEventListener('click', () => {

  const cls = document.body.classList

  if (!cls.contains('halloween')) {
    previousTheme = [...cls][0] || 'clair'
    cls.remove(previousTheme)
    cls.add('halloween')
    localStorage.setItem("theme", 'halloween')
  } else {
    cls.remove('halloween')
    cls.add(previousTheme)
    localStorage.setItem("theme", previousTheme)
  }
})

// pointer spider avorté
// const spider = 'url("../Ressources/spider-32.png") 16 16, auto'

// document.addEventListener('mousedown', () => {
// document.documentElement.style.cursor = spider
// })

// document.addEventListener('mouseup', () => {
// document.documentElement.style.cursor = 'auto'
// })



//Fonction input recherche sur leaflet avec Geoapify

/* 
	The addressAutocomplete takes as parameters:
  - a container element (div)
  - callback to notify about address selection
  - geocoder options:
  	 - placeholder - placeholder text for an input element
     - type - location type
*/
function addressAutocomplete(containerElement, callback, options) {
  // create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  // add input field clear button
  var clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  containerElement.appendChild(clearButton);

  /* Current autocomplete items data (GeoJSON.Feature) */
  var currentItems;

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  var currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  var focusedItemIndex;

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function(e) {
    var currentValue = this.value;
    // one line killer
    // const escape = (str) => str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<':
    // '&lt;', '>': '&gt;', '"': '&quot;', "'":'&#39;'}[m]))
    // value = escape(value);

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
      return false;
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;

      var apiKey = "544a665593914a308e3380fe78fd5267";
      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;
      
      if (options.type) {
      	url += `&type=${options.type}`;
      }

      fetch(url)
        .then(response => {
          // check if the call was successful
          if (response.ok) {
            response.json().then(data => resolve(data));
          } else {
            response.json().then(data => reject(data));
          }
        });
    });

    promise.then((data) => {
      currentItems = data.features;

      /*create a DIV element that will contain the items (values):*/
      var autocompleteItemsElement = document.createElement("div");
      autocompleteItemsElement.setAttribute("class", "autocomplete-items");
      containerElement.appendChild(autocompleteItemsElement);

      /* For each item in the results */
      data.features.forEach((feature, index) => {
        /* Create a DIV element for each element: */
        var itemElement = document.createElement("DIV");
        /* Set formatted address as item value */
        itemElement.textContent = feature.properties.formatted

        /* Set the value for the autocomplete text field and notify: */
        itemElement.addEventListener("click", function(e) {
          inputElement.value = currentItems[index].properties.formatted;

          callback(currentItems[index]);

          /* Close the list of autocompleted values: */
          closeDropDownList();
        });

        autocompleteItemsElement.appendChild(itemElement);
      });
    }, (err) => {
      if (!err.canceled) {
        console.log(err);
      }
    });
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function(e) {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].properties.formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      containerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");

    var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
  
    /* Close the autocomplete dropdown when the document is clicked. 
  	Skip, when a user clicks on the input field */
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });

}

addressAutocomplete(document.getElementById("autocomplete-container"), (data) => {
  if (!data) {
    if (searchMarker) { map.removeLayer(searchMarker); searchMarker = null; }
    return;
  }
  const { lat, lon, formatted } = data.properties;
  map.setView([lat, lon], 13);

  if (searchMarker) map.removeLayer(searchMarker);
  searchMarker = L.marker([lat, lon]).addTo(map).bindPopup(formatted).openPopup();
}, {
  placeholder: "Entrez une adresse"
})

