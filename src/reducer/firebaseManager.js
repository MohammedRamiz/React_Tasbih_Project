const snapshotUnsbs = {
  loadPage: [],
  historyPage: () => { },
  bodyPage: () => { },
  tasbihCardPage: () => { }
}


const UnSubscribe = (unSubs = snapshotUnsbs, action) => {

  console.log(action.type)
  switch (action.type) {
    case "LOAD":
      unSubs.loadPage.push(action.data)
      return unSubs;
    case "BODY":
      unSubs.bodyPage = action.data;
      return unSubs;
    case "HISTORY":
      unSubs.historyPage = action.data;
      return unSubs;
    case "RELEASE_LOAD":
      unSubs.loadPage.forEach(call => {
        call();
      });
      return unSubs.loadPage = [];
    case "RELEASE_HISTORY":
      unSubs.historyPage();
      unSubs.historyPage = () => { };
      return unSubs
    case "RELEASE_BODY":
      unSubs.bodyPage();
      unSubs.bodyPage = () => { };
      return unSubs
    case "RELEASE":
      unSubs.loadPage.forEach(call => {
        call();
      });
      unSubs.historyPage();
      unSubs.bodyPage();
      unSubs.tasbihCardPage();
      return { loadPage: [] };
    default:
      return unSubs;
  }
};
export default UnSubscribe;
