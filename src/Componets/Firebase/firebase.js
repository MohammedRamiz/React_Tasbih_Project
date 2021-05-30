import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBgkmn9ocvAIctd4hcfsqpKVh7mzL8veEA",
    authDomain: "onlinetasbih-a888e.firebaseapp.com",
    projectId: "onlinetasbih-a888e",
    storageBucket: "onlinetasbih-a888e.appspot.com",
    messagingSenderId: "501532825415",
    appId: "1:501532825415:web:80f2124a9b13ef33db9e62",
    measurementId: "G-F9ZE8WN6FL"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db = firebaseApp.firestore()
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export {firebaseApp,auth,provider}
  export default db