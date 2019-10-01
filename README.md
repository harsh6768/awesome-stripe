# awesome-stripe
### :heart: Star :heart: the repo to support the project or :smile:[Follow Me](https://github.com/harsh6768).Thanks!

This project contains scenario like uber or other on demand services like Zomato. We will take the Uber example so that we will be able to understand the project.For this project I have created Stripe account https://stripe.com/.

I this scenario We have taken Uber.In this scenario

1. Account created by us will play a roal of Uber platform account
2. Some custom accounts will play a roal of uber drivers 
3. Some custom accounts will play a roal of owners of cabs

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
8. Transfer Amount from Uber platform to uber drivers and the owner using grouping transactions https://stripe.com/docs/connect/charges-transfers
9. Transfer the Amount from Uber Platform to the uber drivers at a time of charge ---> stripe.charges.create() by providing the values into the transfer_data property 
10. Get the details of the Account ---> stripe.accounts.retrieve() 

