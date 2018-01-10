
import {User} from "../domain/model/User";
import {AccessToken} from "../domain/model/AccessToken";

export interface TokenState {
  token: AccessToken;
}

export const initialTokenState: TokenState = {token: null};
