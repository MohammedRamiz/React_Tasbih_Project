const currentUser = null;

const User = (user = currentUser, action) => {
  switch (action.type) {
    case "USER":
      return action.data;
    default:
      return user;
  }
};

export default User;
