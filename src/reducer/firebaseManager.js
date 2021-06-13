const snapshotUnsbs = [

]

const UnSubscribe = (unSubs = snapshotUnsbs, action) => {
    console.log(action.data);

    switch (action.type) {
        case "RECORD":
            unSubs.push(action.data);
            return unSubs
        case "RELEASE":
            console.log("[RELESING All onSnapShot]")
            return unSubs.map(call => { return call() })
        default:
            return unSubs
    }
}
export default UnSubscribe;
