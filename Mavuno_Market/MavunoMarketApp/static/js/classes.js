export class User {  
    uid;
    accesslevel;
    email;
    name;
    location;
    constructor(uid, name, email,accesslevel, location) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.location = location;
        this.accesslevel = accesslevel;
    }
}

export default User;