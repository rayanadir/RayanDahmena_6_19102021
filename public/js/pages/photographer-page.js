import { MediaFactory, Photo, Video } from '../models/Media.js';
import Photographer from '../models/Photographer.js';

var likedMedias = [];
var mediasArray = [];
var likes = 0;
var price;
var index;
var a_tag;
var mediaTemplate;
var previousActiveElement;
const form = document.querySelector(".contactform");
form.style.display = "none";
const body = document.querySelector('body');
const select_triple = document.getElementById('select_triple');
const select = document.getElementById('select');
select_triple.style.display = "none";
const popularite = document.getElementById('popularite');
const date = document.getElementById('date');
const title = document.getElementById('title');

/**
 * @description obtention des données json
 */
function getData() {
    fetch('./public/datas/photographers.json')
        .then(res => {
            return res.json();
        })
        .then(data => {
            const photographers = data.photographers;
            const url = window.location.search;
            const id = url.split('id=')[1];
            let photographer = photographers.find(photographer => photographer.id == id);
            if (photographer) {
                photographer = new Photographer(photographer);
            }
            if (photographer.id == id) {
                data.media.map(media => {
                    if (media.photographerId == id) {
                        mediasArray.push(MediaFactory.createMedia(media))
                        likes = likes + MediaFactory.createMedia(media).likes;
                    }
                });
                price = photographer.price;
                loadMedias(mediasArray);
                loadProfile(photographer);
                loadForm(photographer);
            }
        })
}

/**
 * 
 * @param {*} array chargement de la bannière
 * @returns retourne le nombre total de likes
 */
function loadBanner(array) {
    const photographerPrice = price;
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total = total + array[i].likes;
    }
    document.getElementById('banner').innerHTML = ``;
    document.getElementById('banner').innerHTML = `
            <div class="banner__likes">
            <div class="banner__count">
                ${total}
            </div>
            <i class="fas fa-heart banner__icon"></i>
        </div>
        <div class="banner__price">
            ${photographerPrice}€ / jour
        </div> 
            `
    return total;
}

/**
 * 
 * @param {*} photographer chargement du profil
 */
