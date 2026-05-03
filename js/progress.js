export function saveProgress(level, data) {
  localStorage.setItem(level, JSON.stringify(data));
}

export function getProgress(level) {
  return JSON.parse(localStorage.getItem(level)) || {};
}
