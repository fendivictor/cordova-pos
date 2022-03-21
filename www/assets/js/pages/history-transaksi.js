let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");

const historyTransaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('history-transaksi.html');
  },

  loadData: function() {
    $.get(`${apiUrl}api/Transaksi/showHistory?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".history-listview").html(null);

      if (data.metadata.status != 200) {
        $(".history-listview").html(`
          <li>
            <a href="#" class="item">
              <div class="in">
                <div>Data tidak ditemukan</div>
              </div>
            </a>
          </li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".history-listview").append(`
        <li>
          <a href="#" class="item">
            <div class="in">
              <div>
                <header>${val.nobukti} ${val.nama_toko}</header>
                ${val.nama_customer} <br />
                <small>Total: ${module.numberWithCommas(val.total)}</small> <br />
                ${val.kekurangan > 0 ? `<small>Piutang: ${module.numberWithCommas(val.kekurangan)}</small>` : ``}
                <footer>${moment(val.insert_at).format("DD/MM/YYYY HH:mm")}</footer>
              </div>
            </div>
          </a>
        </li>`);
      });
    });
  },
}

document.addEventListener('deviceready', historyTransaksi.init, false);

$(function() {
  historyTransaksi.loadData();
});