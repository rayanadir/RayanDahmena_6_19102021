function getPhotographerFolderName(str) {
    let spaceIndex = str.indexOf(' ');
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
};

function getSource(image, video) {
    if (image === null || image === undefined) {
        console.log(".mp4");
        return "video";
    }
    if (video === null || video === undefined) {
        console.log(".jpg");
        return "image";
    }
}

var likedMedias = [];

function likeMedia(id, number) {
    if (likedMedias.indexOf(id) == -1) {
        likedMedias.push(id);
        console.log(likedMedias);
        number = number + 1;
    } else {
        likedMedias.splice(id, 1);
        number = number - 1;
    }
    return number;
}

fetch('../photographers.json').then(res => {
        return res.json();
    }).then(data => {
            const photographers = data.photographers;
            const url = window.location.search;
            const id = url.split('id=')[1];
            console.log(id);
            photographers.map(photographer => {
                        if (photographer.id == id) {
                            const medias = data.media;
                            var likes = 0;
                            var images = document.getElementById('images');
                            var i;
                            for (i = 0; i < medias.length; i++) {
                                if (medias[i].photographerId == id) {
                                    likes = likes + medias[i].likes;
                                    const photographer_folder = getPhotographerFolderName(photographer.name);

                                    if (getSource(medias[i].image, medias[i].video) == "image") {
                                        const imageurl = "/FishEye_Photos/Sample Photos/" + photographer_folder + "/" + medias[i].image;
                                        var articleTemplate = `
                                    <article class="images__article">
                                       <img src="${imageurl}" class="images__image" alt="image">
                                       <div class="images__title_like">
                                            <div class="images__title">
                                                ${medias[i].title}
                                            </div>
                                            <div class="images__like">
                                                <div class="images__count">
                                                    ${medias[i].likes}
                                                </div>
                                                <i class="fas fa-heart images__icon" onclick="likeMedia(${medias[i].id},${medias[i].likes})"></i>
                                            </div>
                                        </div>
                                        </article>
                                       `;
                                        images.insertAdjacentHTML('beforeend', articleTemplate);
                                    } else {
                                        const videourl = "/FishEye_Photos/Sample Photos/" + photographer_folder + "/" + medias[i].video;
                                        var articleTemplate = `
                                    <article class="images__article">
                                    <video src="${videourl}" class="images__image" controls="controls"></video>
                                       <div class="images__title_like">
                                            <div class="images__title">
                                                ${medias[i].title}
                                            </div>
                                            <div class="images__like">
                                                <div class="images__count">
                                                    ${medias[i].likes}
                                                </div>
                                                <i class="fas fa-heart images__icon"></i>
                                            </div>
                                        </div>
                                        </article>
                                       `;
                                        images.insertAdjacentHTML('beforeend', articleTemplate);
                                    };

                                }

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
                ${photographer.tags.map((tag)=>`<li class="profile__tag"> #${tag}</li>`).join('')}
            </div>
        </article>
        <div class="profile__bouton">
            <button class="profile__contact" onclick="openForm()">
            Contactez-moi
        </button>
        </div>

        <img class="profile__img" src="${photographer.portrait}">
            `
            document.getElementById("contact").innerHTML=`
            <div class="contactform__contact_close">
            <h1 class="contactform__contactMe">Contactez-moi</h1>
            <button class="contactform__close" onclick="closeForm()">
                 <i class="fas fa-times contactform__icon" ></i>
            </button>
        </div>

        <h1 class="contactform__contactMe">${photographer.name}</h1>
        </div>
        <form method="get" name="reserve" action="photographer-page.html" onsubmit="return checkForm();">
            <div class="contactform__formData">
                <label for="firstname">Prénom</label> <br>
                <input type="text" class="contactform__input" id="first" onblur="checkFirstandLastName(this,'firstname')"> <br>
            </div>
            <div class="contactform__formData">
                <label for="lastname">Nom</label> <br>
                <input type="text" class="contactform__input" id="last" onblur="checkFirstandLastName(this,'lastname')"> <br>
            </div>
            <div class="contactform__formData">
                <label for="email">Email</label> <br>
                <input type="text" class="contactform__input" id="email" onblur="checkEmail(this)"> <br>
            </div>
            <div class="contactform__formData">
                <label for="message">Votre message</label> <br>
                <textarea type="text" class="contactform__message" id="message" onblur="checkMessage(this)"></textarea> <br>
            </div>

        </form>
        <br>
        <button class="contactform__send" type="submit">
            Envoyer
        </button>
            `
            
        }
    })
})

const form = document.querySelector(".contactform");

form.style.display = "none"

function openForm() {
    form.style.display = "block";
}

function closeForm() {
    form.style.display = "none";
}

function checkFirstandLastName(input, type) {
    const regex = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
    const value = input.value;
    const test = regex.test(value);
    console.log(test)
    if (test) {
        input.parentElement.removeAttribute('error');
        return true;
    } else {
        if (type === "firstname") {
            input.parentElement.setAttribute('error', 'Vous devez entrer votre prénom');
        }
        if (type === "lastname") {
            input.parentElement.setAttribute('error', 'Vous devez entrer votre nom');
        }
        return false
    }
}

function checkEmail(input) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const value = input.value;
    const test = regex.test(value);
    if (test) {
        input.parentElement.removeAttribute('error');
        return true;
    } else {
        input.parentElement.setAttribute('error', 'Vous devez entrer une adresse email valide');
        return false;
    }
}

function checkMessage(input) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const value = input.value;
    const test = regex.test(value);
    if (test) {
        input.parentElement.removeAttribute('error');
        return true;
    } else {
        input.parentElement.setAttribute('error', 'Vous devez entrer un message');
        return false;
    }
}

function checkForm() {
    const fisrt = document.getElementById('first');
    const last = document.getElementById('last');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let firstValid = false;
    let lastValid = false;
    let emailValid = false;
    let messageValid = false;

    firstValid = checkFirstandLastName(fisrt, 'firstname');
    lastValid = checkFirstandLastName(last, 'lastname');
    emailValid = checkEmail(email);
    messageValid = checkMessage(message);

    console.log(firstValid + lastValid + emailValid + messageValid)

    return firstValid && lastValid && emailValid && messageValid;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("formulaire test")
    if (checkForm() == true) {
        console.log("formulaire valide")
    }
})