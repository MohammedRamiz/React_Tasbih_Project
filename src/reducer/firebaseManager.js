const snapshotUnsbs = [

]

const UnSubscribe = (unSubs = snapshotUnsbs, action) => {
    console.log(action.data);

    switch (action.type) {
        case "RECORD":
            unSubs.push(action.data);
            return unSubs
        case "RELEASE":
            unSubs.map(call => {
                call();
                return null
            })
            return []
        default:
            return unSubs
    }
}
export default UnSubscribe;
