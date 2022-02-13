const historyTransaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('history-transaksi.html');
  }
}

document.addEventListener('deviceready', historyTransaksi.init, false);