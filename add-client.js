// Defensive: only attach if form exists
const addClientForm = document.getElementById("add-client-form");
if (addClientForm) {
  addClientForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const client = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      status: document.getElementById("status").value,
      notes: document.getElementById("notes").value
    };

    const msg = document.getElementById("success-msg");

    if (!client.name || !client.phone) {
      if (msg) { msg.textContent = "يرجى إدخال الاسم ورقم الهاتف"; msg.style.color = 'red'; }
      return;
    }

    try {
      const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client)
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      if (msg) { msg.textContent = "✅ تم إضافة العميل بنجاح"; msg.style.color = 'green'; }
      console.log(data);

      // clear fields
      addClientForm.reset();
    } catch (err) {
      console.error("❌ خطأ في الإضافة:", err);
      alert("حدث خطأ أثناء الإضافة");
    }
  });
}
