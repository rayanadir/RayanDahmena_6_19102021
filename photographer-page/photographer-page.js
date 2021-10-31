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

var filterValue = "Popularité";
var filterTemplate = document.getElementById("filter").innerHTML;

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
                <input type="text" class="contactform__input" id="first" onblur="checkFirstandLastName(this,'firstname')"> 
                <p class="contactform__error_first">Vous devez entrer votre prénom</p>
                
            </div>
            <div class="contactform__formData">
                <label for="lastname">Nom</label> <br>
                <input type="text" class="contactform__input" id="last" onblur="checkFirstandLastName(this,'lastname')"> <br>
                <p class="contactform__error_last">Vous devez entrer votre nom</p>
            </div>
            <div class="contactform__formData">
                <label for="email_test">Email</label> <br>
                <input type="email" class="contactform__input" id="email" onblur="checkEmail(this)"> <br>
                <p class="contactform__error_email">Vous devez entrer votre email</p>
            </div>
            <div class="contactform__formData">
                <label for="message">Votre message</label> <br>
                <textarea type="text" class="contactform__message" id="message" onblur="checkMessage(this)"></textarea> <br>
                <p class="contactform__error_message">Vous devez entrer un message valide</p>
            </div>
                            <button class="contactform__send" type="submit" onclick="checkForm()">
            Envoyer
        </button>
        </form>
        <br>
        
            `
            
        }
    });
    
    document.getElementById("filter").innerHTML=`
    <label for="filter" class="images__filter">
    Trier par
</label>
<button class="images__filter_button" onclick="openFilter()" onblur="closeFilter()">
    <div class="images__value_arrow">
    ${filterValue}
    <i class="fas fa-chevron-down arrow"></i>
    </div>
    <div class="images__values">
    <hr>
    <div class="images__value" id="date" onclick="selectFilter('Date')">
    Date
    </div>
    <hr>
    <div class="images__value" id="title" onclick="selectFilter('Titre')">
    Titre
    </div>
    </div>
</button>
    `
})

function openFilter(){
    const values=document.querySelector('.images__values');
    values.style.display="initial";
    const date=document.getElementById('date');
    const title=document.getElementById('title');
    date.style.display="flex";
    title.style.display="flex";
    console.log("values open : "+values.style)
}

function closeFilter(){
    document.querySelector('.images__values').style.display="none";
}

function selectFilter(filter){
    const values=document.querySelector('.images__values');
    document.getElementById("filter").innerHTML=``;
    console.log("filtre séléctionné : " + filter);
    filterValue=filter;
    document.getElementById("filter").innerHTML=`
    <label for="filter" class="images__filter">
    Trier par
</label>
<button class="images__filter_button" onblur="closeFilter()">
    <div class="images__value_arrow">
    ${filterValue}
    <i class="fas fa-chevron-down arrow"></i>
    </div>
</button>
    `
    console.log("values select : " + values.style)
    return filter;
}


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
    if (test && input.length!==0) {
        if (type === "firstname") {
            document.querySelector('.contactform__error_first').style.display="none";
        }
        if (type === "lastname") {
            document.querySelector('.contactform__error_last').style.display="none";
        }
        return true;
    } else {
        if (type === "firstname") {
            document.querySelector('.contactform__error_first').style.display="flex";
        }
        if (type === "lastname") {
            document.querySelector('.contactform__error_last').style.display="flex";
        }
        return false
    }
}

function checkEmail(input) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const test=re.test(String(input).toLowerCase());
    return test;
}

function checkMessage(input) {
    const regex = /^[a-zA-Z\-éëàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇÆæœ]{2,}$/;
    const value = input.value;
    const test = regex.test(value);
    if (test && input.length!==0) {
        document.querySelector('.contactform__error_message').style.display="none";
        return true;
    } else {
        document.querySelector('.contactform__error_message').style.display="flex";
        return false;
    }
}

function checkForm() {
    const fisrt = document.getElementById('first').value;
    const last = document.getElementById('last').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    let firstValid = false;
    let lastValid = false;
    let emailValid = false;
    let messageValid = false;

    firstValid = checkFirstandLastName(fisrt, 'firstname');
    lastValid = checkFirstandLastName(last, 'lastname');
    emailValid = checkEmail(email);
    messageValid = checkMessage(message);

    if(emailValid==false){
        document.querySelector('.contactform__error_email').style.display="flex";
    }
    if(firstValid==false){
        document.querySelector('.contactform__error_first').style.display="flex";
    }
    if(lastValid==false){
        document.querySelector('.contactform__error_last').style.display="flex";
    }
    if(messageValid==false){
        document.querySelector('.contactform__error_message').style.display="flex";
    }
    let formValid=firstValid && lastValid && emailValid && messageValid;
    return formValid;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (checkForm() == true) {
        console.log("formulaire valide");
        document.querySelector('.contactform__error_email').style.display="none";
        console.log("Prénom : " +document.getElementById('first').value);
        console.log("Nom : " +document.getElementById('last').value);
        console.log("Email : " +document.getElementById('email').value);
        console.log("Message : " +document.getElementById('message').value);
        document.querySelector('form').reset();
    }else{
        console.log("formulaire invalide");
    }
})