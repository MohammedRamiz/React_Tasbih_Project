const initSettings = {
  settings: {
    Layout: "colomn-layout"
  },
  path: "",
  loading: true,
  totalTasbihsCount: 0,
  isUserIn: false,
  userType: ""
};

const Settings = (settings = initSettings, action) => {
  switch (action.type) {
    case "UPDATE": {
      const newSet = action.data
        ? {
          settings: action.data.settings ? action.data.settings : settings.settings,
          path: action.data.path ? action.data.path : settings.path,
          loading: typeof action.data.loading !== "undefined" ? action.data.loading : settings.loading,
          totalTasbihsCount: action.data.totalTasbihsCount ? action.data.totalTasbihsCount : settings.totalTasbihsCount,
          isUserIn: typeof action.data.isUserIn !== "undefined" ? action.data.isUserIn : settings.isUserIn,
          userType: action.data.userType ? action.data.userType : settings.userType
        }
        : settings;
      return newSet;
    }
    case "RESET":
      return initSettings;
    default:
      return settings;
  }
};

export default Settings;
