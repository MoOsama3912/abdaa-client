/* Central list of statuses used across the client app */
(function(){
  const STATUSES = [
    { key: 'مكالمة منتظرة', label: 'مكالمة منتظرة', icon: 'fa-phone', color: '#3B82F6' },
    { key: 'مهتم متابعة', label: 'مهتم متابعة', icon: 'fa-star', color: '#10B981' },
    { key: 'غير مهتم', label: 'غير مهتم', icon: 'fa-times-circle', color: '#EF4444' },
    { key: 'محتمل بيفكر', label: 'محتمل بيفكر', icon: 'fa-lightbulb', color: '#F59E0B' },
    { key: 'مقابلة في المقر', label: 'مقابلة في المقر', icon: 'fa-handshake', color: '#8B5CF6' },
    { key: 'تبرع مؤكد', label: 'تبرع مؤكد', icon: 'fa-check-circle', color: '#059669' },
    { key: 'رقم خطأ', label: 'رقم خطأ', icon: 'fa-exclamation-circle', color: '#6B7280' }
  ];

  if (typeof window !== 'undefined') window.STATUSES = STATUSES;
  if (typeof module !== 'undefined' && module.exports) module.exports = STATUSES;
})();
