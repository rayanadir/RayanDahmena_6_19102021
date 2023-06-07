import Photographer from '../models/Photographer.js';

var tagsArray = [];

/**
 * @description obtention des données json
 */
function getData() {
    fetch('./public/datas/photographers.json')
        .then(res => {
            return res.json();
        })
        .then(data => {
            return data.photographers.map((photographer) => new Photographer(photographer))
        })
        .then(photographers => {
            displayTags(photographers);
            displayPhotographers(photographers);
        })
}

/**
 * 
 * @param {*} photographers affichage des tags pour chaque photographe
 */
function displayTags(photographers) {
    const tags = [...new Set(photographers.map((photographer) => photographer.tags).flat())];
    tags.forEach((tag) => {
        const a = document.createElement('a');
        a.addEventListener('click', event => {
            let classValue = event.target.classList.value;
            if (classValue.indexOf('filtered') === -1) {
                event.target.classList.add('filtered');
            } else {
                event.target.classList.remove('filtered');
            }
            selectTag(event);
            displayPhotographers(photographers);
        });
        a.href = "#";
        a.id=tag; 
        a.innerHTML = "#" + tag;
        a.classList.add('header__tag');
        document.getElementById('nav').appendChild(a);
    })
}
/**
 * 
 * @param {*} event séléctionne un tag
 * @returns retourne un tableau de tags séléctionnés
 */
function selectTag(event) {
    const tag = event.target.id;
    if (tagsArray.indexOf(tag) == -1) {
        tagsArray.push(tag);
    } else {
        tagsArray.splice(tagsArray.indexOf(tag), 1);
    }
    return tagsArray;
}

/**
 * 
 * @param {*} photographers affiche les photographes 
 */
function displayPhotographers(photographers) {
    document.getElementById("photographers").innerHTML = ``;
    var photographersArray = [];
    photographers.forEach((photographer) => {
        let isFounded = tagsArray.every(ai => photographer.tags.includes(ai));
        if (isFounded) {
            photographersArray.push(photographer);
        }
    });
    let photographerList = document.getElementById("photographers");
    for (var i = 0; i < photographersArray.length; i++) {
        var template = `
                <article class="photographers__photographer" aria-label="Photographer">
                                      <a href="./photographer-page.html?id=${photographersArray[i].id}">
                                      <img class="photographers__img" src="public/medias/${photographersArray[i].portrait}" aria-label="accéder au profil du photographe ${photographersArray[i].name}" alt="${photographersArray[i].name}">
                                      </a>

                                      <h2 class="photographers__name">
                                           ${photographersArray[i].name}
                                      </h2>
                                      <p class="photographers__localisation">
                                           ${photographersArray[i].city},${photographers[i].country}
                                      </p>
                                      <p class="photographers__description">
                                           ${photographersArray[i].tagline}
                                      </p>
                                      <p class="photographers__price">
                                           ${photographersArray[i].price}€ / jour
                                      </p>
                                      <div class="photographers__tags">
                                      ${photographersArray[i].tags.map((tag) => `<li class="photographers__tag"> #${tag}</li>`).join('')} 
                                      </div>
                                      </article>
            `
            photographerList.innerHTML += template;
        }
}

getData();

window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        document.querySelector('.content').style.display = "flex";
    } else {
        document.querySelector('.content').style.display = "none";
    }
})