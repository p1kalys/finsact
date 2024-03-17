# Basic Transaction Management App

## How to Run the App.

- Clone the repository
  ### Backend
  - Replace the MONGO_URL in db.js
  - Open the terminal
  - Run these commands
    * `cd backend`
    * `npm i`
    * `node index.js`
  ### Frontend
  - Open another terminal
  - Run the commands
    * `cd frontend`
    * `npm start`

## Routes for Backend
- SignUp - `http://localhost:3000/api/v1/user/signup`
- SignIn - `http://localhost:3000/api/v1/user/signin`
- Update the user - `http://localhost:3000/api/v1/user/update`
- Get the list of users - `http://localhost:3000/api/v1/user/bulk`
- Get a user with id - `http://localhost:3000/api/v1/user/bulk/?filter={id}`
- Account Balance - `http://localhost:3000/api/v1/account/balance`
- Transfer the cash - `http://localhost:3000/api/v1/account/transfer`



