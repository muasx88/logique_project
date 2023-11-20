import { Promise } from 'bluebird';
import { Request, Response } from 'express';
import { UserRegisterSchema as IUserRegisterSchema } from '../../types/user-register.schema';
import { PaginationSchema as IPaginationSchema } from '../../types/pagination.schema';
import dayjs from 'dayjs';

import knexDb from '~/config/database';
import { generatePassword } from '~/helpers/util';

type RequestBody<T> = Request<{}, {}, T>;
type RequestQuery<T> = Request<{}, {}, {}, T>;

type UserCreditCard = {
  type: string;
  number: string;
  name: string;
  expired: string;
};

type UserResponse = {
  user_id: number;
  name: string;
  email: string;
  address: string;
  creditcard: UserCreditCard;
};

export const UserList = async (
  req: RequestQuery<IPaginationSchema>,
  res: Response
): Promise<Response<UserResponse[]>> => {
  try {
    const { q, lt, of, sb, ob } = req.query;

    const orderBy = ob ?? 'name';
    const sortBy = sb ?? 'DESC';
    const limit = lt ?? 10;
    const offset = ((of ?? 1) - 1) * limit;

    const [total, rowsData] = await Promise.all([
      // count query
      knexDb('users as u')
        .join('user_card as uc', 'u.id', '=', 'uc.user_id')
        .where((builder) => {
          if (q) {
            builder.where('u.name', 'like', `%${q}%`).orWhere('uc.creditcard_name', 'like', `%${q}%`);
          }
        })
        .count('u.id as total'),

      //rows query
      knexDb('users as u')
        .join('user_card as uc', 'u.id', '=', 'uc.user_id')
        .where((builder) => {
          if (q) {
            builder.where('u.name', 'like', `%${q}%`).orWhere('uc.creditcard_name', 'like', `%${q}%`);
          }
        })
        .select(
          ' u.id as user_id',
          'u.name',
          'u.address',
          'u.email',
          'uc.creditcard_type',
          'uc.creditcard_number',
          'uc.creditcard_name',
          'uc.creditcard_expired',
          'uc.creditcard_cvv'
        )
        .orderBy(orderBy, sortBy)
        .limit(limit)
        .offset(offset),
    ]);

    const count = total[0].total;
    const data = await Promise.map(rowsData, async (row: IUserRegisterSchema) => {
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
    });

    return res.send({ count, data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

export const UserRegister = async (req: RequestBody<IUserRegisterSchema>, res: Response) => {
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

  const isEmailExists = await knexDb('users').where('email', email).first();

  if (isEmailExists) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  try {
    const generatedPassword = await generatePassword(password);
    const expiredDate = dayjs(creditcard_expired).format('YYYY-MM-DD');

    const userId = await knexDb.transaction(async (trx) => {
      const [insertedId] = await trx
        .insert({
          email,
          password: generatedPassword,
          name,
          address,
        })
        .into('users');

      console.log(insertedId);

      await trx
        .insert({
          user_id: insertedId,
          creditcard_type,
          creditcard_number,
          creditcard_name,
          creditcard_expired: expiredDate,
          creditcard_cvv,
        })
        .into('user_card');

      return insertedId;
    });

    return res.send({ user_id: userId });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

export const UserDetail = async (req: Request, res: Response): Promise<Response<UserResponse>> => {
  try {
    const user = await knexDb('users')
      .leftJoin('user_card', 'users.id', '=', 'user_card.user_id')
      .where('users.id', req.params.id)
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User Not Found.' });
    }

    const data: UserResponse = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      address: user.address,
      creditcard: {
        type: user.creditcard_type,
        number: user.creditcard_number.slice(-4),
        name: user.creditcard_name,
        expired: user.creditcard_expired,
      },
    };

    return res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    console.log(error.message);
  }
};

//TODO: Update user running of time
export const UserUpdate = async () => {};
