let allClients = [];

async function fetchClients() {
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients`);
    if (!res.ok) throw new Error('Failed to fetch clients');
    allClients = await res.json();
    renderStatusCards();
    updateStats();
    renderClients(allClients);
    populateDelegates();
  } catch (err) {
    console.error("❌ خطأ في تحميل العملاء:", err);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  try {
    await fetchClients();

    const quickSearch = document.getElementById('quick-search');
    if (quickSearch) {
      quickSearch.addEventListener('input', async function() {
        const searchTerm = this.value.trim();
        if (searchTerm.length < 2) return;

        try {
          const searchResponse = await fetch(`${window.API_BASE}/clients/search?q=${encodeURIComponent(searchTerm)}`);
          if (!searchResponse.ok) throw new Error('فشل في البحث');
          const results = await searchResponse.json();
          console.log('نتائج البحث:', results);
        } catch (error) {
          console.error('خطأ في البحث:', error);
        }
      });
    }
  } catch (error) {
    console.error('خطأ:', error);
    alert('حدث خطأ في تحميل البيانات. يرجى تحديث الصفحة.');
  }
});

function renderStatusCards() {
  const container = document.getElementById('status-cards');
  if (!container) return;
  const list = window.STATUSES || [];
  container.innerHTML = '';

  const totalCard = document.createElement('div');
  totalCard.className = 'status-card total';
  totalCard.innerHTML = `
    <div class="icon"><i class="fas fa-users"></i></div>
    <div class="details"><h3>إجمالي العملاء</h3><div class="count" data-status="__total">0</div></div>`;
  totalCard.addEventListener('click', () => window.location.href = 'clients-by-status.html');
  container.appendChild(totalCard);

  list.forEach(s => {
    const card = document.createElement('div');
    card.className = 'status-card';
    const slug = s.slug || (s.key || '').replace(/\s+/g, '-').toLowerCase();
    if (slug) card.classList.add(slug);
    card.setAttribute('data-status', s.key);
    card.innerHTML = `
      <div class="icon" style="background:${s.color}"><i class="fas ${s.icon}"></i></div>
      <div class="details"><h3>${s.label}</h3><div class="count" data-status="${s.key}">0</div></div>
    `;
    card.addEventListener('click', () => window.location.href = `clients-by-status.html?status=${encodeURIComponent(s.key)}`);
    container.appendChild(card);
  });
}

function updateStats() {
  const counts = {};
  allClients.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1; });

  const totalEl = document.querySelector('.count[data-status="__total"]');
  if (totalEl) totalEl.textContent = allClients.length || 0;

  const cards = document.querySelectorAll('.count[data-status]');
  cards.forEach(el => {
    const key = el.getAttribute('data-status');
    if (key === '__total') return;
    el.textContent = counts[key] || 0;
  });
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
