import 'dotenv/config';

const isProd = process.env.NODE_ENV === "production";
const parsedDbPort = Number.parseInt(process.env.DB_PORT ?? "5432", 10);

const dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number.isNaN(parsedDbPort) ? 5432 : parsedDbPort,
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