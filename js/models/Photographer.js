export default class Photographer {
    id;
    name;
    city;
    country;
    tags;
    tagline;
    price;
    portrait;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.tags = data.tags;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
    }
    newProfile() {
            document.getElementById("profile").innerHTML = `
            <article class="profile__infos">
            <h1 class="profile__name">
                ${this.name}
            </h1>
            <p class="profile__localisation">
                ${this.city},${this.country}
            </p>
            <p class="profile__description">
                ${this.tagline}
            </p>
            <div class="profile__tags">
                ${this.tags.map((tag) => `<li class="profile__tag"> #${tag}</li>`).join('')}
            </div>
        </article>
        <div class="profile__bouton">
            <button class="profile__contact" onclick="openForm()">
            Contactez-moi
        </button>
        </div>
        <img class="profile__img" src="${this.portrait}">
            `
    }
}