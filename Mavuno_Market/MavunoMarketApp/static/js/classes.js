export class User {  
    uid;
    accesslevel;
    email;
    name;
    location;
    about;
    imgUrl;
    constructor(uid, name, email,accesslevel, location, about, imgUrl) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.location = location;
        this.accesslevel = accesslevel;
        this.imgUrl = imgUrl;
        this.about = about
    }
}

export default User;