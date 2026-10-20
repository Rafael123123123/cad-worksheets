import { database } from "./firebase.js";
import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const ALERT_TYPES = ["success", "warning", "danger", "primary"];

const container = document.getElementById("messages");
const errorBox = document.getElementById("messages-error");
const messagesRef = ref(database, "messages");

function showMessage(snapshot) {
  const message = snapshot.val();
  const type = ALERT_TYPES.includes(message.type) ? message.type : "secondary";

  const alert = document.createElement("div");
  alert.className = "alert alert-" + type;
  alert.setAttribute("role", "alert");
  alert.textContent = message.text;

  container.appendChild(alert);
}

function showError(error) {
  console.error("Failed to read messages:", error);
  errorBox.textContent = "Could not read messages: " + error.message;
  errorBox.hidden = false;
}

onChildAdded(messagesRef, showMessage, showError);
