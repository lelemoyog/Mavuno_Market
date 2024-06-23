export class User {
    uid;
    accesslevel;
    email;
    name;
    location;
    about;
    imgUrl;
    phone;
    constructor(uid, name, email,accesslevel, location, about, imgUrl, phone) {
        this.uid = uid;
        this.name = name;
        this.email = email;
        this.location = location;
        this.accesslevel = accesslevel;
        this.imgUrl = imgUrl;
        this.about = about;
        this.phone = phone;
    }
}

//creat a product class
export class Product {
    id;
    name;
    price;
    category;
    description;
    imgUrl;
    sellerId;
    availabilityWindowStart;
    availabilityWindowEnd;
    amountAvailable;
    constructor(id, name, price, category, description, imgUrl, sellerId, availabilityWindowStart, availabilityWindowEnd, amountAvailable) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.description = description;
        this.imgUrl = imgUrl;
        this.sellerId = sellerId;
        this.availabilityWindowStart = availabilityWindowStart;
        this.availabilityWindowEnd = availabilityWindowEnd;
        this.amountAvailable = amountAvailable;
    }
}



export default User;
