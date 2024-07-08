import mongoose from "mongoose";

// veri tabanındaki dokümanın ne yapıda olacağını, tiplerini belirtiyor
const postSchema = mongoose.Schema({
    title: String,
    subtitle: String,
    content: String,
    tag: String,
    image: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },

});

const Post = mongoose.model("Post", postSchema);

export default Post;

//databasede kaydedeceğimiz şeylerin hepsi birer post