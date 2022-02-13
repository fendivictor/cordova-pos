const dashboard = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('index.html');
  }
}

document.addEventListener('deviceready', dashboard.init, false);