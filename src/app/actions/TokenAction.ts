import {ActionCreator} from "redux";
import {MyAction} from "../common/MyAction";

export const SAVE_TOKEN: string = 'SAVE_TOKEN';

export const saveTokenActionCreator: ActionCreator<MyAction> = (type: string, pld: any) => ( {type:type, payload:pld});

