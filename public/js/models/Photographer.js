export default class Photographer {
    //initialisation champs photographe
    id;
    name;
    city;
    country;
    tags;
    tagline;
    price;
    portrait;

    constructor(data) {
        //déclaration photographe
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.tags = data.tags;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
    }

}