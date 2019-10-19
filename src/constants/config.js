const config  =  {
    mongodb: {
        collections: {
            users: 'users',
            deposits: 'deps',
            transfers: 'trans'
        },
        query_limit: 15
    },
    status: {
        SUCCESSFUL: 0,
        FAILED: 1,
        REJECTED: 2,
        PENDING: 4
    },
    paystack: {
        secret_key: process.env.PAYSTACK_SECRET
    },
    kudiSms: {
        user: process.env.QUICK_SMS_USER,
        password: process.env.QUICK_SMS_PASS,
        messageSender: 'AJOCARD - TEST'
    }
}

module.exports = config