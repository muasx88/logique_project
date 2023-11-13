import { config } from 'dotenv';
import Server from './server';

config();

const PORT = process.env.PORT as string;

Server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
