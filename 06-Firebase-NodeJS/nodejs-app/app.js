'use strict';

const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const serviceAccount = require('./serviceAccountKey.json');

// Exact Realtime Database URL (Firebase console > Realtime Database).
const DATABASE_URL = 'https://cad-2022131195-default-rtdb.europe-west1.firebasedatabase.app';

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: DATABASE_URL
});

const messagesRef = getDatabase().ref('messages');

const message = {
  text: 'A new request was received.',
  type: 'success'
};

messagesRef.push(message)
  .then((ref) => {
    console.log('Message written with key', ref.key);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to write message:', error.message);
    process.exit(1);
  });
