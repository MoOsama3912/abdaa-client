/**
 * هذا الملف يحتوي على إعدادات متغيرة مهمة للتطبيق، مثل عنوان API الأساسي.
 */

// 1. تعريف عنوان الـ API الأساسي (مهم جداً للاتصالات)
// 🛑 للحالة الحالية (التشغيل المحلي)، يجب أن يكون العنوان هو localhost:3000
const API_BASE = 'https://abdaa-server.vercel.app/api';// ملاحظة: إذا توقف السيرفر المحلي عن العمل، قم بتغييره مرة أخرى إلى 
// 'https://abdaa-server.vercel.app/api' للوصول إلى البيانات المنشورة (إذا كانت متاحة).

// 2. ضمان أن يكون المتغير متاحاً عالمياً في بيئة المتصفح
// التحقق من "window" ضروري لضمان عدم حدوث خطأ إذا تم تشغيل هذا الملف في Node.js
if (typeof window !== 'undefined') {
    window.API_BASE = API_BASE;
}

// 3. تعريف الأصناف (Classes) وجعلها متاحة عالمياً
// يجب جعل هذه الأصناف متاحة مباشرة عبر 'window' بدلاً من 'module.exports'
if (typeof window !== 'undefined') {
    
    // نظام الإشعارات
    class NotificationSystem {
        constructor() {
            this.followUps = [];
        }

        scheduleFollowUp(clientId, timeUntilFollowUp) {
            const followUp = { clientId, scheduledAt: Date.now() + timeUntilFollowUp };
            this.followUps.push(followUp);
            setTimeout(() => {
                this.sendReminder(followUp);
            }, timeUntilFollowUp);
            return followUp;
        }

        sendReminder(followUp) {
            // منطق إرسال التذكير
            console.log(`Sending reminder for client ${followUp.clientId}`);
        }
    }
    
    // نظام المتابعات
    class FollowUpSystem {
        constructor() {
            this.followUps = [];
        }

        addFollowUp(clientId, date) {
            const followUp = { clientId, date };
            this.followUps.push(followUp);
            return followUp;
        }
    }
    
    // جعل الأصناف متاحة عالمياً
    window.NotificationSystem = NotificationSystem;
    window.FollowUpSystem = FollowUpSystem;
}

// 🛑 تم حذف 'module.exports' لمنع أخطاء المتصفح 🛑