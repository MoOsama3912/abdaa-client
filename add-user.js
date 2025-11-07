document.addEventListener('DOMContentLoaded', function() {
    const addUserForm = document.getElementById('add-user-form');
    if (!addUserForm) return;

    const messageDiv = document.getElementById('user-msg');
    
    addUserForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');
        
        const formData = {
            username: document.getElementById('username').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';

            if (!window.API_BASE) throw new Error('خطأ في التكوين: API_BASE غير معرف');
            if (!navigator.onLine) throw new Error('لا يوجد اتصال بالإنترنت');

            const response = await fetch(`${window.API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'حدث خطأ في إضافة المستخدم');
            }

            messageDiv.className = 'alert alert-success';
            messageDiv.textContent = 'تم إضافة المستخدم بنجاح!';
            e.target.reset();
        } catch (error) {
            console.error('خطأ في إضافة المستخدم:', error);
            messageDiv.className = 'alert alert-danger';
            messageDiv.textContent = error.message;
        } finally {
            messageDiv.style.display = 'block';
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-user-plus"></i> إضافة المستخدم';
        }
    });
});
