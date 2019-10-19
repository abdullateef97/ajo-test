const config  =  {
    mongodb: {
        collections: {
            users: 'users',
            deposits: 'deps'
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
    }
}

module.exports = config