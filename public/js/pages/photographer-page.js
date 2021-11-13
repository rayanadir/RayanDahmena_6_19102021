import { MediaFactory, Photo, Video } from '/public/js/models/Media.js';
import Photographer from '/public/js/models/Photographer.js';


const form = document.querySelector(".contactform");
form.style.display = "none";


//actualiser médias
function refreshMedias(array) {
    document.getElementById('images').innerHTML = ``;
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Photo) {
            const imageurl = "/public/medias/" + array[i].image;
            var articleTemplate = `
            <article class="images__article">
           <img src="${imageurl}" class="images__image" alt="${array[i].title}" data-id="${imageurl}">
           <div class="images__title_like">
                <div class="images__title">
                    ${array[i].title}
                </div>
                <div class="images__like">
                    <div class="images__count">
                        ${array[i].likes}
                    </div>
                    <i class="fas fa-heart images__icon" data-id="${array[i].id}"></i>
                </div>
            </div>
            </article>
           `;
        } else if (array[i] instanceof Video) {
            const videourl = "/public/medias/" + array[i].video;
            var articleTemplate = `
        <article class="images__article">
        <video src="${videourl}" class="images__image" title="${array[i].title}" controls="controls" data-id="${videourl}"></video>
           <div class="images__title_like">
                <div class="images__title">
                    ${array[i].title}
                </div>
                <div class="images__like">
                    <div class="images__count">
                        ${array[i].likes}
                    </div>
                    <i class="fas fa-heart images__icon" data-id="${array[i].id}"></i>
                </div>
            </div>
            </article>
           `;
        }
        document.getElementById('images').innerHTML += articleTemplate;
    }
    const items = document.getElementsByClassName('images__icon');
    for (let item of items) {
        //fonctionnalité like
        item.addEventListener('click', (e) => {
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
            refreshMedias(mediasArray);
        })
    }
    const medias = document.getElementsByClassName('images__image');
    for (let media of medias) {
        media.addEventListener('click', (e) => {
            const mediaSection = document.getElementById('media');
            const mediaType = e.target.tagName;
            document.getElementById('profile').style.display = "none";
            document.getElementById('imagesSection').style.display = "none";
            document.getElementById('banner').style.display = "none";
            document.getElementById('contact').style.display = "none";
            document.getElementById('header').style.display = "none";
            mediaSection.style.display = "flex";
            if (mediaType == "IMG") {
                const url = e.target.attributes[3].nodeValue;
                const title = e.target.alt;
                var template = `
                    <i class="fas fa-times media__close_icon" id="closemedia"></i>
                    <div class="media__media_icons">
                    <i class="fas fa-chevron-left media__icon"></i>
                        <div class="media__media_title">
                            <img src="${url}" class="media__media">
                            <p class="media__title">${title}</p>
                        </div>
                    <i class="fas fa-chevron-right media__icon"></i>
                    </div>
                    `
            } else if (mediaType == "VIDEO") {
                console.log(e);
                const url = e.target.dataset.id;
                const title = e.target.title;
                var template = `
                    <i class="fas fa-times media__close_icon" id="closemedia"></i>
                    <div class="media__media_icons">
                    <i class="fas fa-chevron-left media__icon"></i>
                        <div class="media__media_title">
                            <video src="${url}" class="media__media" controls="controls" title="${title}"></video>
                            <p class="media__title">${title}</p>
                        </div>
                    <i class="fas fa-chevron-right media__icon"></i>
                    </div>
                    `
            }

            mediaSection.innerHTML += template;
            const closemedia = document.getElementById('closemedia');
            closemedia.addEventListener('click', (e) => {
                const mediaSection = document.getElementById('media');
                mediaSection.innerHTML = ``;
                mediaSection.style.display = "none";
                document.getElementById('profile').style.display = "flex";
                document.getElementById('imagesSection').style.display = "initial";
                document.getElementById('banner').style.display = "flex";
                document.getElementById('contact').style.display = "none";
                document.getElementById('header').style.display = "flex";
            })
        })
    }
    refreshBanner(array);
}
//actualiser bannière
function refreshBanner(array) {
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

var likedMedias = [];
var mediasArray = [];
var likes = 0;
var price;
var index;
var mediaTemplate;

fetch('/public/datas/photographers.json')
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
                var images = document.getElementById('images');
                var i;

                //chargement médias
                for (var i = 0; i < mediasArray.length; i++) {
                    if (mediasArray[i] instanceof Photo) {

                        const imageurl = "/public/medias/" + mediasArray[i].image;
                        var articleTemplate = `
                                    <article class="images__article">
                                       <img src="${imageurl}" class="images__image" alt="${mediasArray[i].title}" data-id="${imageurl}">
                                       <div class="images__title_like">
                                            <div class="images__title">
                                                ${mediasArray[i].title}
                                            </div>
                                            <div class="images__like">
                                                <div class="images__count">
                                                    ${mediasArray[i].likes}
                                                </div>
                                                <i class="fas fa-heart images__icon" data-id="${mediasArray[i]}"></i>
                                            </div>
                                        </div>
                                        </article>
                                       `;
                    } else if (mediasArray[i] instanceof Video) {
                        const videourl = "/public/medias/" + mediasArray[i].video;
                        var articleTemplate = `
                                                       <article class="images__article">
                                                       <video src="${videourl}" class="images__image" title="${mediasArray[i].title}" controls="controls" data-id="${videourl}"></video>
                                                          <div class="images__title_like">
                                                               <div class="images__title">
                                                                   ${mediasArray[i].title}
                                                               </div>
                                                               <div class="images__like">
                                                                   <div class="images__count">
                                                                       ${mediasArray[i].likes}
                                                                   </div>
                                                                   <i class="fas fa-heart images__icon" data-id="${mediasArray[i].id}"></i>
                                                               </div>
                                                           </div>
                                                           </article>
                                                          `;
                    }
                    images.innerHTML += articleTemplate;
                }
                //bannière
                document.getElementById('banner').innerHTML = `
            <div class="banner__likes">
            <div class="banner__count">
                ${likes}
            </div>
            <i class="fas fa-heart banner__icon"></i>
        </div>
        <div class="banner__price">
            ${photographer.price}€ / jour
        </div> 
            `
                    //profil photographe
                document.getElementById("profile").innerHTML = `
            <article class="profile__infos">
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
                ${photographer.tags.map((tag) => `<li class="profile__tag"> #${tag}</li>`).join('')}
            </div>
        </article>
        <div class="profile__bouton">
            <button class="profile__contact" id="openform">
            Contactez-moi
        </button>
        </div>

        <img class="profile__img" src="/public/medias/${photographer.portrait}">
            `
                //formulaire
            document.getElementById("contact").innerHTML = `
            <div class="contactform__contact_close">
            <h1 class="contactform__contactMe">Contactez-moi</h1>
            <button class="contactform__close" id="closeForm">
                 <i class="fas fa-times contactform__icon" ></i>
            </button>
        </div>

        <h1 class="contactform__contactMe">${photographer.name}</h1>
        </div>
        <form method="get" name="reserve" action="photographer-page.html" >
            <div class="contactform__formData">
                <label for="firstname">Prénom</label> <br>
                <input type="text" class="contactform__input" id="first"> 
                <p class="contactform__error_first">Vous devez entrer votre prénom</p>
                
            </div>
            <div class="contactform__formData">
                <label for="lastname">Nom</label> <br>
                <input type="text" class="contactform__input" id="last"> <br>
                <p class="contactform__error_last">Vous devez entrer votre nom</p>
            </div>
            <div class="contactform__formData">
                <label for="email_test">Email</label> <br>
                <input type="email" class="contactform__input" id="email"> <br>
                <p class="contactform__error_email">Vous devez entrer une adresse email valide</p>
            </div>
            <div class="contactform__formData">
                <label for="message">Votre message</label> <br>
                <textarea type="text" class="contactform__message" id="message"></textarea> <br>
                <p class="contactform__error_message">Vous devez entrer un message valide</p>
            </div>
                            <button class="contactform__send" type="submit">
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
            closeform.addEventListener('click', closeForm)

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
            form.addEventListener("submit", function (event) {
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
                    console.log("formulaire valide");
                    document.querySelector('.contactform__error_email').style.display = "none";
                    console.log("Prénom : " + document.getElementById('first').value);
                    console.log("Nom : " + document.getElementById('last').value);
                    console.log("Email : " + document.getElementById('email').value);
                    console.log("Message : " + document.getElementById('message').value);
                    document.querySelector('form').reset();
                } else {
                    console.log("formulaire invalide");
                }
            })

            //fonctionnalité like média
            const items = document.getElementsByClassName('images__icon');
            for (let item of items) {
                //fonctionnalité like
                item.addEventListener('click', (e) => {
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
                    refreshMedias(mediasArray);
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
                                console.log(index);
                            }
                        } else if (media instanceof Video) {
                            const title = e.target.title;
                            if (media.title == title) {
                                index = i;
                                console.log(index);
                            }
                        }
                    })
                    //affichage média séléctionné
                    if (mediaType == "IMG") {
                        const url = e.target.attributes[3].nodeValue;
                        const title = e.target.alt;
                        mediaTemplate = `
                            <img src="${url}" class="media__media">
                            <p class="media__title">${title}</p>
                        `
                    } else if (mediaType == "VIDEO") {
                        //console.log(e);
                        const url = e.target.dataset.id;
                        const title = e.target.title;
                        mediaTemplate = `
                            <video src="${url}" class="media__media" controls="controls" title="${title}"></video>
                            <p class="media__title">${title}</p>
                        `
                    }
                    media_title.innerHTML += mediaTemplate;

                    //fermeture média
                    const closemedia = document.getElementById('closemedia');
                    closemedia.addEventListener('click', closeMedia)

                    //navigation média suivant
                    document.getElementById('next').addEventListener('click', (e) => {
                        index = index + 1;
                        const media_title = document.getElementById('media_title');
                        if (index > mediasArray.length - 1) {
                            console.log("limite atteinte fin");
                            index = 0;
                            media_title.innerHTML = ``;
                            if (mediasArray[index] instanceof Photo) {
                                const url = "/public/medias/" + mediasArray[index].image;
                                mediaTemplate = `
                            <img src="${url}" class="media__media">
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            } else if (mediasArray[index] instanceof Video) {
                                const url = "/public/medias/" + mediasArray[index].video;
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
                                const url = "/public/medias/" + mediasArray[index].image;
                                mediaTemplate = `
                            <img src="${url}" class="media__media">
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            } else if (mediasArray[index] instanceof Video) {
                                const url = "/public/medias/" + mediasArray[index].video;
                                mediaTemplate = `
                            <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            }
                            media_title.innerHTML += mediaTemplate;
                            closemedia.addEventListener('click', closeMedia)
                        }
                        //closemedia.addEventListener('click', closeMedia)
                    })
                    //navigation média précédent
                    document.getElementById('previous').addEventListener('click', (e) => {
                        index = index - 1;
                        if (index < 0) {
                            console.log("limite atteinte debut");
                            index = mediasArray.length-1;
                            media_title.innerHTML = ``;
                            if (mediasArray[index] instanceof Photo) {
                                const url = "/public/medias/" + mediasArray[index].image;
                                mediaTemplate = `
                            <img src="${url}" class="media__media">
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            } else if (mediasArray[index] instanceof Video) {
                                const url = "/public/medias/" + mediasArray[index].video;
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
                                const url = "/public/medias/" + mediasArray[index].image;
                                mediaTemplate = `
                            <img src="${url}" class="media__media">
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            } else if (mediasArray[index] instanceof Video) {
                                const url = "/public/medias/" + mediasArray[index].video;
                                mediaTemplate = `
                            <video src="${url}" class="media__media" controls="controls" title="${mediasArray[index].title}"></video>
                            <p class="media__title">${mediasArray[index].title}</p>
                            `
                            }
                            media_title.innerHTML += mediaTemplate;
                            closemedia.addEventListener('click', closeMedia)
                        }
                    })
                })
            }
        }
    })

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
    for (var i = 0; i < mediasArray.length; i++) {
        if (mediasArray[i] instanceof Photo) {
            const imageurl = "/public/medias/" + mediasArray[i].image;
            var articleTemplate = `
        <article class="images__article">
           <img src="${imageurl}" class="images__image" alt="${mediasArray[i].title}" data-id="${imageurl}">
           <div class="images__title_like">
                <div class="images__title">
                    ${mediasArray[i].title}
                </div>
                <div class="images__like">
                    <div class="images__count">
                        ${mediasArray[i].likes}
                    </div>
                    <i class="fas fa-heart images__icon" data-id="${mediasArray[i].id}"></i>
                </div>
            </div>
            </article>
           `;
        } else if (mediasArray[i] instanceof Video) {
            const videourl = "/public/medias/" + mediasArray[i].video;
            var articleTemplate = `
        <article class="images__article">
        <video src="${videourl}" class="images__image" title="${mediasArray[i].title}" controls="controls" data-id="${videourl}"></video>
           <div class="images__title_like">
                <div class="images__title">
                    ${mediasArray[i].title}
                </div>
                <div class="images__like">
                    <div class="images__count">
                        ${mediasArray[i].likes}
                    </div>
                    <i class="fas fa-heart images__icon" data-id="${mediasArray[i].id}"></i>
                </div>
            </div>
            </article>
           `;
        }
        document.getElementById('images').innerHTML += articleTemplate;
        const items = document.getElementsByClassName('images__icon');
        for (let item of items) {
            //fonctionnalité like
            item.addEventListener('click', (e) => {
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
                refreshMedias(mediasArray);
            })
        }
        const medias = document.getElementsByClassName('images__image');
        for (let media of medias) {
            media.addEventListener('click', (e) => {
                const mediaSection = document.getElementById('media');
                const mediaType = e.target.tagName;
                document.getElementById('profile').style.display = "none";
                document.getElementById('imagesSection').style.display = "none";
                document.getElementById('banner').style.display = "none";
                document.getElementById('contact').style.display = "none";
                document.getElementById('header').style.display = "none";
                mediaSection.style.display = "flex";
                if (mediaType == "IMG") {
                    const url = e.target.attributes[3].nodeValue;
                    const title = e.target.alt;
                    var template = `
                    <i class="fas fa-times media__close_icon" id="closemedia"></i>
                    <div class="media__media_icons">
                    <i class="fas fa-chevron-left media__icon"></i>
                        <div class="media__media_title">
                            <img src="${url}" class="media__media">
                            <p class="media__title">${title}</p>
                        </div>
                    <i class="fas fa-chevron-right media__icon"></i>
                    </div>
                    `
                } else if (mediaType == "VIDEO") {
                    console.log(e);
                    const url = e.target.dataset.id;
                    const title = e.target.title;
                    var template = `
                    <i class="fas fa-times media__close_icon" id="closemedia"></i>
                    <div class="media__media_icons">
                    <i class="fas fa-chevron-left media__icon"></i>
                        <div class="media__media_title">
                            <video src="${url}" class="media__media" controls="controls" title="${title}"></video>
                            <p class="media__title">${title}</p>
                        </div>
                    <i class="fas fa-chevron-right media__icon"></i>
                    </div>
                    `
                }

                mediaSection.innerHTML += template;
                const closemedia = document.getElementById('closemedia');
                closemedia.addEventListener('click', (e) => {
                    const mediaSection = document.getElementById('media');
                    mediaSection.innerHTML = ``;
                    mediaSection.style.display = "none";
                    document.getElementById('profile').style.display = "flex";
                    document.getElementById('imagesSection').style.display = "initial";
                    document.getElementById('banner').style.display = "flex";
                    document.getElementById('contact').style.display = "none";
                    document.getElementById('header').style.display = "flex";
                })
            })
        }
    }
})

//ouvrir media
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
}
//fermer media
function closeMedia() {
    const mediaSection = document.getElementById('media');
    const media_title = document.getElementById('media_title');
    media_title.innerHTML = ``;
    document.getElementById('profile').style.display = "flex";
    document.getElementById('imagesSection').style.display = "block";
    document.getElementById('contact').style.display = "none";
    document.getElementById('header').style.display = "flex";
    index = null;
    const banner=document.getElementById('banner');
    banner.setAttribute('display-mobile', true);
    banner.setAttribute('display-desktop', true);
    banner.removeAttribute('close-banner-desktop');
    mediaSection.removeAttribute('display-mobile-media')
    mediaSection.removeAttribute('display-desktop')
}
//fermer formulaire
function closeForm() {
    form.style.display = "none";
}
//fermer formulaire
function openForm() {
    form.style.display = "block";
}