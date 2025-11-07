async function loadDelegates() {
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/delegates`);
    if (!res.ok) throw new Error('Failed to load delegates');
    const delegates = await res.json();

    const list = document.getElementById("delegate-list");
    if (!list) return;
    list.innerHTML = "";

    delegates.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.name;
      li.innerHTML += ` <button onclick="deleteDelegate('${d._id}')">🗑️ حذف</button>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading delegates:', err);
  }
}

const addDelegateForm = document.getElementById("add-delegate-form");
if (addDelegateForm) {
  addDelegateForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("delegate-name").value;

    try {
      const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/delegates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error('Failed to add delegate');

      document.getElementById("delegate-name").value = "";
      loadDelegates();
    } catch (err) {
      console.error('Error adding delegate:', err);
      alert('حدث خطأ أثناء الإضافة');
    }
  });
}

async function deleteDelegate(id) {
  if (!confirm('هل أنت متأكد من حذف هذا المندوب؟')) return;
  try {
    const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/delegates/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error('Failed to delete');
    loadDelegates();
  } catch (err) {
    console.error('Error deleting delegate:', err);
    alert('حدث خطأ أثناء الحذف');
  }
}

window.addEventListener('load', loadDelegates);
