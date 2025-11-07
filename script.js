function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  if (username === "Mohamed" && password === "392012") {
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "بيانات الدخول غير صحيحة";
  }
}
