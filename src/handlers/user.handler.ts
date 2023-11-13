import Promise from 'bluebird';
import { Request, Response } from 'express';
import { UserRegisterSchema as IUserRegisterSchema } from '../../types/user-register.schema';
import { PaginationSchema as IPaginationSchema } from '../../types/pagination.schema';
import db from '~/config/database';
import dayjs from 'dayjs';

type RequestBody<T> = Request<{}, {}, T>;
type RequestQuery<T> = Request<{}, {}, {}, T>;
type lastInsertedIdType = {
	insertId: number;
};

export const UserRegister = async (
	req: RequestBody<IUserRegisterSchema>,
	res: Response
) => {
	const {
		name,
		address,
		email,
		password,
		creditcard_number,
		creditcard_cvv,
		creditcard_expired,
		creditcard_name,
		creditcard_type,
	} = req.body;

	const [rows, _] = await db.execute(
		'SELECT email from users where email = ?',
		[email]
	);

	if (rows[0]?.email) {
		return res.status(400).json({ error: 'Email already exists' });
	}

	try {
		const [result] = await db.execute(
			'INSERT INTO users (email, password, name, address) VALUES (?, ?, ?, ?)',
			[email, password, name, address]
		);

		const lastId = result.insertId;
		const expiredDate = dayjs(creditcard_expired).format('YYYY-MM-DD');

		await db.query(
			'INSERT INTO user_card (user_id, creditcard_type, creditcard_number, creditcard_name, creditcard_expired, creditcard_cvv) VALUES (?, ?, ?, ?, ?, ?)',
			[
				lastId,
				creditcard_type,
				creditcard_number,
				creditcard_name,
				expiredDate,
				creditcard_cvv,
			]
		);

		return res.send({ user_id: lastId });
	} catch (error) {
		console.log(error.message);
		res
			.status(500)
			.json({ error: 'Something went wrong. Please try again later.' });
	}
};

export const UserList = async (
	req: RequestQuery<IPaginationSchema>,
	res: Response
) => {
	const { q, lt, of, sb, ob } = req.query;

	// const data = await Promise.map(rows, async (row) => {});

	const orderBy = ob ?? 'name';
	const sortBy = sb ?? 'DESC';
	const limit = lt ?? 10;
	const offset = ((of ?? 1) - 1) * limit;

	let filter: string = '1=1 ';
	if (q) {
		filter += ` and u.name like '%${q}%' OR uc.creditcard_name like '%${q}%'`;
	}

	try {
		const [count, result] = await Promise.all([
			db.query(`SELECT COUNT(id) as total from users`),
			db.query(`SELECT u.id as user_id, u.name, u.address, u.email,
				uc.creditcard_type, uc.creditcard_number, uc.creditcard_name, uc.creditcard_expired, uc.creditcard_cvv
				FROM users u
				LEFT JOIN user_card uc on u.id = uc.user_id
				WHERE ${filter}
				ORDER BY ${orderBy} ${sortBy}
				LIMIT ${limit} OFFSET ${offset}
				`),
		]);

		const countData = count[0][0].total;
		const data = await Promise.map(
			result[0] as Array<Object>,
			async (row: any) => {
				return {
					user_id: row.user_id,
					name: row.name,
					email: row.email,
					address: row.address,
					creditcard: {
						type: row.creditcard_type,
						number: row.creditcard_number.slice(-4), // last 4 character
						name: row.creditcard_name,
						expired: row.creditcard_expired,
					},
				};
			}
		);

		res.send({ count: countData, rows: data });
	} catch (error) {
		console.log(error.message);
		res
			.status(500)
			.json({ error: 'Something went wrong. Please try again later.' });
	}
};
export const UserDetail = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const [rows, _] = await db.query(
			`SELECT u.id as user_id, u.name, u.address, u.email,
		uc.creditcard_type, uc.creditcard_number, uc.creditcard_name, uc.creditcard_expired, uc.creditcard_cvv
		FROM users u
		LEFT JOIN user_card uc on u.id = uc.user_id
		WHERE u.id = ?`,
			[id]
		);

		if (!rows[0]) {
			return res.status(404).json({ error: 'User Not Found.' });
		}

		const row = rows[0];

		return res.send({
			user_id: row.user_id,
			name: row.name,
			email: row.email,
			address: row.address,
			creditcard: {
				type: row.creditcard_type,
				number: row.creditcard_number.slice(-4), // last 4 character
				name: row.creditcard_name,
				expired: row.creditcard_expired,
			},
		});
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Something went wrong. Please try again later.' });
		console.log(error.message);
	}
};

//TODO: Update user running of time
export const UserUpdate = async () => {};
