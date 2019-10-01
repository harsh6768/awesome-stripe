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

let createCustomer=(req,res)=>{

    const {
        card_token_id,
        name,
        email,
        phone,
        description

    }=req.body

    try{

        stripe.customers.create({

            source:card_token_id,
            name,
            email,
            phone,
            description

        })
        .then(customer=>res.send({
            status:200,
            body:customer,
            message:'Customer Created Successfully!'
        }))
        .catch(err=>res.send({
            status:400,
            body:err,
            message:'Error occured!'
        }))

    }catch(err){
        throw boom.boomify();
    }

}

let createCharge=(req,res)=>{

    // console.log(req.body);

    // const {

    //     amount,
    //     currency,
    //     customer_id,
    //     description,
    //     capture

    // }=req.body;


    // try{

    //     stripe.charges.create({
    //         amount,
    //         currency,
    //         source:customer_id,
    //         description,
    //         capture
    //     })
    //     .then(charges=>res.send({

    //         status:200,
    //         body:charges,
    //         message:'Charges created successfully!'
    //     }))
    //     .catch(err=>res.send({
    //         status:400,
    //         body:err,
    //         message:'Error occured!'
    //     }))


    // }catch(err){
    //     throw boom.boomify();
    // }

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

//Grouping transactions
//https://stripe.com/docs/connect/charges-transfers#grouping-transactions-charges
let seperateGroupTransfer=async(req,res)=>{


    //declare transfer_group at a time of charges for group transaction

    // stripe.charges.create({
    //     amount: 10000,
    //     currency: "usd",
    //     source: "tok_visa",
    //     transfer_group: "{ORDER10}",
    // }).then(function(charge) {
    //     // asynchronously called
    // });
  
    console.log(req.body);
    const {

        acc1_amount,
        acc1_currency,
        acc1_destination,
        acc2_amount,
        acc2_currency,
        acc2_destination

    }=req.body;

    let amount1=parseInt(acc1_amount);
    let amount2=parseInt(acc2_amount)
    try{

      let transfer_in_acc1=await stripe.transfers.create({

            amount:amount1,
            currency:acc1_currency,
            destination:acc1_destination,
            transfer_group:'ORDER1'

       })

       let transfer_in_acc2=await stripe.transfers.create({

           amount:amount2,
           currency:acc2_currency,
           destination:acc2_destination
       });

       if(transfer_in_acc1 && transfer_in_acc2){

            res.send({
                status:200,
                body:[transfer_in_acc1,transfer_in_acc2],
                message:'Successfully transfered using seperate transfer to connected account!'
            })
       }else{
           res.send({
               status:400,
               body:'Error occured!'
           })
       }
        

    }catch(err){

        throw boom.boomify();

    }

}
let seperateTransferAtTimeOfCharged=(req,res)=>{

    const {

        amount,
        currency,
        source,
        acc1_id,
        acc2_id,
        application_fee_amount 

    }=req.body;


    console.log(req.body);

    try{

        stripe.charges.create({

            amount,
            currency,
            source,
            application_fee_amount, 
            // on_behalf_of:[acc1_id,acc2_id]
            transfer_data:{ //to transfer the amount using seperate or splitting
                    destination:acc1_id, //acount id of the drivers account
                    amount:250,
            },
        })
        .then(charges=>res.send({

            status:200,
            body:charges,
            message:'Successfully created chareges!'

        }))
        .catch(err=>res.send({
            status:200,
            body:err,
            message:'Error occured!'
        }))


    }catch(err){
        
        throw boom.boomify();
    }

}
module.exports={
    createCardToken,
    createCustomer,
    createCharge,
    createAccountToken,
    createAccount,
    getAccountDetails,
    transferAmount,
    createPayout,
    seperateGroupTransfer,
    seperateTransferAtTimeOfCharged
}