function loadProfile(photographer) {
    document.getElementById("profile").innerHTML = `
            <article class="profile__infos" aria-label="Profile">
            <h1 class="profile__name">
                ${photographer.name}
            </h1>
            <p class="profile__localisation">
                ${photographer.city},${photographer.country}
            </p>
            <p class="profile__description">
                ${photographer.tagline}
            </p>
            <div class="profile__tags">
                ${photographer.tags.map((tag) => `<a class="profile__tag" id="tag" data-id="${tag}" href="#"> #${tag}</a>`).join('')}
            </div>
        </article>
        <div class="profile__bouton">
            <button class="profile__contact" title="contacter le photographe" id="openform" data-id="contact">
            Contactez-moi
        </button>
        </div>
        <a href="#" class="profile__a" title="${photographer.name}" id="profile_picture" data-id="${photographer.portrait}">
            <img class="profile__img" aria-label="photo de profil du photographe ${photographer.name}" src="public/medias/${photographer.portrait}">
        </a>
            `
}
/**
 * 
 * @param {*} photographer chargement du formulaire 
 */
function loadForm(photographer) {
    document.getElementById("contact").innerHTML = `
    <div class="contactform__contact_close">
    <h1 class="contactform__contactMe">Contactez-moi</h1>
    <button class="contactform__close" aria-label="fermer le formulaire" id="closeForm">
        <i class="fas fa-times contactform__icon modal-close-btn" aria-label="Close"></i>
    </button>
</div>

<h1 class="contactform__contactMe">${photographer.name}</h1>
</div>
<form method="get" name="reserve" action="photographer-page.html" >
    <div class="contactform__formData">
        <label for="firstname">Prénom</label> <br>
        <input type="text" class="contactform__input" id="first" aria-label="entrez votre prénom"> 
        <p class="contactform__error_first">Vous devez entrer votre prénom</p>
        
    </div>
    <div class="contactform__formData">
        <label for="lastname">Nom</label> <br>
        <input type="text" class="contactform__input" id="last" aria-label="entrez votre nom"> <br>
        <p class="contactform__error_last">Vous devez entrer votre nom</p>
    </div>
    <div class="contactform__formData">
        <label for="email_test">Email</label> <br>
        <input type="email" class="contactform__input" id="email" aria-label="entrez votre email"> <br>
        <p class="contactform__error_email">Vous devez entrer une adresse email valide</p>
    </div>
    <div class="contactform__formData">
        <label for="message">Votre message</label> <br>
        <textarea type="text" minlength="5" class="contactform__message" id="message" aria-label="entrez votre message"></textarea> <br>
        <p class="contactform__error_message">Vous devez entrer un message valide</p>
    </div>
                    <button class="contactform__send" type="submit" aria-label="envoyer">
    Envoyer
</button>
</form>
<br>
    `
    const form = document.querySelector(".contactform");
    form.style.display = "none";
    //ouvrir formulaire
    const openform = document.getElementById('openform');
    openform.addEventListener('click', openForm);
    //fermer formulaire
    const closeform = document.getElementById('closeForm');
    closeform.addEventListener('click', closeForm);

    //verification prénom
    const first = document.getElementById('first');
    first.addEventListener('blur', function checkFirstandLastName(input, type) {
        const regex = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
        const value = input.value;
        const test = regex.test(value);
        if (test && input.length !== 0) {
            if (type === "firstname") {
                document.querySelector('.contactform__error_first').style.display = "none";
            }
            if (type === "lastname") {
                document.querySelector('.contactform__error_last').style.display = "none";
            }
            return true;
        } else {
            if (type === "firstname") {
                document.querySelector('.contactform__error_first').style.display = "flex";
            }
            if (type === "lastname") {
                document.querySelector('.contactform__error_last').style.display = "flex";
            }
            return false
        }
    })

    //verification nom
    const last = document.getElementById('last');
    last.addEventListener('blur', function checkFirstandLastName(input, type) {
        const regex = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
        const value = input.value;
        const test = regex.test(value);
        if (test && input.length !== 0) {
            if (type === "firstname") {
                document.querySelector('.contactform__error_first').style.display = "none";
            }
            if (type === "lastname") {
                document.querySelector('.contactform__error_last').style.display = "none";
            }
            return true;
        } else {
            if (type === "firstname") {
                document.querySelector('.contactform__error_first').style.display = "flex";
            }
            if (type === "lastname") {
                document.querySelector('.contactform__error_last').style.display = "flex";
            }
            return false
        }
    })

    //verification adresse email
    const email = document.getElementById('email');
    email.addEventListener('blur', function checkEmail(input) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const test = re.test(String(input).toLowerCase());
        return test;
    })

    //verification message
    const message = document.getElementById('message');
    message.addEventListener('blur', function checkMessage(input) {
        if (input.length !== 0) {
            document.querySelector('.contactform__error_message').style.display = "none";
            return true;
        } else {
            document.querySelector('.contactform__error_message').style.display = "flex";
            return false;
        }
    })

    //verification formulaire
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let firstValid = false;
        let lastValid = false;
        let emailValid = false;
        

        const regexFirstLast = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexFirstLast.test(document.getElementById('first').value)) {
            firstValid = true;
        }
        if (regexFirstLast.test(document.getElementById('last').value)) {
            lastValid = true;
        }
        
        if (regexEmail.test(document.getElementById('email').value)) {
            emailValid = true;
        }

        if (emailValid == false) {
            document.querySelector('.contactform__error_email').style.display = "flex";
        }
        if (firstValid == false) {
            document.querySelector('.contactform__error_first').style.display = "flex";
        }
        if (lastValid == false) {
            document.querySelector('.contactform__error_last').style.display = "flex";
        }
        let formValid = firstValid && lastValid && emailValid;
        if (formValid == true) {
            document.querySelector('.contactform__error_email').style.display = "none";
            console.log("Prénom : " + document.getElementById('first').value);
            console.log("Nom : " + document.getElementById('last').value);
            console.log("Email : " + document.getElementById('email').value);
            console.log("Message : " + document.getElementById('message').value);
            document.querySelector('form').reset();
        }
    })
}
//ouvrir les tris
select.addEventListener('click',()=>{
    select.style.display="none";
    select_triple.style.display="flex";
    document.getElementById('filter').style.alignItems="baseline";
    popularite.focus();
})
//trier par la popularité
popularite.addEventListener('click',()=>{
    select_triple.style.display="none";
    select.style.display="flex";
    select.innerHTML=`
    Popularité
    <i class="fas fa-chevron-down"></i>
    `;
    document.getElementById('filter').style.alignItems="center";
    mediasArray.sort((x, y) => {
        return y.likes - x.likes;
    })
    loadMedias(mediasArray);
    select.focus();
})
//trier par la date
date.addEventListener('click',()=>{
    select_triple.style.display="none";
    select.style.display="flex";
    select.innerHTML=`
    Date
    <i class="fas fa-chevron-down"></i>
    `;
    document.getElementById('filter').style.alignItems="center";
    mediasArray.sort((x, y) => {
        return new Date(x.date) - new Date(y.date);
    })
    loadMedias(mediasArray);
    select.focus();
})
//trier par le titre
title.addEventListener('click',()=>{
    select_triple.style.display="none";
    select.style.display="flex";
    select.innerHTML=`
    Titre
    <i class="fas fa-chevron-down"></i>
    `;
    document.getElementById('filter').style.alignItems="center";
    mediasArray.sort((x, y) => {
        if (x.title.toLowerCase() < y.title.toLowerCase()) {
            return -1;
        }
        if (x.title.toLowerCase() > y.title.toLowerCase()) {
            return 1;
        }
        return 0;
    })
    loadMedias(mediasArray);
    select.focus();
})

/**
 * @description ouverture du média
 */
function openMedia() {
    const mediaSection = document.getElementById('media');
    document.getElementById('profile').style.display = "none";
    document.getElementById('imagesSection').style.display = "none";
    document.getElementById('contact').style.display = "none";
    document.getElementById('header').style.display = "none";
    mediaSection.setAttribute('display-mobile-media', true);
    mediaSection.setAttribute('display-desktop', true);
    const banner = document.getElementById('banner');
    banner.setAttribute('close-banner-desktop', true);
}
/**
 * @description fermeture du média
 */
function closeMedia() {
    const mediaSection = document.getElementById('media');
    document.getElementById('profile').style.display = "flex";
    document.getElementById('imagesSection').style.display = "block";
    document.getElementById('contact').style.display = "none";
    document.getElementById('header').style.display = "flex";
    index = null;
    const banner = document.getElementById('banner');
    banner.setAttribute('display-mobile', true);
    banner.setAttribute('display-desktop', true);
    banner.removeAttribute('close-banner-desktop');
    mediaSection.removeAttribute('display-mobile-media');
    mediaSection.removeAttribute('display-desktop');
    const media_title = document.getElementById('media_title');
    media_title.innerHTML = ``;
    if(a_tag!==undefined){
        a_tag.focus();
    }
}
/**
 * @description fermeture du formulaire
 */
function closeForm() {
    form.style.display = "none";
    document.querySelector('header').ariaHidden = "false";
    document.querySelector('main').ariaHidden = "false";
    document.getElementById('contact').ariaHidden = "true";
    body.style.overflow = "auto";
    document.querySelector('header').style.pointerEvents = "all";
    document.querySelector('main').style.pointerEvents = "all";
    document.getElementById('select').tabIndex = 0;
    enableFocus();
}
/**
 * @description ouverture du formulaire
 */
function openForm() {
    form.style.display = "block";
    document.getElementById("closeForm").focus();
    document.getElementById('contact').ariaHidden = "false";
    body.style.overflow = "hidden";
    document.querySelector('header').style.pointerEvents = "none";
    document.querySelector('main').style.pointerEvents = "none";
    document.getElementById('select').tabIndex = -1;
    document.getElementById('popularite').tabIndex=-1;
    document.getElementById('date').tabIndex=-1;
    document.getElementById('title').tabIndex=-1;
    disableFocus();
}

/**
 * désactive le focus sur la page
 */
function disableFocus(){
    document.getElementById('logo').tabIndex = -1;
    document.getElementById('tag').tabIndex = -1;
    document.getElementById('openform').tabIndex = -1;
    document.getElementById('profile_picture').tabIndex = -1;
    const medias_element = document.getElementsByClassName('images__a')
    for (let media of medias_element) {
        media.tabIndex = -1;
    }
    const tags = document.getElementsByClassName('profile__tag')
    for (let tag of tags) {
        tag.tabIndex = -1;
    }
    const likes=document.getElementsByClassName('images__button');
    for(let like of likes){
        like.tabIndex=-1;
    }
    document.querySelector('video').tabIndex = -1;
}
/**
 * active le focus sur la page
 */
function enableFocus() {
    document.getElementById('logo').tabIndex = 0;
    document.getElementById('tag').tabIndex = 0;
    document.getElementById('openform').tabIndex = 0;
    document.getElementById('profile_picture').tabIndex = 0;
    document.getElementById('popularite').tabIndex=0;
    document.getElementById('date').tabIndex=0;
    document.getElementById('title').tabIndex=0;
    const medias_element = document.getElementsByClassName('images__a')
    for (let media of medias_element) {
        media.tabIndex = 0;
    }
    const tags = document.getElementsByClassName('profile__tag')
    for (let tag of tags) {
        tag.tabIndex = 0;
    }
    const likes=document.getElementsByClassName('images__button');
    for(let like of likes){
        like.tabIndex=0;
    }
    document.querySelector('video').tabIndex = 0;
}

/**
 * 
 * @param {*} type navigation (suivant,précedent)
 */
function navigateMedia(type) {
    const media_title = document.getElementById('media_title');
    if (type == "next") {
        index++
        if (index > mediasArray.length - 1) {
            index = 0;
            media_title.innerHTML = ``;
            if (mediasArray[index] instanceof Photo) {
                const url = "./public/medias/" + mediasArray[index].image;
                mediaTemplate = `
                <img src="${url}" aria-label="${mediasArray[index].title}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
            } else if (mediasArray[index] instanceof Video) {
                const url = "./public/medias/" + mediasArray[index].video;
                mediaTemplate = `
                <video src="${url}" aria-label="${mediasArray[index].title}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
            closemedia.addEventListener('click', closeMedia)
        } else {
            media_title.innerHTML = ``;
            if (mediasArray[index] instanceof Photo) {
                const url = "./public/medias/" + mediasArray[index].image;
                mediaTemplate = `
                <img src="${url}" aria-label="${mediasArray[index].title}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
            } else if (mediasArray[index] instanceof Video) {
                const url = "./public/medias/" + mediasArray[index].video;
                mediaTemplate = `
                <video src="${url}" aria-label="${mediasArray[index].title}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
            closemedia.addEventListener('click', closeMedia)
        }
    } else if (type == "previous") {
        index--;
        if (index < 0) {
            index = mediasArray.length - 1;
            media_title.innerHTML = ``;
            if (mediasArray[index] instanceof Photo) {
                const url = "./public/medias/" + mediasArray[index].image;
                mediaTemplate = `
                <img src="${url}" aria-label="${mediasArray[index].title}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
            } else if (mediasArray[index] instanceof Video) {
                const url = "./public/medias/" + mediasArray[index].video;
                mediaTemplate = `
                <video src="${url}" aria-label="${mediasArray[index].title}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
            closemedia.addEventListener('click', closeMedia)
        } else {
            const media_title = document.getElementById('media_title');
            media_title.innerHTML = ``;
            if (mediasArray[index] instanceof Photo) {
                const url = "./public/medias/" + mediasArray[index].image;
                mediaTemplate = `
                <img src="${url}" aria-label="${mediasArray[index].title}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
            } else if (mediasArray[index] instanceof Video) {
                const url = "./public/medias/" + mediasArray[index].video;
                mediaTemplate = `
                <video src="${url}" aria-label="${mediasArray[index].title}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
            closemedia.addEventListener('click', closeMedia)
        }
    }
}

/**
 * 
 * @param {*} id aimer un média
 */
function likeMedia(id) {
    mediasArray.forEach((media, index) => {
        if (media.id == id) {
            if (likedMedias.includes(id) == true) {
                likedMedias.splice(likedMedias.indexOf(id), 1);
                mediasArray[index].likes = mediasArray[index].likes - 1
                return mediasArray[index].likes;
            } else {
                likedMedias.push(id);
                return mediasArray[index].likes++;
            }
        }
    })
    loadMedias(mediasArray);
}
 
/**
 * 
 * @param {*} array affichage des médias
 */
function loadMedias(array) {
    var images = document.getElementById('images');
    var banner = document.getElementById('banner');
    var articleTemplate;
    images.innerHTML = ``;
    banner.innerHTML = ``;
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Photo) {
            const imageurl = "./public/medias/" + array[i].image;
             articleTemplate = `
                        <article class="images__article" aria-label="Media">
                        <a class="images__a" href="#" title="${array[i].title}" id="a_tag_id_${i}" data-id="${i}">
                            <img src="${imageurl}" class="images__image" aria-label="${array[i].title}" alt="${array[i].title}">
                        </a>
                           <div class="images__title_like">
                                <div class="images__title">
                                    ${array[i].title}
                                </div>
                                <div class="images__like">
                                    <div class="images__count">
                                        ${array[i].likes}
                                    </div>
                                        <button class="images__button" data-index="${i}">
                                            <i class="fas fa-heart images__icon" data-id-like="${array[i].id}" aria-label="like"></i>
                                        </button>
                                </div>
                            </div>
                            </article>
                           `;
        } else if (array[i] instanceof Video) {
            const videourl = "./public/medias/" + array[i].video;
             articleTemplate = `
                                           <article class="images__article" aria-label="Media">
                                           <a class="images__a" href="#" id="a_tag_id_${i}" title="${array[i].title}" data-id="${i}">
                                               <video src="${videourl}" id="media_element" title="${array[i].title}" data-id="${i}" class="images__image" aria-label="${array[i].title}" ></video>
                                           </a>   
                                           <div class="images__title_like">
                                                   <div class="images__title">
                                                       ${array[i].title}
                                                   </div>
                                                   <div class="images__like">
                                                       <div class="images__count">
                                                           ${array[i].likes}
                                                       </div>
                                                        <button class="images__button" data-index="${i}">
                                                            <i class="fas fa-heart images__icon" data-id-like="${array[i].id}" aria-label="like"></i>
                                                        </button>
                                                   </div>
                                               </div>
                                               </article>
                                              `;
        }
        images.innerHTML += articleTemplate;
    }
    const items = document.getElementsByClassName('images__icon');
    for (let item of items) {
        //fonctionnalité like
        item.addEventListener('click', (e) => {
            console.log(e);
            const id = e.target.dataset.idLike;
            likeMedia(id);
        })
    }
    //fonctionnalité média (affichage + navigation + fermeture)
    const medias = document.getElementsByClassName('images__image');
    for (let media of medias) {
        media.addEventListener('click', (e) => {
            openMedia();
            var mediaType = e.target.tagName;
            //obtenir indice du média dans le tableau
            const media_title = document.getElementById('media_title');
            mediasArray.forEach((media, i) => {
                if (media instanceof Photo) {
                    const title = e.target.alt;
                    if (media.title == title) {
                        index = i;
                    }
                } else if (media instanceof Video) {
                    const title = e.target.title;
                    if (media.title == title) {
                        index = i;
                    }
                }
            })
            //affichage média séléctionné
            if (mediaType == "IMG") {
                const url = "./public/medias/" + mediasArray[index].image;
                const title = e.target.alt;
                mediaTemplate = `
                    <img src="${url}" class="media__media">
                    <p class="media__title">${title}</p>
                `
            } else if (mediaType == "VIDEO") {
                const url = "./public/medias/" + mediasArray[index].video;
                const title = e.target.title;
                mediaTemplate = `
                    <video src="${url}" class="media__media" controls="controls" title="${title}"></video>
                    <p class="media__title">${title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
        })
    }
    loadBanner(array);
}

