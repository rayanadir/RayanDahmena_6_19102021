import { MediaFactory, Photo, Video } from '/public/js/models/Media.js';
import Photographer from '/public/js/models/Photographer.js';

var likedMedias = [];

function refreshMedias(array) {
    document.getElementById('images').innerHTML = ``;
    for (var i = 0; i < array.length; i++) {
        if (array[i] instanceof Photo) {
            const imageurl = "/public/medias/" + array[i].image;
            var articleTemplate = `
            <article class="images__article">
           <img src="${imageurl}" class="images__image" alt="${array[i].title}" onclick="showMedia(${imageurl},${array[i].title})">
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
        <video src="${videourl}" class="images__image" controls="controls"></video>
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
    refreshBanner(array);
}

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
var mediasArray = []
var likes = 0;
var price;

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

                for (var i = 0; i < mediasArray.length; i++) {
                    if (mediasArray[i] instanceof Photo) {

                        const imageurl = "/public/medias/" + mediasArray[i].image;
                        var articleTemplate = `
                                    <article class="images__article" >
                                       <img src="${imageurl}" class="images__image" alt="${mediasArray[i].title}" onclick="showMedia(${imageurl},${mediasArray[i].title})">
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
                                                       <video src="${videourl}" class="images__image" controls="controls"></video>
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
            form.style.display = "none"
            const openform=document.getElementById('openform');
            openform.addEventListener('click',(e)=>{
                form.style.display = "block";
            });
            const closeForm=document.getElementById('closeForm');
            closeForm.addEventListener('click', (e)=>{
                form.style.display = "none";
            })
            const first=document.getElementById('first');
            first.addEventListener('blur',function checkFirstandLastName(input, type) {
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
            const last=document.getElementById('last');
            last.addEventListener('blur',function checkFirstandLastName(input, type) {
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
            const email=document.getElementById('email');
            email.addEventListener('blur',function checkEmail(input) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const test = re.test(String(input).toLowerCase());
                return test;
            })
            const message=document.getElementById('message');
            message.addEventListener('blur',function checkMessage(input) {
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
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                let firstValid = false;
                let lastValid = false;
                let emailValid = false;
                let messageValid = false;

                const regexFirstLastMessage = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
                const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(regexFirstLastMessage.test(document.getElementById('first').value)){
                    firstValid=true;
                }
                if(regexFirstLastMessage.test(document.getElementById('last').value)){
                    lastValid=true;
                }
                if(regexFirstLastMessage.test(document.getElementById('message').value)){
                    messageValid=true;
                }
                if(regexEmail.test(document.getElementById('email').value)){
                    emailValid=true;
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

            const items = document.getElementsByClassName('images__icon');
            for(let item of items) {
                //fonctionnalité like
                item.addEventListener('click', (e)=>{
                    const id=e.target.attributes[1].nodeValue;
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
        }
})

//fonctionnalité 'trier par'
const select=document.getElementById('select');
select.addEventListener('change',(e)=>{
    console.log(e.target.value);
    var type=e.target.value;
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
           <img src="${imageurl}" class="images__image" alt="${mediasArray[i].title}" onclick="showMedia(${imageurl},${mediasArray[i].title})">
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
        } else if(mediasArray[i] instanceof Video){
            const videourl = "/public/medias/" + mediasArray[i].video;
            var articleTemplate = `
        <article class="images__article">
        <video src="${videourl}" class="images__image" controls="controls"></video>
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
            for(let item of items) {
                //fonctionnalité like
                item.addEventListener('click', (e)=>{
                    const id=e.target.attributes[1].nodeValue;
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
    }
})

function showMedia(source, title) {
    const mediaSection = document.getElementById('media');
    mediaSection.style.display = "initial";
    mediaSection.style.zIndex = "10";
    mediaSection.innerHTML = `
    <div class="close">
        <i class="fas fa-times" ></i>
    </div>
        <div class="media_img">
            <img src="${source}">
        </div>
    <div class="title">
        ${title}
    </div>
    `
}