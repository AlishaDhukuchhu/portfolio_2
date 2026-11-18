/* Global toast utility — call from any page without prop-drilling */
let _addToast = null;
let _id = 0;

export function _registerToast(fn) {
  _addToast = fn;
}

function show(type, message, title) {
  if (_addToast) _addToast({ id: ++_id, type, message, title });
}

export const toast = {
  success: (message, title) => show('success', message, title),
  error:   (message, title) => show('error',   message, title),
  warning: (message, title) => show('warning', message, title),
  info:    (message, title) => show('info',    message, title),
};
