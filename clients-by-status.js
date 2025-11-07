document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const statusTitleElement = document.getElementById('status-title');
    const clientsContainer = document.getElementById('clients-list');
    const searchInput = document.getElementById('search-input');
    const dateFilter = document.getElementById('date-filter');

    // تحديث عنوان الصفحة
    if (statusTitleElement && status) {
        statusTitleElement.textContent = `العملاء - ${status}`;
        document.title = `العملاء - ${status} - Abdaa Entalek`;
    }

    // دالة جلب العملاء من السيرفر
    async function fetchClients() {
        try {
            const response = await fetch(`${window.API_BASE}/clients?status=${status}`);
            if (!response.ok) throw new Error('فشل في جلب البيانات');
            return await response.json();
        } catch (error) {
            console.error('خطأ:', error);
            return [];
        }
    }

    // دالة عرض العملاء
    function displayClients(clients) {
        if (!clientsContainer) return;
        
        clientsContainer.innerHTML = clients.length ? clients.map(client => `
            <div class="client-card ${client.status.toLowerCase().replace(' ', '-')}">
                <div class="client-info">
                    <h3>${client.name}</h3>
                    <p>📱 ${client.phone}</p>
                    <p>📅 ${new Date(client.createdAt).toLocaleDateString('ar-EG')}</p>
                    <p>📝 ${client.notes || 'لا توجد ملاحظات'}</p>
                </div>
                <div class="client-actions">
                    <button onclick="editClient('${client._id}')" class="edit-btn">تعديل</button>
                </div>
            </div>
        `).join('') : '<p class="no-clients">لا يوجد عملاء في هذه الحالة</p>';
    }

    // دالة البحث
    function searchClients(clients, searchTerm) {
        return clients.filter(client => 
            client.name.includes(searchTerm) || 
            client.phone.includes(searchTerm) ||
            client.notes?.includes(searchTerm)
        );
    }

    // دالة الفلترة بالتاريخ
    function filterByDate(clients, date) {
        if (!date) return clients;
        const filterDate = new Date(date).setHours(0,0,0,0);
        return clients.filter(client => {
            const clientDate = new Date(client.createdAt).setHours(0,0,0,0);
            return clientDate === filterDate;
        });
    }

    // دالة تصدير البيانات
    function exportData(clients, format) {
        if (format === 'pdf') {
            // يمكن إضافة مكتبة لتصدير PDF هنا
            alert('سيتم إضافة خاصية تصدير PDF قريباً');
        } else if (format === 'excel') {
            const headers = ['الاسم', 'رقم الهاتف', 'الحالة', 'التاريخ', 'ملاحظات'];
            const csvContent = [
                headers.join(','),
                ...clients.map(client => [
                    client.name,
                    client.phone,
                    client.status,
                    new Date(client.createdAt).toLocaleDateString('ar-EG'),
                    client.notes || ''
                ].join(','))
            ].join('\\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `clients-${status}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        }
    }

    // إضافة مستمعي الأحداث
    let allClients = [];
    
    fetchClients().then(clients => {
        allClients = clients;
        displayClients(clients);
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const filtered = searchClients(allClients, e.target.value);
            displayClients(filtered);
        });
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            const filtered = filterByDate(allClients, e.target.value);
            displayClients(filtered);
        });
    }

    // إضافة أزرار التصدير
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            exportData(allClients, btn.dataset.format);
        });
    });
});