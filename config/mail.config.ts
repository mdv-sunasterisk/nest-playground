export default () => ({
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUsername: process.env.MAIL_USERNAME,
    mailPassword: process.env.MAIL_PASSWORD,
    mailSecure: process.env.MAIL_SECURE == 'true',
    mailFrom: process.env.MAIL_FROM
})