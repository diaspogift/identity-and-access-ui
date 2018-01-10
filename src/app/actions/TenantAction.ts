import {ActionCreator} from "redux";
import {MyAction} from "../common/MyAction";

export const REGISTER_USER: string = 'REGISTER_USER';

export const registerUserActionCreator: ActionCreator<MyAction> = (type: string, pld: any) => ( {type:type, payload:pld});

export const CHANGE_TENANT_AVAILABILITY_STATUS: string = 'CHANGE_TENANT_AVAILABILITY_STATUS';

export const changeTenantAvailabilityStatusActionCreator: ActionCreator<MyAction> = (type: string, pld: any) => ( {type:type, payload:pld});

/*export const ADD_THREAD = '[Thread] Add';
export interface AddThreadAction extends Action {
  thread: Thread;
}
export const addThread: ActionCreator<AddThreadAction> =
  (thread) => ({
    type: ADD_THREAD,
    thread: thread
  });

export const ADD_MESSAGE = '[Thread] Add Message';
export interface AddMessageAction extends Action {
  thread: Thread;
  message: Message;
}
export const addMessage: ActionCreator<AddMessageAction> =
  (thread: Thread, messageArgs: Message): AddMessageAction => {
    const defaults = {
      id: uuid(),
      sentAt: new Date(),
      isRead: false,
      thread: thread
    };
    const message: Message = Object.assign({}, defaults, messageArgs);

    return {
      type: ADD_MESSAGE,
      thread: thread,
      message: message
    };
  };

export const SELECT_THREAD = '[Thread] Select';
export interface SelectThreadAction extends Action {
  thread: Thread;
}
export const selectThread: ActionCreator<SelectThreadAction> =
  (thread) => ({
    type: SELECT_THREAD,
    thread: thread
  });*/
