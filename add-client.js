function addClient() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const status = document.getElementById("status").value;
  const notes = document.getElementById("notes").value;
  const msg = document.getElementById("success-msg");

  if (name && phone) {
    // هنا المفروض نرسل البيانات للسيرفر أو نخزنها مؤقتًا
    msg.textContent = "تم إضافة العميل بنجاح!";
    msg.style.color = "green";

    // تفريغ الحقول
    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("notes").value = "";
  } else {
    msg.textContent = "يرجى إدخال الاسم ورقم الهاتف";
    msg.style.color = "red";
  }
}

document.getElementById("add-client-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const client = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value
  };

  try {
    const res = await fetch("http://localhost:5000/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client)
    });

    const data = await res.json();
    alert("✅ تم إضافة العميل بنجاح");
    console.log(data);
  } catch (err) {
    console.error("❌ خطأ في الإضافة:", err);
    alert("حدث خطأ أثناء الإضافة");
  }
});
