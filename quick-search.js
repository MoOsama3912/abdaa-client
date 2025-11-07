document.addEventListener('DOMContentLoaded', () => {
    const quickSearch = document.getElementById('quick-search');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    quickSearch.parentElement.appendChild(searchResults);

    let searchTimeout;

    quickSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        
        // مسح نتائج البحث السابقة
        clearTimeout(searchTimeout);
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // انتظار للبحث لتجنب الطلبات الكثيرة
        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`${apiUrl}/clients/search?term=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error('فشل في البحث');
                
                const clients = await response.json();
                displaySearchResults(clients);
            } catch (error) {
                console.error('خطأ في البحث:', error);
            }
        }, 300);
    });

    function displaySearchResults(clients) {
        if (!clients.length) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.innerHTML = clients.map(client => `
            <div class="search-result-item" onclick="window.location.href='edit-client.html?id=${client._id}'">
                <div class="client-name">${client.name}</div>
                <div class="client-info">
                    <span class="phone">${client.phone}</span>
                    <span class="status ${client.status.toLowerCase().replace(' ', '-')}">${client.status}</span>
                </div>
            </div>
        `).join('');

        searchResults.style.display = 'block';
    }

    // إخفاء نتائج البحث عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== quickSearch) {
            searchResults.style.display = 'none';
        }
    });
});