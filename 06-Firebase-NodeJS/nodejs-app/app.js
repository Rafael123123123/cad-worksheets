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

const SEND_INTERVAL = 5000;

const sentences = [
  'A new request was received.',
  'The kitchen lights were turned on.',
  'The front door was left open.',
  'Temperature in the living room is above 25 °C.',
  'The backup finished successfully.',
  'Motion detected in the garage.',
  'The washing machine has finished.',
  'Battery of the smoke detector is low.'
];

const types = ['success', 'warning', 'danger', 'primary'];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function sendRandomMessage() {
  const message = {
    text: randomItem(sentences),
    type: randomItem(types)
  };

  return messagesRef.push(message)
    .then((ref) => {
      console.log(`[${message.type}] ${message.text} (key ${ref.key})`);
    })
    .catch((error) => {
      console.error('Failed to write message:', error.message);
    });
}

console.log(`Sending a random message every ${SEND_INTERVAL / 1000} seconds. Press Ctrl+C to stop.`);
setInterval(sendRandomMessage, SEND_INTERVAL);
