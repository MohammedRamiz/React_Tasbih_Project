import User, { HistoryCache, TasbihCache, AvailableTasbihCache } from "./users";
import Settings from "./settings";
import UnSubscribe from "./firebaseManager"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  User,
  HistoryCache,
  TasbihCache,
  AvailableTasbihCache,
  Settings,
  UnSubscribe
});

export default rootReducer;
