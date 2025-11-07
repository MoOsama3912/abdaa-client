let allClients = [];
let filteredClients = []; // لتخزين العملاء المفلترين بناءً على المندوب

// قائمة بالحالات كما تم تعريفها في statuses.js (يجب التأكد من تواجد هذا الملف)
// مثال تقديري:
const STATUSES = [
    { key: 'مكالمة منتظرة', label: 'مكالمة منتظرة', slug: 'waiting-call', icon: 'fa-clock', color: '#3B82F6' },
    { key: 'مهتم متابعة', label: 'مهتم متابعة', slug: 'interested-followup', icon: 'fa-handshake', color: '#10B981' },
    { key: 'غير مهتم', label: 'غير مهتم', slug: 'not-interested', icon: 'fa-times-circle', color: '#EF4444' },
    { key: 'محتمل بيفكر', label: 'محتمل بيفكر', slug: 'potential-thinking', icon: 'fa-lightbulb', color: '#F59E0B' },
    { key: 'مقابلة في المقر', label: 'مقابلة في المقر', slug: 'office-meeting', icon: 'fa-map-marker-alt', color: '#8B5CF6' },
    { key: 'تبرع مؤكد', label: 'تبرع مؤكد', slug: 'confirmed-donation', icon: 'fa-check-circle', color: '#059669' },
    { key: 'رقم خطأ', label: 'رقم خطأ', slug: 'wrong-number', icon: 'fa-phone-slash', color: '#6B7280' },
];

/**
 * جلب جميع العملاء من السيرفر.
 */