//fermeture média
const closemedia = document.getElementById('closemedia');
closemedia.addEventListener('click', ()=>{closeMedia()});
//navigation média suivant
document.getElementById('next').addEventListener('click', () => { navigateMedia('next') });
//navigation média précédent
document.getElementById('previous').addEventListener('click', () => { navigateMedia('previous') });
//navigation média touches fléchées
document.addEventListener('keydown', (key) => {
    const value = key.code;
    if (value == "Escape") {
        closeMedia();
    } else if (value == "ArrowLeft") {
        navigateMedia('previous');
    } else if (value == "ArrowRight") {
        navigateMedia('next');
    }
})

//navigation page
document.addEventListener('keyup', (key) => {
    const code=key.code
    if (code == "Enter") {
        var id = document.activeElement.getAttribute('data-id');
        var id_like = document.activeElement.getAttribute('data-id-like');
        var index_active = document.activeElement.getAttribute('data-index');
        id = parseInt(id);
        id_like = parseInt(id_like);
        index_active = parseInt(index_active);
        const action = key.target.className;

        //pour accéder à la lightbox
        if (action == "images__a") {
            a_tag = document.getElementById('a_tag_id_' + id);
            if (id >= 0 && id < mediasArray.length) {
                openMedia();
                index = id;
                document.getElementById('media_title').innerHTML = ``;
                if (mediasArray[id] instanceof Photo) {
                    const url = "./public/medias/" + mediasArray[id].image;
                    mediaTemplate = `
                    <img src="${url}" class="media__media">
                    <p class="media__title">${mediasArray[id].title}</p>
                    `
                } else if (mediasArray[id] instanceof Video) {
                    const url = "./public/medias/" + mediasArray[id].video;
                    mediaTemplate = `
                    <video src="${url}" class="media__media" controls="controls" title="${mediasArray[id].title}"></video>
                    <p class="media__title">${mediasArray[id].title}</p>
                    `
                }
                document.getElementById('media_title').innerHTML += mediaTemplate;
            }
        }
        //pour liker un média
        else if (action == "images__button") {
            likeMedia(id_like);
            var buttons = document.getElementsByClassName('images__button');
            for (var i = 0; i < buttons.length; i++) {
                if (i == index_active) {
                    buttons[i].focus();
                }
            }
        }
    }//pour naviguer entre les filtres
    else if(code=="Tab" && previousActiveElement=="title"){
        popularite.focus();
        disableFocus();
    }
})

//récuperer le précédent element activé pour la navigation entre les filtres
document.addEventListener('keydown',(key)=>{
    previousActiveElement=document.activeElement.id;
    if(key.key=="Tab" && previousActiveElement=="title"){
        popularite.focus();
        disableFocus();
    }
})

getData();