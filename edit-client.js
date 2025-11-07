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
