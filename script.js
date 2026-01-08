// 🔥 CONFIG FIREBASE (substitua)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username, room, localStream, peerConnections = {};
const configRTC = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

async function entrar() {
  username = document.getElementById("username").value;
  room = document.getElementById("room").value;
  if (!username) return alert("Digite seu nome");

  document.getElementById("login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("roomName").innerText = room;

  localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  localStream.getTracks().forEach(t => t.enabled = false);

  const userRef = db.ref(`rooms/${room}/users/${username}`);
  userRef.set(true);
  userRef.onDisconnect().remove();

  db.ref(`rooms/${room}/users`).on("value", snap => {
    const users = snap.val() || {};
    document.getElementById("users").innerHTML =
      Object.keys(users).map(u => `<li>${u}</li>`).join("");
  });
}

document.getElementById("talkBtn").addEventListener("mousedown", () => {
  localStream.getTracks().forEach(t => t.enabled = true);
});

document.getElementById("talkBtn").addEventListener("mouseup", () => {
  localStream.getTracks().forEach(t => t.enabled = false);
});
