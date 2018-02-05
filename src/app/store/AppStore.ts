
import {ListenerCallBack} from "../event/listener/Callback";
import {rootReducer} from "../reducer/RootReducer";
import {AppState, initialAppsState} from "../state/AppState";
import {MyAction} from "../common/MyAction";
//import {Action} from "redux";

export class AppStore{
  private state: AppState;
  private listeners: ListenerCallBack[];

  constructor(initialStat: AppState){
    this.state = initialStat;
    this.listeners = [];
  }

  getState():AppState{
    return this.state;
  }

  dispatch(action: MyAction){
    console.log("in dispatch: "+ JSON.stringify(action));
    this.state = rootReducer(this.state, action);
    this.listeners.forEach((l:ListenerCallBack) => {
      l();
    });
  }

  subscribe(listener : ListenerCallBack): ListenerCallBack{
    this.listeners.push(listener);
    return ()=>{
      this.listeners = this.listeners.filter((l)=>l!==listener);
    };
  }

  getListeners():ListenerCallBack[]{
    return this.listeners;
  }
}

export let appStore: AppStore= new AppStore(initialAppsState);

appStore.subscribe(()=>{
  console.log("I get Token: " , JSON.stringify(appStore.getState().tokenState.token));
});
//console.log("ECCOOOOOOOOOO" + JSON.stringify(appStore));
//export let appStore: Store<AppState> = createStore<AppState>(initialAppsState);
/*


import {AppState, initialAppsState} from "../state/AppState";
import {ListenerCallBack} from "../event/listener/Callback";
import {rootReducer} from "../reducer/RootReducer";
import {Action} from "../actions/Action";


export class Store{
  private state: AppState;
  private listeners: ListenerCallBack [];

  constructor(initialStat: AppState){
    this.state = initialStat;
    this.listeners = [];
  }

  getState():AppState{
    return this.state;
  }

  dispatch(action: Action){
    this.state = rootReducer(this.state, action);
    this.listeners.forEach((l:ListenerCallBack) => {
      l();
    });
  }

  subscribe(listener : ListenerCallBack): ListenerCallBack{
    this.listeners.push(listener);
    return ()=>{
      this.listeners = this.listeners.filter((l)=>l!==listener);
    };
  }
}


export let myStore: Store= new Store(initialAppsState);

//const devtools: StoreEnhancer<AppState> = window['devToolsExtention']? window['devToolsExtention']: f=>f;

//export let myStore: Store<AppState> = createStore<AppState>(counterReducer, devtools);
//export let myStore: Store<AppState> = createStore<AppState>(counterReducer);

//export const AppStore = new InjectionToken<AppState>('AppStore');
 */
