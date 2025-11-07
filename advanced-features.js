// نظام الإشعارات
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.setupNotificationPanel();
    }

    setupNotificationPanel() {
        const panel = document.createElement('div');
        panel.className = 'notifications-panel';
        document.body.appendChild(panel);
    }

    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            time: new Date()
        };
        this.notifications.push(notification);
        this.displayNotification(notification);
        this.scheduleReminder(notification);
    }

    displayNotification(notification) {
        const panel = document.querySelector('.notifications-panel');
        const element = document.createElement('div');
        element.className = `notification-item ${notification.type}`;
        element.innerHTML = `
            <div class="notification-content">${notification.message}</div>
            <div class="time">${notification.time.toLocaleTimeString()}</div>
        `;
        panel.appendChild(element);
    }

    scheduleReminder(notification) {
        // يمكن إضافة منطق لجدولة التذكيرات هنا
    }
}

// نظام جدولة المكالمات
class CallScheduler {
    constructor() {
        this.calls = [];
        this.setupCalendar();
    }

    setupCalendar() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    renderCalendar() {
        const container = document.querySelector('.calendar-container');
        if (!container) return;

        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        let calendarHTML = `
            <div class="calendar-header">
                <h3>${now.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</h3>
            </div>
            <div class="calendar-grid">
        `;

        for (let i = 1; i <= daysInMonth; i++) {
            const hasCallsClass = this.hasCallsOnDay(i) ? 'has-calls' : '';
            calendarHTML += `
                <div class="calendar-day ${hasCallsClass}" data-day="${i}">
                    <span class="day-number">${i}</span>
                </div>
            `;
        }

        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
    }

    hasCallsOnDay(day) {
        return this.calls.some(call => {
            const callDate = new Date(call.date);
            return callDate.getDate() === day;
        });
    }

    addCall(clientId, date, notes) {
        const call = { clientId, date, notes };
        this.calls.push(call);
        this.renderCalendar();
        return call;
    }
}

// نظام التحليلات
class AnalyticsSystem {
    constructor() {
        this.charts = {};
        this.setupCharts();
    }

    async setupCharts() {
        const data = await this.fetchAnalyticsData();
        this.createConversionChart(data.conversions);
        this.createPerformanceChart(data.performance);
    }

    async fetchAnalyticsData() {
        try {
            const response = await fetch(`${apiUrl}/analytics`);
            return await response.json();
        } catch (error) {
            console.error('خطأ في جلب البيانات التحليلية:', error);
            return { conversions: [], performance: [] };
        }
    }

    createConversionChart(data) {
        // إنشاء الرسم البياني للتحويلات
    }

    createPerformanceChart(data) {
        // إنشاء الرسم البياني لأداء المندوبين
    }
}

// نظام المتابعة الدورية
class FollowUpSystem {
    constructor() {
        this.followUps = [];
        this.setupReminders();
    }

    addFollowUp(clientId, date, notes) {
        const followUp = { clientId, date, notes, completed: false };
        this.followUps.push(followUp);
        this.scheduleReminder(followUp);
        return followUp;
    }

    scheduleReminder(followUp) {
        const now = new Date();
        const followUpDate = new Date(followUp.date);
        const timeUntilFollowUp = followUpDate - now;

        if (timeUntilFollowUp > 0) {
            setTimeout(() => {
                this.sendReminder(followUp);
            }, timeUntilFollowUp);
        }
    }

    sendReminder(followUp) {
        // إرسال تذكير للمتابعة
    }
}

// نظام المراسلات
class MessagingSystem {
    constructor() {
        this.messageTemplates = this.loadMessageTemplates();
    }

    loadMessageTemplates() {
        return [
            {
                id: 1,
                name: 'ترحيب',
                content: 'مرحباً {clientName}، شكراً لاهتمامك بخدماتنا.'
            },
            {
                id: 2,
                name: 'متابعة',
                content: 'مرحباً {clientName}، نود الاطمئنان على رأيك في خدماتنا.'
            }
        ];
    }

    async sendMessage(clientId, templateId, customData = {}) {
        const template = this.messageTemplates.find(t => t.id === templateId);
        if (!template) return;

        let message = template.content;
        Object.entries(customData).forEach(([key, value]) => {
            message = message.replace(`{${key}}`, value);
        });

        try {
            const response = await fetch(`${apiUrl}/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId,
                    message
                })
            });
            return await response.json();
        } catch (error) {
            console.error('خطأ في إرسال الرسالة:', error);
            throw error;
        }
    }
}

// تهيئة الأنظمة
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
    window.callScheduler = new CallScheduler();
    window.analyticsSystem = new AnalyticsSystem();
    window.followUpSystem = new FollowUpSystem();
    window.messagingSystem = new MessagingSystem();

    // إعداد اختصارات لوحة المفاتيح
    setupKeyboardShortcuts();
});

// اختصارات لوحة المفاتيح
function setupKeyboardShortcuts() {
    const shortcuts = {
        'n': () => window.location.href = 'add-client.html',
        's': () => document.querySelector('#quick-search').focus(),
        'h': () => window.location.href = 'dashboard.html',
        'r': () => window.location.reload()
    };

    document.addEventListener('keydown', (e) => {
        if (e.altKey && shortcuts[e.key]) {
            e.preventDefault();
            shortcuts[e.key]();
        }
    });
}