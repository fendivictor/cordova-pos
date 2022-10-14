let state = {
  updateUrl: null 
}

let idPerusahaan = auth.getCookie("id_perusahaan");
const today = moment().format('YYYY-MM-DD');
const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

const dashboard = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('index.html');
    dashboard.checkAppVersion();
    dashboard.transactionCounter(today, today, $("#penjualan-hari-ini"));
    dashboard.transactionCounter(startOfMonth, endOfMonth, $("#penjualan-bulan-ini"));
    dashboard.transactionProfit(today, today, $("#keuntungan-hari-ini"));
    dashboard.transactionProfit(startOfMonth, endOfMonth, $("#keuntungan-bulan-ini"));
  },

  transactionCounter: function(startdate, enddate, element) {
    $.get(`${apiUrl}api/Transaksi/findPenjualanByDateRange`, {
      "id_perusahaan": idPerusahaan,
      "startdate": startdate,
      "enddate": enddate
    }).done(function(data) {
      element.html(module.numberWithCommas(data.response.total_penjualan === null ? 0 : data.response.total_penjualan));
    });
  },

  transactionProfit: function(startdate, enddate, element) {
    $.get(`${apiUrl}api/Transaksi/findProfitByDateRange`, {
      "id_perusahaan": idPerusahaan,
      "startdate": startdate,
      "enddate": enddate
    }).done(function(data) {
      element.html(module.numberWithCommas(data.response.profit === null ? 0 : data.response.profit));
    });
  },

  checkAppVersion: function() {
    $.get(`${apiUrl}api/Version`)
    .done(function(data) {
      if (data.response.version > appVersion) {
        $("#modalUpdate").modal("show");
        state.updateUrl = data.response.url;

        if(data.response.is_required == 1) {
          $("#btn-update-later").addClass("d-none");
        }
      }
    });
  }
}

document.addEventListener('deviceready', dashboard.init, false);

$("#btn-update-now").click(function() {
  if (state.updateUrl == null) {
    return false;
  }

  window.open(`${state.updateUrl}`, "_blank");
});