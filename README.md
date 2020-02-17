# awesome-stripe
### :heart: Star :heart: the repo to support the project or :smile:[Follow Me](https://github.com/harsh6768).Thanks!

This project contains scenario like uber or other on demand services like Zomato. We will take the Uber example so that we will be able to understand the project.For this project I have created Stripe account https://stripe.com/.

I this scenario We have taken Uber.In this scenario

1. Account created by us will play a role of Uber platform account
2. Some custom accounts will play a role of uber drivers 
3. Some custom accounts will play a role of owners of cabs

## Refer Stripe Api documentation for all the methods used to implement this scenario
https://stripe.com/docs/api

Project will have many apis which can be test by using POSTMAN.

1. Create Token For Cards ---> create.tokens.create()

2. Create Customer ---> stripe.customers.create()

3. Create Charge ---> stripe.charges.create()

4. Capture the Charge ---> stripe.capture.create()

5. Refund full or partial funds ---> stripe.refunds.create()

6. Create Token for Accounts ---> stripe.tokens.create()

7. Create Account ---> stripe.accounts.create()

8. Transfer Funds to the destination account ---> stripe.transfers.create()

8. Transfer Amount from Uber platform to uber drivers and the owner using grouping transactions 

https://stripe.com/docs/connect/charges-transfers

9. Transfer the Amount from Uber Platform to the uber drivers at a time of charge ---> stripe.charges.create() by providing the values into the transfer_data property

10. Get the details of the Account ---> stripe.accounts.retrieve() 

Problem Statement:
1. How to charge from the Customer--->
   To Implement This Scenario ,
   1. First of all, we need to create the Stripe and then get the test secret key.
   2. Create Card or Account Token 
   3. Create Customer 
   4. Create Charges from the user 

2. How to capture the amount---> Like We need to have the 300Rs. before paying the money using patym after cab ride.
   1. Create Charges ---> For creating the charges you need to follow the abover steps from Problem statement 1.
      pass the property capture:false so that we can capture the charges after that
   2. Capture the Charges --->
3. How to payout the Driver from Uber Platform Stripe Account
   
   1. Create Transfer by passing the destination
   2. Payout the drivers from stripe account to the bank account
4. How to transfer the funds from Uber Platform to 2 Custom Account in which One custom account play a roal of Driver and        another account will play a roal of owner--> We will use grouping transaction 

  1. Create Charges by passing the one extra property transfer_group and pass unique value in it.
  2. Use create transfer method seperately by specifying trasnfer_group property 
  
5. How to transfer the funds from Uber Platform to Uber drivers at a time of creating charges.
  
  1. Create Charges and pass the destination and the amount in transfer_data property
     
         transfer_data:{ 
                    destination:acc1_id,
                    amount:250,
         }
