


export default class Post {

    constructor(id,mediaUrl,title,description,privacy,country,city,lat,lng,date,sharesCount,type){
        this.postId = id
        this.mediaUri = mediaUrl
        this.title = title
        this.description = description
        this.privacy = privacy
        this.country = country
        this.city=city
        this.lat = lat
        this.lng  = lng
        this.date = date
        this.sharesCount = sharesCount
        this.type = type
    }
    


    
}