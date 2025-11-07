const clients = [
  { status: "مهتم" },
  { status: "غير مهتم" },
  { status: "حجز مؤكد" },
  { status: "مهتم" },
  { status: "مكالمة لاحقة" },
  { status: "حجز مؤكد" }
];

function calculateStats() {
  const stats = {};
  clients.forEach(c => {
    stats[c.status] = (stats[c.status] || 0) + 1;
  });

  const list = document.getElementById("stats-list");
  for (const [status, count] of Object.entries(stats)) {
    const li = document.createElement("li");
    li.textContent = `${status}: ${count} عميل`;
    list.appendChild(li);
  }
}

calculateStats();
