

import {UsersState, UserState} from "../state/UserState";
import {Reducer} from "redux";
import {
  CHANGE_USER_ENABLED,
  LOAD_USERS, LOGIN_USER, LOGOUT_USER, userActionActionCreator,
  usersActionActionCreator
} from "../actions/UserAction";
import {MyAction} from "../common/MyAction";
import {User} from "../domain/model/User";

export const UserReducer: Reducer<UserState> = (userState: UserState, action: MyAction): UserState => {
    console.log("Enter User Reducer with: " + JSON.stringify(action) + "\n\n\n" + JSON.stringify(action.payload));
    switch (action.type) {
      case userActionActionCreator(action.type, action.payload).type:
        switch (userActionActionCreator(action.type, action.payload).type){
          case LOGOUT_USER:
            return Object.assign({}, userState, {user:Object.assign({}, userState.user, {username:null})});
          case LOGIN_USER:
            console.log("updating user: -------....>>>>> ", JSON.stringify(action.payload));
            return Object.assign({}, userState, {user:action.payload});
          default:
            return userState;
        }
        //const user: User = <User>action.payload;
       default:
        return userState;
    }
  };


export const UsersReducer: Reducer<UsersState> = (usersState: UsersState, action: MyAction): UsersState => {
  console.log("Enter Users Reducer with: " + JSON.stringify(action) + "\n\n\n" + JSON.stringify(action.payload));
  switch (action.type) {
    case usersActionActionCreator(action.type, action.payload).type:
      switch (usersActionActionCreator(action.type, action.payload).type){
        case LOAD_USERS:
          console.log("LOADING PAYLOAD: " + JSON.stringify(action.payload));
          let tenantId: string = action.payload['tenantid'];
          let object:any = {};
          //object[tenantId] = action.payload['users'];
          //usersState.users[tenantId] = action.payload;
          let newUsers = Object.assign({}, usersState);
          newUsers.users[tenantId] = action.payload['users'];
          //let retVal = Object.assign({}, usersState, object);
          //console.log("object: " + JSON.stringify(object));
          console.log("NEW USERS STATE: " + JSON.stringify(newUsers));
          return newUsers;
        case CHANGE_USER_ENABLED:
          let user: User = action.payload;

          console.log("CHANGE_USER_ENABLED.action.payload: " + JSON.stringify(user));
          console.log("CHANGE_USER_ENABLED.usersState" + JSON.stringify(usersState));

          console.log(" CLE CLE CLE " + user.getTenantId());

          let users: User[] = usersState.users[user.getTenantId()];
          console.log("users du tenant : " + JSON.stringify(users) + "\n\n\n\n\n\n\n" + JSON.stringify(usersState.users));
          let other: User[] = users.filter((u):boolean=>{
            return !(u.getUsername() === user.getUsername());
          });
          let utilisateurs : User[] = [...other, user];

          let newUsers1 = Object.assign({}, usersState);
          newUsers1.users[user.getTenantId()] = utilisateurs;

          //let retVal1 = Object.assign({}, usersState, {users: utilisateurs});
          console.log("test enablement: " + JSON.stringify(newUsers1));
          return newUsers1;
        default:
          return usersState;
      }
    default:
      return usersState;
  }
};
