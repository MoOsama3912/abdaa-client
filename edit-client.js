function updateClient() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status").value;
  const notes = document.getElementById("notes").value;
  const msg = document.getElementById("update-msg");

  if (name && phone) {
    // هنا المفروض نرسل التعديلات للسيرفر أو نخزنها مؤقتًا
    msg.textContent = "تم حفظ التعديلات بنجاح!";
    msg.style.color = "green";
  } else {
    msg.textContent = "يرجى إدخال الاسم ورقم الهاتف";
    msg.style.color = "red";
  }
}


const clientId = new URLSearchParams(window.location.search).get("id");

async function loadClient() {
  if (!clientId) return;
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients/${clientId}`);
    if (!res.ok) throw new Error('Failed to fetch client');
    const client = await res.json();

    document.getElementById("name").value = client.name || '';
    document.getElementById("phone").value = client.phone || '';
    document.getElementById("status").value = client.status || '';
    const delegateEl = document.getElementById("delegate");
    if (delegateEl) delegateEl.value = client.delegate || "";
    document.getElementById("notes").value = client.notes || "";
  } catch (err) {
    console.error('Error loading client:', err);
  }
}

const editForm = document.getElementById("edit-client-form");
if (editForm) {
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const updatedClient = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      status: document.getElementById("status").value,
      delegate: document.getElementById("delegate").value,
      notes: document.getElementById("notes").value
    };

    try {
      const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient)
      });

      if (!res.ok) throw new Error('Failed to update client');

      alert("✅ تم حفظ التعديلات");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error('Error updating client:', err);
      alert('حدث خطأ أثناء حفظ التعديلات');
    }
  });
}

window.addEventListener('load', loadClient);
