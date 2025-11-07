function addUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const msg = document.getElementById("user-msg");

  if (username && password) {
    // هنا المفروض نرسل البيانات للسيرفر أو نخزنها مؤقتًا
    msg.textContent = `تم إضافة المستخدم ${username} كـ ${role}`;
    msg.style.color = "green";

    // تفريغ الحقول
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  } else {
    msg.textContent = "يرجى إدخال اسم المستخدم وكلمة المرور";
    msg.style.color = "red";
  }
}

// If there's a form, attach submit handler
const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
  addUserForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addUser();
  });
}
