const express=require('express');
const stripe=require('stripe')('sk_test_JeJNYOJgTSbVctl3YUvZFbV6');
const bodyParser=require('body-parser');

const routes=require('./Routes/routes');

const app=express();

//BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/',routes);
 

const PORT=process.env.PORT||5000;
app.listen(PORT,console.log(`Server is up on port ${PORT}`));