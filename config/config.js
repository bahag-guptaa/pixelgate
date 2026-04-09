import 'dotenv/config';

const isProd = process.env.NODE_ENV === "production";

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: "postgres",
  ...(isProd && {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }),
};

export default {
  development: dbConfig,
  production: dbConfig,
};