async function fetchClients() {
    try {
        const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients`);
        if (!res.ok) throw new Error('Failed to fetch clients');
        allClients = await res.json();
        
        // عند التحميل الأولي، العملاء المفلترون هم جميع العملاء
        filteredClients = [...allClients]; 

        // تحديث كل شيء بناءً على البيانات الأولية
        populateDelegates();
        renderStatusCards(); 
        updateStats(filteredClients); // تحديث الإحصائيات للكل
        // renderClients(allClients); // تم إزالة عرض العملاء في الداش بورد لتركيز الصفحة على الإحصائيات
        
    } catch (err) {
        console.error("❌ خطأ في تحميل العملاء:", err);
    }
}

/**
 * وظيفة عامة لتطبيق فلتر المندوب وتحديث الإحصائيات.
 * هذه الوظيفة يتم استدعاؤها من حقل الـ Select في dashboard.html
 * @param {string} delegateName - اسم المندوب المختار أو "all"
 */
function filterDashboardData(delegateName) {
    if (delegateName === "all") {
        filteredClients = [...allClients];
    } else {
        // تصفية العملاء بناءً على اسم المندوب
        filteredClients = allClients.filter(c => 
            (c.delegate && c.delegate.name === delegateName) || // إذا كان المندوب كائن
            (c.delegate === delegateName) // إذا كان المندوب مجرد اسم (String)
        );
    }
    
    // تحديث الإحصائيات بناءً على العملاء المفلترين فقط
    updateStats(filteredClients);
    console.log(`تم تصفية البيانات للمندوب: ${delegateName}. الإجمالي: ${filteredClients.length}`);
}


/**
 * ينشئ بطاقات الإحصائيات في الصفحة بناءً على قائمة الحالات.
 * تم تعديل الكود لاستخدام الهيكل الجديد في HTML.
 */
function renderStatusCards() {
    const container = document.querySelector('.status-summary-grid');
    if (!container) return;
    
    // استخدام الـ STATUSES المُعرَّفة أو المتاحة عالمياً
    const list = window.STATUSES || STATUSES; 
    container.innerHTML = ''; // تنظيف المحتوى الحالي

    // إضافة بطاقات الحالات
    list.forEach(s => {
        const card = document.createElement('div');
        // استخدام slug لربط التنسيق (مثل waiting-call)
        const slug = s.slug || (s.key || '').replace(/\s+/g, '-').toLowerCase(); 
        
        card.className = `status-card ${slug}`;
        card.setAttribute('data-status', s.key);
        
        // استخدام الـ IDs التي وضعناها في الـ HTML المُحدث
        card.innerHTML = `
            <div class="icon" style="background:${s.color || ''}"><i class="fas ${s.icon || 'fa-question-circle'}"></i></div>
            <h4>${s.label}</h4>
            <p id="count-${slug.replace(/-/g, '_')}" class="status-count">0</p>
        `;
        
        // ربط البطاقة بصفحة العملاء مع تمرير الحالة
        card.addEventListener('click', () => {
             // إضافة فلتر المندوب الحالي إلى رابط التصفح
             const selectedDelegate = document.getElementById('agent-filter')?.value;
             let url = `clients-by-status.html?status=${encodeURIComponent(s.key)}`;
             if (selectedDelegate && selectedDelegate !== 'all') {
                 url += `&delegate=${encodeURIComponent(selectedDelegate)}`;
             }
             window.location.href = url;
        });
        container.appendChild(card);
    });

    // إضافة بطاقة الإجمالي (كآخر بطاقة أو كأول بطاقة حسب التصميم)
    const totalCard = document.createElement('div');
    totalCard.className = 'status-card total-numbers highlight';
    totalCard.innerHTML = `
        <div class="icon total-numbers"><i class="fas fa-chart-line"></i></div>
        <h4>إجمالي الأرقام</h4>
        <p id="count-total-numbers" class="status-count">0</p>`;
    totalCard.addEventListener('click', () => window.location.href = 'clients-by-status.html');
    container.appendChild(totalCard);

    // تحديث الأرقام مباشرة بعد إنشاء البطاقات
    updateStats(filteredClients); 
}

/**
 * يحسب ويحدث الأرقام المعروضة في بطاقات الإحصائيات.
 * @param {Array} clientsData - العملاء الذين سيتم حساب إحصائياتهم (سواء كل العملاء أو المفلترون)
 */
function updateStats(clientsData) {
    const counts = {};
    const totalCount = clientsData.length;

    clientsData.forEach(c => { 
        const statusKey = c.status;
        counts[statusKey] = (counts[statusKey] || 0) + 1; 
    });

    // تحديث إجمالي الأرقام
    const totalEl = document.getElementById('count-total-numbers');
    if (totalEl) totalEl.textContent = totalCount || 0;

    // تحديث أرقام الحالات
    (window.STATUSES || STATUSES).forEach(s => {
        const slug = (s.slug || s.key.replace(/\s+/g, '-').toLowerCase()).replace(/-/g, '_');
        const el = document.getElementById(`count-${slug}`);
        if (el) {
            el.textContent = counts[s.key] || 0;
        }
    });
}

/**
 * يملأ قائمة المندوبين في فلتر لوحة التحكم العام.
 */
function populateDelegates() {
    // استخراج أسماء المندوبين الفريدة. ملاحظة: يجب تعديل هذا الكود إذا كان 'c.delegate' كائناً.
    const delegates = [...new Set(allClients.map(c => 
        (typeof c.delegate === 'object' && c.delegate !== null) ? c.delegate.name : c.delegate
    ).filter(Boolean))];
    
    const select = document.getElementById("agent-filter"); // استخدام الـ ID الجديد
    if (!select) return;
    
    select.innerHTML = '<option value="all">جميع المندوبين</option>';

    delegates.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
    
    // ربط الفلتر بوظيفة التصفية العامة
    select.addEventListener('change', (e) => filterDashboardData(e.target.value));
}

// ------------------------------------------
// وظائف لم تعد مستخدمة في الداش بورد أو تم تعديلها
// ------------------------------------------

// تم دمج منطق التصفية في filterDashboardData، لذا لم نعد بحاجة لـ filterClients و filterByDelegate
// function filterClients(status) { ... } // تم حذفها
// function filterByDelegate() { ... } // تم حذفها

// لم يعد هناك عرض لبطاقات العملاء في لوحة التحكم، لذا لم نعد بحاجة لـ renderClients
// function renderClients(clients) { ... } // تم حذفها

// ------------------------------------------
// وظائف الأحداث
// ------------------------------------------

document.addEventListener('DOMContentLoaded', async function() {
    // جلب البيانات الأولية
    await fetchClients();

    // ربط زر التحديث بوظيفة جلب البيانات
    const refreshBtn = document.getElementById('refresh-btn');
    if(refreshBtn) refreshBtn.addEventListener('click', fetchClients);

    // ربط وظيفة البحث السريع (لم يتم تعديلها، لكنها لا تعرض النتائج بشكل صحيح حالياً)
    const quickSearch = document.getElementById('quick-search');
    if (quickSearch) {
        quickSearch.addEventListener('input', async function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length < 2) return;

            try {
                // ملاحظة: هذا المسار يجب أن يتم تعديله ليعرض العملاء في نافذة منبثقة أو صفحة نتائج
                const searchResponse = await fetch(`${window.API_BASE}/clients/search?q=${encodeURIComponent(searchTerm)}`);
                if (!searchResponse.ok) throw new Error('فشل في البحث');
                const results = await searchResponse.json();
                console.log('نتائج البحث:', results);
                // **يجب إضافة منطق لعرض النتائج هنا**
            } catch (error) {
                console.error('خطأ في البحث:', error);
            }
        });
    }
    
    // ربط زر التحديث التلقائي (Auto Refresh)
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    let refreshInterval;

    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', function() {
            if (this.checked) {
                // التحديث كل 60 ثانية (يمكن تعديل القيمة)
                refreshInterval = setInterval(fetchClients, 60000); 
                console.log('التحديث التلقائي مفعل (60 ثانية)');
            } else {
                clearInterval(refreshInterval);
                console.log('التحديث التلقائي معطل');
            }
        });
    }

});


// إبقاء هذه الدالة للحذف في حال كانت مستخدمة في مكان ما آخر
async function deleteClient(id) {
    if (!confirm('هل تريد حذف هذا العميل؟')) return;
    try {
        const res = await fetch(`${window.API_BASE || 'http://localhost:5000'}/clients/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        // بعد الحذف، قم بتحديث البيانات
        fetchClients(); 
    } catch (err) {
        console.error('Error deleting client:', err);
        alert('حدث خطأ أثناء الحذف');
    }
}

// جعل دالة filterDashboardData متاحة عالمياً للوصول إليها من HTML
window.filterDashboardData = filterDashboardData;
window.deleteClient = deleteClient;