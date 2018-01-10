


import {Reducer} from "redux";
import {TokenState} from "../state/TokenState";
import {SAVE_TOKEN} from "../actions/TokenAction";
import {MyAction} from "../common/MyAction";


export const tokenReducer: Reducer<TokenState> = (tokenState: TokenState, action: MyAction): TokenState => {
  console.log("in tokenReducer: token state: ", JSON.stringify(tokenState), " Action: ----->" + JSON.stringify(action));
  switch (action.type) {
    case SAVE_TOKEN: {
      console.log("SAVING TOKEN: " , JSON.stringify(action.payload));
     let aTokenState: TokenState = Object.assign({}, tokenState, {token:Object.assign({}, action.payload)});
     console.log("new token state: " , JSON.stringify(aTokenState));
      return aTokenState;
    }
    default:
      return tokenState;
  }
};
