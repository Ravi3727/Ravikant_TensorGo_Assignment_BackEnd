# SaaS Plan with Stripe Integration

A SaaS plan with “Basic”, “Standard” and “Plus” where users can browse and make purchases using the Stripe payment gateway. 

## License

This project is licensed under the MIT License.

## Author

Ravi

## Installation

1. Clone the repository:
   ```git clone <repository_url>```
   
Navigate into the project directory:  
    ```cd Backend```

Install the dependencies:
``` npm install```

## Dependencies
### This project uses the following dependencies:

bcrypt: A library to hash and compare passwords. 
cookie-parser: A middleware to parse cookies. 
cors: Middleware to enable cross-origin requests. 
dotenv: Loads environment variables from a .env file. 
express: Web framework for Node.js. 
jsonwebtoken: A library to sign and verify JSON Web Tokens (JWT). 
mongoose: MongoDB object modeling for Node.js. 
nodemailer: A module to send emails. 
stripe: Library for integrating Stripe payment gateway. 

### Environment Variables  
STRIPE_SECRET_KEY= Visit here to create your own secret key ```https://dashboard.stripe.com``` 
STRIPE_PUBLISHABLE_KEY= Visit here to create your own public key ```https://dashboard.stripe.com```  

MONGODB_URI= MogoDB URL  
STRIPE_WEBHOOK_SECRET= Webhook seceret key, create it through Strip CLI ```https://docs.stripe.com/webhooks/quickstart```  
SERVER_URL=http://localhost:3000 

PORT=3000 
CORS_ORIGIN= allow endpoints to interact with your server  
ACCESS_TOKEN_SECRET=   
ACCESS_TOKEN_EXPIRE=  
REFRESH_TOKEN_SECRET=  
REFRESH_TOKEN_EXPIRE=  
FRONTEND_URL=http://localhost:5173  

### Development Dependencies 
nodemon: A utility to automatically restart the Node.js application when file changes are detected. 
Configuration 
Make sure to create a .env file to store environment-specific configurations like secret keys, database credentials, and other sensitive information. 


### Usage 
Once the setup is complete, run the application using: 

``` npm run dev ``` 
