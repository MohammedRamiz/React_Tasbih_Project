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
