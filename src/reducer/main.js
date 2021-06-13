import User from "./users";
import Settings from "./settings";
import UnSubscribe from "./firebaseManager"
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  User,
  Settings,
  UnSubscribe
});

export default rootReducer;
