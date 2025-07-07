import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import store from "../store";
import { SaveNotifyToken } from "../toolkitStore/Auditvista/AuthSlice";
// import customUrl from "../assets/images/auditlogo.png"

const firebaseConfig = {
  apiKey: "AIzaSyDLCsyyle9NmqGVmXBmd71C-l9nfc9VSlw",
  authDomain: "audit-vista.firebaseapp.com",
  projectId: "audit-vista",
  storageBucket: "audit-vista.firebasestorage.app",
  messagingSenderId: "6166488775",
  appId: "1:6166488775:web:a2d3f4fb1ebc50e3d640e2",
  measurementId: "G-LWDFZK5M3F"
};


const app = initializeApp(firebaseConfig);


const messaging = getMessaging(app);



const getFCMToken = async () => {
  try {
   const token = await getToken(messaging, { vapidKey: "BOL2WeeY8AuFAlhXvckqXsbG3PKZkOTliu-W95FsDIoBtgIZmIvoQ8Dm5gWBZl9o7xO9Dhb3ulY3RRKrwJxHLxg" }); // Use your VAPID key here
   if (token) {
    //  console.log('FCM Token: ', token);
     store.dispatch(SaveNotifyToken(token));

     return token
   } else {
     console.log('No token available.');
   }
 } catch (error) {
   console.error('Error getting FCM token:', error);
 }
};




const listenForNotifications = () => {
 onMessage(messaging, (payload) => {
  
   console.log('Message received: ', payload);
   // Show the notification

   if (Notification.permission === 'granted') {
     new Notification(payload.notification.title, {
       body: payload.notification.body,
       tag: "current-notification",
      //  icon: customUrl, 
     });
   }
 });


 
};




export { getFCMToken, listenForNotifications };