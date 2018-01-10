
import {User} from "../domain/model/User";

export interface UserState {
  user: User;
}

export const initialUserState: UserState = {user: null};




export interface UsersState {
  users: any;
}

export const initialUsersState: UsersState = {users: {}};
