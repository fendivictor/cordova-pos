const product = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('product.html');
  }
}

document.addEventListener('deviceready', product.init, false);