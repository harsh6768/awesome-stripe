const keys=require('../Config/keys');
const stripe=require('stripe')(keys.stripe.secret_Key);
const boom=require('boom');  //for handling http errors
const BlueBird=require('bluebird');
const fs = BlueBird.promisifyAll(require("fs"));

let createCardToken=(req,res)=>{

    const {

        number,
        exp_month,
        exp_year,
        cvc,
        name,
        address_line1,
        address_line2,
        address_zip,
        address_city,
        address_state,
        address_country

    }=req.body


    try{
   
        stripe.tokens.create({

            card:{
                number,
                exp_month,
                exp_year,
                cvc,
                name,
                address_line1,
                address_line2,
                address_city,
                address_zip,
                address_state,
                address_country
            }
        
        })
        .then(token=>res.send({
            status:200,
            body:token,
            message:'Card token generated Successfully!'
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured'
        }))

    }catch(err){
        throw boom.boomify();

    }

}
let createAccountToken=(req,res)=>{

    console.log(req.body)
    const {

        business_type,
        business_name,
        line1,
        line2,
        city,
        state,
        postal_code,
        first_name,
        last_name,
        dob,
        email,
        gender,
        phone
        
    }=req.body;

    const {
        file
    }=req.files

    

    const userDob=dob.split('/')||dob.split('-');
    const day=userDob[0];
    const month=userDob[1];
    const year=userDob[2];

    try{

        console.log(file)
        //to read the file from the upload file
         // fs.readFile(file.path)
        //   .then(data=>stripe.files.create({

        //     puspose:'identity_document',
        //     file:{

        //         data,
        //         name:file.originalFilename,
        //         type:'application/octet-stream'
                
        //     }
        //   }))
        //   .then(file=>res.send({

        //     body:file,
        //     message:'file created'

        //   }))

         

       stripe.tokens.create({

            account:{
                [business_type]:{   //[business_type] for creating the dynamic key 

                    address:{
                        line1,
                        line2,
                        city,
                        state,
                        postal_code
                    },
                    first_name,
                    last_name,
                    dob:{
                        day,
                        month,
                        year
                    },
                    email,
                    phone,
                    gender

                },
                tos_shown_and_accepted:true
            }
            
        })
        .then(accountToken=>res.send({
            status:200,
            body:accountToken,
            message:'Account Token created successfully'
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured'
        }))

    }catch(err){
       throw boom.boomify();
    }
    
}

let createAccount=(req,res)=>{

    const {
        account_token
    }=req.body;

    try{

        stripe.accounts.create({

            type:'custom',
            account_token,
            requested_capabilities:['card_payments','transfers']

        })
        .then(account=>res.send({
            status:200,
            body:account,
            message:'Account created Successfully!'
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured'
        }))

    }catch(err){
        throw boom.boomify();
    }
}
let getAccountDetails=(req,res)=>{

    const account_id=req.params.account_id;

    try{

        //to get the account details
        stripe.accounts.retrieve(account_id)
        .then(account=>res.send({
            status:200,
            body:account,
            
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured'
        }))

    }catch(err){
        throw boom.boomify();
    }
}
//transfer the funds
let transferAmount=(req,res)=>{

    const {

        amount,
        currency,
        destination  //destination is the account id where we need to send the funds
        
    }=req.body

    try{
        //transfer the funds
        stripe.transfers.create({

            amount,
            currency,
            destination 

        })
        .then(transfer=>res.send({
            status:200,
            body:transfer,
            message:'Successfully transfered!'
        }))
        .catch(err=>res.send({
            status:200,
            body:err,
            message:'Error occured'
        }))


    }catch(err){
        throw boom.boomify();

    }

}
//create payout 
let createPayout=(req,res)=>{


    console.log(req.body);

    const {
        amount,
        currency,
        source_type,
        bank_acount_id,
        stripe_account
    }=req.body;

    try{

        stripe.payouts.create({
            amount,
            currency,
            // source_type:source_type,
            // destination:bank_acount_id
        },
        {
            stripe_account:stripe_account, //stripe account id of custom user
        })
        .then(payouts=>res.send({
            status:200,
            body:payouts,
            message:'Successfully created payouts'
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured'
        }))


    }catch(err){

        throw boom.boomify();

    }

}
module.exports={
    createCardToken,
    createAccountToken,
    createAccount,
    getAccountDetails,
    transferAmount,
    createPayout
}
