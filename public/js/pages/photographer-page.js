import { MediaFactory, Photo, Video } from '../models/Media.js';
import Photographer from '../models/Photographer.js';

var likedMedias = [];
var mediasArray = [];
var likes = 0;
var price;
var index;
var mediaTemplate;
const form = document.querySelector(".contactform");
form.style.display = "none";

/**
 * @description obtention des données json
 */
function getData() {
    fetch('../public/datas/photographers.json')
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
                ${photographer.tags.map((tag) => `<li class="profile__tag" id="tag"> #${tag}</li>`).join('')}
            </div>
        </article>
        <div class="profile__bouton">
            <button class="profile__contact" id="openform">
            Contactez-moi
        </button>
        </div>

        <img class="profile__img" src="../public/medias/${photographer.portrait}">
            `
}
/**
 * 
 * @param {*} photographer chargement du formulaire 
 */
function loadForm(photographer){
    document.getElementById("contact").innerHTML = `
    <div class="contactform__contact_close" aria-label="Form">
    <h1 class="contactform__contactMe">Contactez-moi</h1>
    <button class="contactform__close" id="closeForm">
        <i class="fas fa-times contactform__icon" aria-label="Close"></i>
    </button>
</div>

<h1 class="contactform__contactMe">${photographer.name}</h1>
</div>
<form method="get" name="reserve" action="photographer-page.html" >
    <div class="contactform__formData">
        <label for="firstname">Prénom</label> <br>
        <input type="text" class="contactform__input" id="first" aria-label="Firstname"> 
        <p class="contactform__error_first">Vous devez entrer votre prénom</p>
        
    </div>
    <div class="contactform__formData">
        <label for="lastname">Nom</label> <br>
        <input type="text" class="contactform__input" id="last" aria-label="Lastname"> <br>
        <p class="contactform__error_last">Vous devez entrer votre nom</p>
    </div>
    <div class="contactform__formData">
        <label for="email_test">Email</label> <br>
        <input type="email" class="contactform__input" id="email" aria-label="Email"> <br>
        <p class="contactform__error_email">Vous devez entrer une adresse email valide</p>
    </div>
    <div class="contactform__formData">
        <label for="message">Votre message</label> <br>
        <textarea type="text" class="contactform__message" id="message" aria-label="Message"></textarea> <br>
        <p class="contactform__error_message">Vous devez entrer un message valide</p>
    </div>
                    <button class="contactform__send" type="submit" aria-label="Send">
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
        const regex = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
        const value = input.value;
        const test = regex.test(value);
        if (test && input.length !== 0) {
            document.querySelector('.contactform__error_message').style.display = "none";
            return true;
        } else {
            document.querySelector('.contactform__error_message').style.display = "flex";
            return false;
        }
    })

    //verification formulaire
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let firstValid = false;
        let lastValid = false;
        let emailValid = false;
        let messageValid = false;

        const regexFirstLastMessage = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regexFirstLastMessage.test(document.getElementById('first').value)) {
            firstValid = true;
        }
        if (regexFirstLastMessage.test(document.getElementById('last').value)) {
            lastValid = true;
        }
        if (regexFirstLastMessage.test(document.getElementById('message').value)) {
            messageValid = true;
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
        if (messageValid == false) {
            document.querySelector('.contactform__error_message').style.display = "flex";
        }
        let formValid = firstValid && lastValid && emailValid && messageValid;
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

//fonctionnalité 'trier par'
const select = document.getElementById('select');
select.addEventListener('change', (e) => {
    var type = e.target.value;
    document.getElementById('images').innerHTML = ``;
    if (type == "popularite") {
        mediasArray.sort((x, y) => {
            return y.likes - x.likes;
        })
    }
    if (type == "date") {
        mediasArray.sort((x, y) => {
            return new Date(x.date) - new Date(y.date);
        })
    }
    if (type == "titre") {
        mediasArray.sort((x, y) => {
            if (x.title.toLowerCase() < y.title.toLowerCase()) {
                return -1;
            }
            if (x.title.toLowerCase() > y.title.toLowerCase()) {
                return 1;
            }
            return 0;
        })
    }
    loadMedias(mediasArray)
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
    mediaSection.setAttribute('display-mobile-media',true);
    mediaSection.setAttribute('display-desktop',true);
    const banner = document.getElementById('banner');
    banner.setAttribute('close-banner-desktop',true);
    //index=null;
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
    const banner=document.getElementById('banner');
    banner.setAttribute('display-mobile', true);
    banner.setAttribute('display-desktop', true);
    banner.removeAttribute('close-banner-desktop');
    mediaSection.removeAttribute('display-mobile-media');
    mediaSection.removeAttribute('display-desktop');
    const media_title = document.getElementById('media_title');
    media_title.innerHTML = ``;
}
/**
 * @description fermeture du formulaire
 */
function closeForm() {
    form.style.display = "none";
}
/**
 * @description ouverture du formulaire
 */
function openForm() {
    form.style.display = "block";
}

/**
 * 
 * @param {*} type navigation (suivant,précedent)
 */
function navigateMedia(type){
    if(type=="next"){
        index++
        //console.log(index);
            const media_title = document.getElementById('media_title');
            if (index > mediasArray.length - 1) {
                console.log("limite atteinte fin");
                index = 0;
                media_title.innerHTML = ``;
                if (mediasArray[index] instanceof Photo) {
                    const url = "../public/medias/" + mediasArray[index].image;
                    mediaTemplate = `
                <img src="${url}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
                } else if (mediasArray[index] instanceof Video) {
                    const url = "../public/medias/" + mediasArray[index].video;
                    mediaTemplate = `
                <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
                }
                media_title.innerHTML += mediaTemplate;
                closemedia.addEventListener('click', closeMedia)
            } else {
                media_title.innerHTML = ``;
                if (mediasArray[index] instanceof Photo) {
                    const url = "../public/medias/" + mediasArray[index].image;
                    mediaTemplate = `
                <img src="${url}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
                } else if (mediasArray[index] instanceof Video) {
                    const url = "../public/medias/" + mediasArray[index].video;
                    mediaTemplate = `
                <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
                }
                media_title.innerHTML += mediaTemplate;
                closemedia.addEventListener('click', closeMedia)
            }
    }else if(type=="previous"){
        index--;
        //console.log(index);
            if (index < 0) {
                console.log("limite atteinte debut");
                index = mediasArray.length-1;
                media_title.innerHTML = ``;
                if (mediasArray[index] instanceof Photo) {
                    const url = "../public/medias/" + mediasArray[index].image;
                    mediaTemplate = `
                <img src="${url}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
                } else if (mediasArray[index] instanceof Video) {
                    const url = "../public/medias/" + mediasArray[index].video;
                    mediaTemplate = `
                <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                <p class="media__title">${mediasArray[index].title}</p>
                `
                }
                media_title.innerHTML += mediaTemplate;
                closemedia.addEventListener('click', closeMedia)
            }else {
                const media_title = document.getElementById('media_title');
                media_title.innerHTML = ``;
                if (mediasArray[index] instanceof Photo) {
                    const url = "../public/medias/" + mediasArray[index].image;
                    mediaTemplate = `
                <img src="${url}" class="media__media">
                <p class="media__title">${mediasArray[index].title}</p>
                `
                } else if (mediasArray[index] instanceof Video) {
                    const url = "../public/medias/" + mediasArray[index].video;
                    mediaTemplate = `
                <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
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
 * @param {*} array affichage des médias
 */
function loadMedias(array){
    var images = document.getElementById('images');
    var banner=document.getElementById('banner');
    images.innerHTML=``;
    banner.innerHTML=``;
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Photo) {
            const imageurl = "../public/medias/" + array[i].image;
            var articleTemplate = `
                        <article class="images__article" aria-label="Media">
                           <img src="${imageurl}" class="images__image" aria-label="Photo" alt="${array[i].title}" data-id="${i}">
                           <div class="images__title_like">
                                <div class="images__title">
                                    ${array[i].title}
                                </div>
                                <div class="images__like">
                                    <div class="images__count">
                                        ${array[i].likes}
                                    </div>
                                    <i class="fas fa-heart images__icon" data-id="${array[i].id}" aria-label="Like"></i>
                                </div>
                            </div>
                            </article>
                           `;
        } else if (array[i] instanceof Video) {
            const videourl = "../public/medias/" + array[i].video;
            var articleTemplate = `
                                           <article class="images__article" aria-label="Media">
                                           <video src="${videourl}" class="images__image" aria-label="Video" title="${array[i].title}" controls="controls" data-id="${i}"></video>
                                              <div class="images__title_like">
                                                   <div class="images__title">
                                                       ${array[i].title}
                                                   </div>
                                                   <div class="images__like">
                                                       <div class="images__count">
                                                           ${array[i].likes}
                                                       </div>
                                                       <i class="fas fa-heart images__icon" data-id="${array[i].id}" aria-label="Like"></i>
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
        //console.log("like");
        const id = e.target.attributes[1].nodeValue;
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
    })
}
    //fonctionnalité média (affichage + navigation + fermeture)
    const medias = document.getElementsByClassName('images__image');
    for (let media of medias) {
        media.addEventListener('click', (e) => {
            openMedia();
            var mediaType = e.target.tagName;
            //obtenir indice du média dans le tableau
            //var i=media.getAttribute("data-id");
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
                //console.log(e);
                const url = "../public/medias/" + mediasArray[index].image;
                const title = e.target.alt;
                mediaTemplate = `
                    <img src="${url}" class="media__media">
                    <p class="media__title">${title}</p>
                `
            } else if (mediaType == "VIDEO") {
                //console.log(e)
                const url = "../public/medias/" + mediasArray[index].video;
                const title = e.target.title;
                mediaTemplate = `
                    <video src="${url}" class="media__media" controls="controls" title="${title}"></video>
                    <p class="media__title">${title}</p>
                `
            }
            media_title.innerHTML += mediaTemplate;
        })
    }
    loadBanner(array)
}

//fermeture média
const closemedia = document.getElementById('closemedia');
closemedia.addEventListener('click', closeMedia,false);
//navigation média suivant
document.getElementById('next').addEventListener('click', (e)=>{navigateMedia('next')},false);
//navigation média précédent
document.getElementById('previous').addEventListener('click', (e)=>{navigateMedia('previous')},false);
//navigation média touches fléchées
document.addEventListener('keydown', (key)=>{
    const value=key.code;
    //console.log(value);
    if(value=="Escape"){
        closeMedia();
    }else if(value=="ArrowLeft"){
        navigateMedia('previous');
    }else if(value=="ArrowRight"){
        navigateMedia('next');
    }
})

getData();