// Society Management System - browser-only academic prototype.
// localStorage is used so demo records remain after refreshing this browser tab.

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "sms-demo-data-v1";

const defaultData = {
  residents: [
    { id: 1, name: "Ananya Rao", flat: "A-101", phone: "9876543210" },
    { id: 2, name: "Rahul Kumar", flat: "B-204", phone: "9876501234" }
  ],
  requests: [
    { id: 1, flat: "B-204", issue: "Lift is not working", priority: "High", status: "Open" }
  ],
  notices: [
    { id: 1, title: "Monthly residents meeting", message: "The monthly meeting is scheduled for Sunday at 10:00 AM in the community hall.", date: new Date().toLocaleDateString("en-IN") }
  ],
  payments: [
    { id: 1, flat: "A-101", amount: 2500, date: new Date().toLocaleDateString("en-IN") }
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(defaultData);
  } catch (error) {
    console.warn("Could not load saved data; starting with sample data.", error);
    return structuredClone(defaultData);
  }
}
let data = loadData();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function nextId(items) {
  return items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

// Easy, explainable keyword rules that act as an AI-style priority assistant.
// This is NOT a trained machine-learning model.
function predictPriority(description) {
  const text = description.toLowerCase();
  const highWords = ["fire", "smoke", "spark", "electric", "electrical", "gas leak", "flood", "burst pipe", "trapped", "lift stuck", "emergency", "security", "water leaking"];
  const mediumWords = ["leak", "broken", "not working", "blocked", "damage", "repair", "lift", "power", "plumbing", "noise"];
  if (highWords.some(word => text.includes(word))) return { level: "High", reason: "Potential safety or urgent maintenance keywords detected." };
  if (mediumWords.some(word => text.includes(word))) return { level: "Medium", reason: "Maintenance or repair keywords detected." };
  return { level: "Low", reason: "No urgent keywords detected; staff should still review the issue." };
}

function renderStats() {
  $("residentCount").textContent = data.residents.length;
  $("openCount").textContent = data.requests.filter(r => r.status === "Open").length;
  $("noticeCount").textContent = data.notices.length;
  const total = data.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  $("collectionTotal").textContent = "₹" + total.toLocaleString("en-IN");
}
function renderResidents() {
  const body = $("residentTable");
  body.innerHTML = data.residents.length ? data.residents.map(r => `
    <tr><td>${escapeHTML(r.name)}</td><td>${escapeHTML(r.flat)}</td><td>${escapeHTML(r.phone)}</td>
    <td><button class="danger" data-action="delete-resident" data-id="${r.id}" aria-label="Delete resident">Delete</button></td></tr>`).join("")
    : `<tr><td colspan="4" class="empty-row">No residents added yet.</td></tr>`;
}
function renderRequests() {
  const body = $("requestTable");
  body.innerHTML = data.requests.length ? data.requests.map(r => `
    <tr><td>${escapeHTML(r.flat)}</td><td>${escapeHTML(r.issue)}</td>
    <td><span class="priority ${r.priority}">${r.priority}</span></td><td><span class="status">${r.status}</span></td>
    <td>${r.status === "Open" ? `<button class="secondary" data-action="resolve-request" data-id="${r.id}">Resolve</button>` : "—"}</td></tr>`).join("")
    : `<tr><td colspan="5" class="empty-row">No maintenance requests yet.</td></tr>`;
}
function renderNotices() {
  $("noticeList").innerHTML = data.notices.length ? data.notices.slice().reverse().map(n => `
    <article class="notice"><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.message)}</p><small>Published ${escapeHTML(n.date)}</small></article>`).join("")
    : `<p class="helper">No notices published yet.</p>`;
}
function renderPayments() {
  $("paymentTable").innerHTML = data.payments.length ? data.payments.slice().reverse().map(p => `
    <tr><td>${escapeHTML(p.flat)}</td><td>₹${Number(p.amount).toLocaleString("en-IN")}</td><td>${escapeHTML(p.date)}</td></tr>`).join("")
    : `<tr><td colspan="3" class="empty-row">No payments recorded yet.</td></tr>`;
}
function renderAll() {
  renderStats(); renderResidents(); renderRequests(); renderNotices(); renderPayments();
}

$("residentForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("residentName").value.trim();
  const flat = $("flatNumber").value.trim().toUpperCase();
  const phone = $("residentPhone").value.trim();
  if (!name || !flat || !/^[0-9]{10}$/.test(phone)) {
    alert("Enter a name, flat number and valid 10-digit contact number.");
    return;
  }
  if (data.residents.some(r => r.flat.toLowerCase() === flat.toLowerCase())) {
    alert("That flat number is already registered in this demo.");
    return;
  }
  data.residents.push({ id: nextId(data.residents), name, flat, phone });
  saveData(); renderAll(); event.target.reset();
});

$("issueDescription").addEventListener("input", () => {
  const issue = $("issueDescription").value.trim();
  const box = $("predictionBox");
  if (!issue) { box.textContent = "Priority prediction will appear as you type."; return; }
  const prediction = predictPriority(issue);
  box.innerHTML = `Suggested priority: <span class="priority ${prediction.level}">${prediction.level}</span> — ${escapeHTML(prediction.reason)}`;
});

$("requestForm").addEventListener("submit", event => {
  event.preventDefault();
  const flat = $("requestFlat").value.trim().toUpperCase();
  const issue = $("issueDescription").value.trim();
  if (!flat || !issue) return;
  const prediction = predictPriority(issue);
  data.requests.push({ id: nextId(data.requests), flat, issue, priority: prediction.level, status: "Open" });
  saveData(); renderAll(); event.target.reset();
  $("predictionBox").textContent = "Priority prediction will appear as you type.";
});

$("noticeForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = $("noticeTitle").value.trim();
  const message = $("noticeMessage").value.trim();
  if (!title || !message) return;
  data.notices.push({ id: nextId(data.notices), title, message, date: new Date().toLocaleDateString("en-IN") });
  saveData(); renderAll(); event.target.reset();
});

$("paymentForm").addEventListener("submit", event => {
  event.preventDefault();
  const flat = $("paymentFlat").value.trim().toUpperCase();
  const amount = Number($("paymentAmount").value);
  if (!flat || !Number.isFinite(amount) || amount <= 0) {
    alert("Enter a flat number and a valid positive amount.");
    return;
  }
  data.payments.push({ id: nextId(data.payments), flat, amount, date: new Date().toLocaleDateString("en-IN") });
  saveData(); renderAll(); event.target.reset();
});

document.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  if (button.dataset.action === "delete-resident") {
    if (confirm("Delete this resident from the demo directory?")) {
      data.residents = data.residents.filter(r => r.id !== id);
      saveData(); renderAll();
    }
  }
  if (button.dataset.action === "resolve-request") {
    const request = data.requests.find(r => r.id === id);
    if (request) request.status = "Resolved";
    saveData(); renderAll();
  }
});

renderAll();
