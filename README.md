# Project - two

- REST API with full CRUD functionality and stores data in an array in the memory with **NodeJs** **,Prisma** **,MongoDB**.
- ## NPM packages
   - **Express** : framework for Node.js.
   - **Joi**
   - **Prisma**
   - **MongoDB**

## APIs endpoints :

### Login & Register Postman

- Post Login : http://localhost:5432/api/login [{You Should Send In Body username & password}] 
- Post Register : http://localhost:5432/api/register [{You Should Send In Body username & password}]

### Endpoints Postman

- Get All Books : http://localhost:5432/api/books [{You Should login befor}]
- Get A Single Book : http://localhost:5432/api/books/:id [{You Should login befor}]
- Creat A Book : http://localhost:5432/api/books [{You Should login befor}]
- Update A Book :http://localhost:5432/api/books/:id [{You Should login befor}]
- Delete A Book : http://localhost:5432/api/books/:id [{You Should login befor}]