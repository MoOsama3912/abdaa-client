// Dashboard client script: load clients from API, render and filter
let allClients = [];

async function fetchClients() {
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    allClients = await res.json();
    updateStats();
    renderClients(allClients);
    populateDelegates();
  } catch (err) {
    console.error("❌ خطأ في تحميل العملاء:", err);
  }
}

function updateStats() {
  const counts = {};
  allClients.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });

  // update known boxes if they exist
  const setSpan = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.querySelector('span').textContent = value;
  };

  setSpan('waiting-call', counts['مكالمة منتظرة'] || 0);
  setSpan('follow-up', counts['مهتم متابعة'] || 0);
  setSpan('not-interested', counts['غير مهتم'] || 0);
  setSpan('thinking', counts['محتمل بيفكر'] || 0);
  setSpan('meeting', counts['مقابلة في المقر'] || 0);
  setSpan('donated', counts['تبرع مؤكد'] || 0);
  setSpan('wrong-number', counts['رقم خطأ'] || 0);
  setSpan('total', allClients.length || 0);
}

function renderClients(clients) {
  const container = document.getElementById("clients-container");
  if (!container) return;
  container.innerHTML = "";

  clients.forEach(client => {
    const card = document.createElement("div");
    card.className = "client-card";

    card.innerHTML = `
      <h3>${client.name}</h3>
      <p><strong>Phone:</strong> ${client.phone}</p>
      <p><strong>Status:</strong> ${client.status}</p>
      <p><strong>Delegate:</strong> ${client.delegate || "غير محدد"}</p>
      <p><strong>Notes:</strong> ${client.notes || ''}</p>
      <button onclick="location.href='edit-client.html?id=${client._id}'">✏️ تعديل</button>
      <button onclick="deleteClient('${client._id}')">🗑️ حذف</button>
    `;

    container.appendChild(card);
  });
}

function filterClients(status) {
  if (status === "all") {
    renderClients(allClients);
  } else {
    const filtered = allClients.filter(c => c.status === status);
    renderClients(filtered);
  }
}

function filterByDelegate() {
  const sel = document.getElementById("delegate-filter");
  if (!sel) return;
  const selected = sel.value;
  if (selected === "all") renderClients(allClients);
  else renderClients(allClients.filter(c => c.delegate === selected));
}

function populateDelegates() {
  const delegates = [...new Set(allClients.map(c => c.delegate).filter(Boolean))];
  const select = document.getElementById("delegate-filter");
  if (!select) return;
  select.innerHTML = '<option value="all">كل المندوبين</option>';

  delegates.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

async function deleteClient(id) {
  if (!confirm('هل تريد حذف هذا العميل؟')) return;
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    fetchClients();
  } catch (err) {
    console.error('Error deleting client:', err);
    alert('حدث خطأ أثناء الحذف');
  }
}

window.addEventListener('load', fetchClients);
