export const setUpUserData = user => {
  return {
    type: "USER",
    data: user
  };
};

export const saveHistoryCache = hCache => {
  return {
    type: "HCACHE",
    data: hCache
  };
}

export const saveTasbihCache = tCache => {
  return {
    type: "TCACHE",
    data: tCache
  };
}

export const saveAvailableTasbihCache = atCache => {
  return {
    type: "ATCACHE",
    data: atCache
  };
}

export const updateSettings = settings => {
  return {
    type: "UPDATE",
    data: settings
  };
};

export const resetSettings = () => {
  return {
    type: "RESET"
  };
};

export const recoredUnSubCall = (call, type) => {
  return {
    type: type,
    data: call
  };
};

export const execCalls = (type) => {
  return {
    type: type
  };
};
