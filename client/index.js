if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

if(module.hot) {
  module.hot.accept()
}