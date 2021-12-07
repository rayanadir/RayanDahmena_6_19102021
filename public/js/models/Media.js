export class Media {
    //initialisation champs média
    id;
    photographerId;
    title;
    tags;
    likes;
    date;
    price;


    constructor(data) {
        //déclaration média
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.tags = data.tags;
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }
}

export class Photo extends Media {
    //initialisation champ image
    image;
    constructor(data) {
        //déclaration média photo
        super(data);
        this.image = data.image;
    }
}

export class Video extends Media {
    //initialisation champ vidéo
    video;
    constructor(data) {
        //déclaration média vidéo
        super(data);
        this.video = data.video;
    }
}

export class MediaFactory {
    //méthode de création d'un média
    static createMedia(data) {
        if (data.video) {
            return new Video(data);
        } else if (data.image) {
            return new Photo(data);
        }
    }
}