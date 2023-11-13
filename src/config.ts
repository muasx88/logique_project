export default <any>{
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT || 3000,

	DB_HOST: process.env.DB_HOST,
	DB_PORT: parseInt(process.env.DB_PORT, 10),
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
};
