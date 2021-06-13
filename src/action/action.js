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

export const recoredUnSubCall = call => {
  return {
    type: "RECORD",
    data: call
  };
};

export const execCalls = () => {
  return {
    type: "RELEASE"
  };
};
