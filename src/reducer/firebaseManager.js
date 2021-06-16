const snapshotUnsbs = [];

const UnSubscribe = (unSubs = snapshotUnsbs, action) => {
  switch (action.type) {
    case "RECORD":
      unSubs.push(action.data);
      return unSubs;
    case "RELEASE":
      unSubs.forEach(call => {
        call();
      });
      return [];
    default:
      return unSubs;
  }
};
export default UnSubscribe;
