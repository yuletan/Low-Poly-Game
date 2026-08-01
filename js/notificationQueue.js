// notificationQueue.js — Deduplicated, non-blocking alert queue.
// Replaces the single blocking flash message with stacked notifications.

export function createNotificationQueue(options = {}) {
  const host = options.host || document.body;
  const maxVisible = options.maxVisible || 3;
  const entries = new Map();
  const order = [];

  const container = document.createElement('div');
  container.id = 'notificationQueue';
  container.setAttribute('aria-live', 'polite');
  host.appendChild(container);

  function remove(key) {
    const entry = entries.get(key);
    if (!entry) return;
    clearTimeout(entry.timer);
    entry.element.remove();
    entries.delete(key);
    const index = order.indexOf(key);
    if (index >= 0) order.splice(index, 1);
  }

  function trim() {
    while (order.length > maxVisible) remove(order[0]);
  }

  function show(message, config = {}) {
    const key = config.key || message;
    const level = config.level || 'info';
    const duration = config.persistent ? 0 : (config.duration || 3200);
    let entry = entries.get(key);

    if (!entry) {
      const element = document.createElement('div');
      element.className = `notification notification-${level}`;
      element.dataset.key = key;
      container.appendChild(element);
      entry = { element, timer: null };
      entries.set(key, entry);
      order.push(key);
    }

    entry.element.textContent = message;
    entry.element.className = `notification notification-${level}`;
    clearTimeout(entry.timer);
    if (duration > 0) entry.timer = setTimeout(() => remove(key), duration);
    trim();
    return key;
  }

  return { show, remove, clear: () => [...order].forEach(remove), element: container };
}
