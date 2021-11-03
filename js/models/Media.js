export class Media {
    id;
    photographerId;
    title;
    tags;
    likes;
    date;
    price;
    constructor(data) {
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
    image;
    constructor(data) {
        super(data);
        this.image = data.image;
    }
}

export class Video extends Media {
    video;
    constructor(data) {
        super(data);
        this.video = data.video;
    }
}

export class MediaFactory {
    static createMedia(data) {
        if (data.video) {
            return new Video(data);
        } else if (data.image) {
            return new Photo(data);
        }
    }
}