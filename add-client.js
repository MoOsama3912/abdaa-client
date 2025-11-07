document.addEventListener('DOMContentLoaded', function() {
  console.log('تم تحميل الصفحة:', window.API_BASE);

  const addClientForm = document.getElementById("add-client-form");
  if (!addClientForm) {
    console.error('لم يتم العثور على نموذج إضافة العميل');
    return;
  }

  window.addEventListener('online', function() {
    const msg = document.getElementById("success-msg");
    if (msg) {
      msg.textContent = "تم استعادة الاتصال بالإنترنت";
      msg.style.color = 'green';
    }
  });

  window.addEventListener('offline', function() {
    const msg = document.getElementById("success-msg");
    if (msg) {
      msg.textContent = "لا يوجد اتصال بالإنترنت";
      msg.style.color = 'red';
    }
  });

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
      if (msg) {
        msg.textContent = "يرجى إدخال الاسم ورقم الهاتف";
        msg.style.color = 'red';
      }
      return;
    }

    try {
      if (msg) {
        msg.textContent = "جاري إضافة العميل...";
        msg.style.color = 'blue';
      }

      if (!navigator.onLine) {
        throw new Error("لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.");
      }

      const res = await fetch(`${window.API_BASE}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": "https://abdaa-client.vercel.app"
        },
        mode: 'cors',
        body: JSON.stringify(client)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("استجابة السيرفر:", res.status, errorData);
        throw new Error(errorData.message || 'حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.');
      }

      const data = await res.json();
      if (msg) {
        msg.textContent = "✅ تم إضافة العميل بنجاح";
        msg.style.color = 'green';
      }
      console.log("تم إضافة العميل بنجاح:", data);

      // تحديث عداد الحالة في الداشبورد
      updateStatusCount(client.status);

      // تحديث إجمالي الأرقام
      updateStatusCount("إجمالي الأرقام");

      // مسح الحقول
      addClientForm.reset();
    } catch (err) {
      console.error("❌ خطأ في الإضافة:", err);
      if (msg) {
        msg.textContent = err.message || "حدث خطأ أثناء الإضافة. يرجى المحاولة مرة أخرى لاحقاً.";
        msg.style.color = 'red';
      }
    }
  });

  function updateStatusCount(statusName) {
    const cards = document.querySelectorAll(".status-card");
    cards.forEach(card => {
      const title = card.querySelector("h3");
      const count = card.querySelector(".count");
      if (title && count && title.textContent.trim() === statusName.trim()) {
        let current = parseInt(count.textContent);
        count.textContent = current + 1;
      }
    });
  }
});
