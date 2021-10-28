const currentUser = null;
const HistoryTasbihsCache = null;
const UserTasbihCache = null
const UserAvailabeTasbihsCache = null;

const User = (user = currentUser, action) => {
  switch (action.type) {
    case "USER":
      return action.data;
    default:
      return user;
  }
};

const HistoryCache = (hCache = HistoryTasbihsCache, action) => {
  switch (action.type) {
    case "HCACHE":
      return action.data;
    default:
      return hCache;
  }
}

const TasbihCache = (tCache = UserTasbihCache, action) => {
  switch (action.type) {
    case "TCACHE":
      return action.data;
    default:
      return tCache;
  }
}

const AvailableTasbihCache = (atCache = UserAvailabeTasbihsCache, action) => {
  switch (action.type) {
    case "ATCACHE":
      return action.data;
    default:
      return atCache;
  }
}

export { HistoryCache, TasbihCache, AvailableTasbihCache };
export default User;
