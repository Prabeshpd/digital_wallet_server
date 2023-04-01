import BaseModel from './Model';
import { CamelCaseKeys } from '../types/utils';
import { listWithoutAttrs } from '../utils/object';

export interface UserModel {
  id: number;
  email: string;
  name: string;
  password: string;
  created_at: string;
  is_active: boolean;
  updated_at: string;
}

export type UserSchema = CamelCaseKeys<UserModel>;
export type UserDetail = Omit<UserSchema, 'password'>;
export type UserPayload = Omit<UserModel, 'id' | 'created_at' | 'updated_at'>;

class User extends BaseModel {
  public static table = 'users';

  public static async insertData(data: UserPayload | UserPayload[]) {
    const user = await this.insert<UserPayload | UserPayload[]>(data);

    return listWithoutAttrs(user, ['password']);
  }

  public static async fetchByEmail(email: string) {
    return this.buildQuery<UserSchema>((qb) =>
      qb.select('*').from('users').where('is_active', 1).andWhere('email', email)
    );
  }
}

export default User;
