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