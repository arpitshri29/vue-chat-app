import * as firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBWYN4PBbVz338K9f9uejUhB77Y3PHawq0",
    authDomain: "vuechatapp-eaada.firebaseapp.com",
    databaseURL: "https://vuechatapp-eaada.firebaseio.com",
    projectId: "vuechatapp-eaada",
    storageBucket: "vuechatapp-eaada.appspot.com",
    messagingSenderId: "650748971443",
    appId: "1:650748971443:web:25c402250689a25265e3c6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;