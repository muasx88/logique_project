export default <any>{
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,

  DB_HOST: process.env.MYSQL_HOST,
  DB_PORT: parseInt(process.env.MYSQL_PORT, 10),
  DB_USER: process.env.MYSQL_USER,
  DB_PASSWORD: process.env.MYSQL_PASSWORD,
  DB_NAME: process.env.MYSQL_DATABASE,
};
