import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  AUTHOR: process.env.AUTHOR,
  JWT_SECRET: process.env.JWT_SECRET,

  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,

  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL_USERNAME: process.env.EMAIL_USERNAME,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_TYPE: process.env.SMTP_TYPE,
  SMTP_PORT: process.env.SMTP_PORT,
  EMAIL_SENDER: process.env.EMAIL_SENDER
};
