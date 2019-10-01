const express=require('express');
const customController=require('../Controller/customController');
const Router=express.Router();
const multipart=require('connect-multiparty'); //for sending the data with the file 
const multipartMiddleware = multipart();

Router.route('/token/account').post(multipartMiddleware,customController.createAccountToken);
Router.route('/token/card').post(multipartMiddleware,customController.createCardToken);

Router.route('/create/account').post(customController.createAccount);
Router.route('/create/customer').post(customController.createCustomer);
Router.route('/create/charge').post(multipartMiddleware,customController.createCharge);


Router.route('/account/get_details/:account_id').get(customController.getAccountDetails);
Router.route('/transfer_amount').post(multipartMiddleware,customController.transferAmount);
Router.route('/create_payout').post(multipartMiddleware,customController.createPayout);

Router.route('/seperate_group_transfer').post(multipartMiddleware,customController.seperateGroupTransfer);
Router.route('/sepereate_transfer_at_time_of_charge').post(multipartMiddleware,customController.seperateTransferAtTimeOfCharged);

module.exports=Router;