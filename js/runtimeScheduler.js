// runtimeScheduler.js — A small shared scheduler for periodic entity work.
// Spreads per-unit tasks across slots so the whole army never does the same
// work on the same frame.

export class RuntimeScheduler {
  constructor(options = {}) {
    this.time = 0;
    this.slotCount = Math.max(1, options.slotCount || 8);
    this.records = new WeakMap();
  }

  update(dt) {
    this.time += Math.max(0, dt || 0);
  }

  phaseFor(entity, salt = 0) {
    const id = entity?._debugId ?? entity?.id ?? 0;
    return Math.abs((id * 2654435761 + salt * 1013904223) % this.slotCount);
  }

  shouldRun(entity, taskName, interval, salt = 0) {
    const safeInterval = Math.max(0.01, interval || 0.01);
    let record = this.records.get(entity);
    if (!record) {
      record = new Map();
      this.records.set(entity, record);
    }

    let nextAt = record.get(taskName);
    if (nextAt == null) {
      const phase = this.phaseFor(entity, salt) / this.slotCount;
      nextAt = this.time + phase * safeInterval;
      record.set(taskName, nextAt);
    }

    if (this.time < nextAt) return false;

    // Preserve overflow and avoid synchronizing all entities on the current frame.
    do nextAt += safeInterval;
    while (nextAt <= this.time);
    record.set(taskName, nextAt);
    return true;
  }

  clear(entity, taskName) {
    const record = this.records.get(entity);
    if (!record) return;
    if (taskName == null) this.records.delete(entity);
    else record.delete(taskName);
  }
}
