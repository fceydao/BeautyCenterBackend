import express from "express";

import { getPosts } from "../controllers/posts.js"

const router = express.Router();

// http://localhost:5002/posts
// GET, POST, DELETE, UPDATE

//getpost dendiği zaman controller devreye giriyor

router.get("/", getPosts);

export default router;