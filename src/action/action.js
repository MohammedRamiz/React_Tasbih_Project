export const setUpUserData = user => {
  return {
    type: "USER",
    data: user
  };
};

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
