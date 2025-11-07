const myClients = [
  {
    name: "أحمد عبدالله",
    phone: "01550731278",
    status: "مهتم",
    notes: "دفع امتحان وكتاب، في انتظار تحديد المستوى"
  },
  {
    name: "رانيا",
    phone: "01025441858",
    status: "حجز مؤكد",
    notes: "دفع 500 جنيه، الحضور الخميس"
  }
];

function showMyClients(status) {
  const list = document.getElementById("clients-list");
  list.innerHTML = "";

  const filtered = myClients.filter(c => c.status === status);

  filtered.forEach(client => {
    const div = document.createElement("div");
    div.className = "client-card";
    div.innerHTML = `
      <h3>${client.name}</h3>
      <p>📞 ${client.phone}</p>
      <p>📝 ${client.notes}</p>
      <button onclick="callClient('${client.phone}')">اتصال</button>
      <button onclick="whatsappClient('${client.phone}')">واتساب</button>
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
