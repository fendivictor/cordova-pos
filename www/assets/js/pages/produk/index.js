const masterProduk = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('product.html');
  }
}

document.addEventListener('deviceready', masterProduk.init, false);