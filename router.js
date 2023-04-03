const express = require("express");
const joi = require("joi");
const AppError = require("./middleware/AppError");
const { INVALID_SUBSCRIPTION } = require("./middleware/errorCodes");
const errorHandler = require("./middleware/app.js");
const { tryCatch } = require("./middleware/tryCatch");
const database= require("./server");
const { PrismaClient } = require('@prisma/client');
const{authpage,authbooks}=require('./middleware/autho');
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./middleware/JWT");
const bcrypt = require("bcrypt");
const Goal = require('./config/goalModel')
const asyncHandler = require('express-async-handler')
const log = require("./index");


const prisma = new PrismaClient();

let router = express.Router();

/* ------------------------------- */
router
  .route("/logs")
    .get(tryCatch(async (req, res ,next) => {
      let {page =1 , size = 10}=req.query;

      const limit = parseInt(size);
      const skip = (page - 1)*size;

      const users =await Goal.find().limit(limit).skip(skip);

      res.send({page , size , data: users})

    }))


/* ------------------------------- */

router
  .route("/register")
  .post(
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      bcrypt.hash(password, 10).then((hash) => {
       
        prisma.Users.create({
          data :{username: username,password: hash,}})
      .then(() => {
        res.status(200).json("USER REGISTERED");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
}))

router
  .route("/login")
  .post(
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const newbooks = await prisma.Users.findMany({where:{username: username }});
    
      if (!newbooks[0]) res.status(400).json({ error: "User Doesn't Exist" });
    
      const dbPassword = newbooks[0].password;
      bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
          res
            .status(400)
            .json({ error: "Wrong Username and Password Combination!" });
        } else {
          const accessToken = createTokens(newbooks[0]);
    
          res.cookie("access-token", accessToken, {
            maxAge: 60 * 60 * 24 * 20 * 6000,
            httpOnly: false,
          });
    
          
          res.json("login sec");
          
        }
      });
    }))


router
  .route("/books")
  .get(validateToken,
    tryCatch(async (req, res) => {
      const newbooks = await prisma.books.findMany()
      console.log(log)
      res.status(200).send(newbooks)
    })
  )
  .post(validateToken,
    tryCatch(async (req, res) => {
      const schema = {
        name: joi.string().min(3).required(),
      };

      const result = joi.valid(req.body.name, schema);
      console.log(result.$_root.isError);

      const newbooks = await prisma.books.create({
      data :{ name : req.body.name }
    });
    res.status(200).send(newbooks);
    })
  );

router
  .route("/books/:id")
  .delete(validateToken,
    tryCatch(async (req, res) => {
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const newbooks = await prisma.books.delete({
        where:{
          id : id
        },
      })
    
      res.status(200).send(newbooks)
    })
  )
  .put(validateToken,
    tryCatch(async (req, res) => {
      
      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const newbooks = await prisma.books.update({
        where:{
          id : id
        },
        data:{
          name : req.body.name
        }
      })
      res.status(200).send(`User UPDATE with ID: ${id}`);
    })
  )
  .get(validateToken,
    tryCatch(async (req, res) => {

      const id = parseInt(req.params.id);
      if (!id) throw new Error("book not found");

      const newbooks = await prisma.books.findMany({
        where:{
          id : id
        },
      })

      res.status(200).send(newbooks)
        })
  );



module.exports = router;
