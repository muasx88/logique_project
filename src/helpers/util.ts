import { genSalt, hash } from 'bcrypt';

export const generatePassword = async (password: string): Promise<string> => {
	const salt = await genSalt(10);
	const hashedPassword = await hash(password, salt);
	return hashedPassword;
};
