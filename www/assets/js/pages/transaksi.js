let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");

const transaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('transaksi.html');
  },
  
  loadData: function() {
    $.get(`${apiUrl}api/Transaksi/showTransaksi?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
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
        $(".listview").append(`
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

document.addEventListener('deviceready', transaksi.init, false);

$(function() {
  transaksi.loadData();
});