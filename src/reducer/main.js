import User from "./users";
import Settings from "./settings";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  User,
  Settings
});

export default rootReducer;
