module.exports = {
    port: process.env.PORT,
    mongoURI: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    stripeKey: process.env.STRIPE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
}
