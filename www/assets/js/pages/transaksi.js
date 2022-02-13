const transaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('transaksi.html');
  }
}

document.addEventListener('deviceready', transaksi.init, false);