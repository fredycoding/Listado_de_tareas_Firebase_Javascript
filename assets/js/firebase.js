// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyAsn3DzZC_68wHDQ-DaqonQgxLr6A1_PxQ",
    authDomain: "trelloexercise.firebaseapp.com",
    databaseURL: "https://trelloexercise-default-rtdb.firebaseio.com",
    projectId: "trelloexercise",
    storageBucket: "trelloexercise.appspot.com",
    messagingSenderId: "97582101614",
    appId: "1:97582101614:web:8fbd4a49bf621aef3a227f",
    measurementId: "G-QJG3P464TH",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Reference to the database
  export const db = firebase.firestore();
  


  