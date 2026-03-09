const express = require('express')
const authMiddleware  = require('../middleware/auth.middleware')
const accountController = require('../controller/account.controller')


const router = express.Router()

/**
 * - POST api/account
 * - create a new account
 * - protected routes
 */

router.post("/", authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * - GET /api/accounts/
 * - get all accounts of logined users
 * - protected route
 */

router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController)

/**
 * - GET /api/accounts/:accountId
 */

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanace)


module.exports = router