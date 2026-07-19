// debug.js — shared verbose transport logging. Disabled (no-op) in production.
// Set DEBUG to true to trace transport/AI decisions in the console.
const DEBUG = false;

export const tlog = DEBUG ? console.log.bind(console) : () => {};
export const twarn = DEBUG ? console.warn.bind(console) : () => {};
