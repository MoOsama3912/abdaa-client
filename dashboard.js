const clients = [
  {
    name: "حسام محمدين",
    phone: "01228089404",
    status: "حجز مؤكد",
    notes: "حجز كورس فرنساوي (مستوي واحد فقط)"
  },
  {
    name: "إيمان محمد",
    phone: "01140069108",
    status: "حجز مؤكد",
    notes: "في انتظار تحويل 850 جنيه"
  },
  {
    name: "ريم عادل",
    phone: "01003304177",
    status: "مهتم",
    notes: "كورسات صيني"
  }
];

function showClients(status) {
  const list = document.getElementById("clients-list");
  list.innerHTML = "";

  const filtered = clients.filter(c => c.status === status);

  filtered.forEach(client => {
    const div = document.createElement("div");
    div.className = "client-card";
    div.innerHTML = `
      <h3>${client.name}</h3>
      <p>📞 ${client.phone}</p>
      <p>📝 ${client.notes}</p>
      <button onclick="callClient('${client.phone}')">اتصال</button>
      <button onclick="whatsappClient('${client.phone}')">واتساب</button>
      <button onclick="editClient('${client.name}')">تعديل</button>
    `;
    list.appendChild(div);
  });
}

function callClient(phone) {
  window.location.href = `tel:${phone}`;
}

function whatsappClient(phone) {
  window.open(`https://wa.me/2${phone}`, "_blank");
}

function editClient(name) {
  alert(`تعديل بيانات العميل: ${name}`);
}

async function fetchClients() {
  try {
    const res = await fetch("http://localhost:5000/clients");
    const clients = await res.json();

    const container = document.getElementById("clients-container");
    container.innerHTML = ""; // مسح المحتوى القديم

    clients.forEach(client => {
      const card = document.createElement("div");
      card.className = "client-card";

      card.innerHTML = `
        <h3>${client.name}</h3>
        <p><strong>Phone:</strong> ${client.phone}</p>
        <p><strong>Status:</strong> ${client.status}</p>
        <p><strong>Notes:</strong> ${client.notes}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("❌ خطأ في تحميل العملاء:", err);
  }
}

// تحميل العملاء عند فتح الصفحة
window.onload = fetchClients;
