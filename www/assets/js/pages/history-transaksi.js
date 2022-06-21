let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedNobukti: null,
  tanggalTransaksi: moment()
}

const historyTransaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('history-transaksi.html');
  },

  loadData: function() {
    $.get(`${apiUrl}api/Transaksi/showHistory?id_perusahaan=${idPerusahaan}&tanggal_transaksi=${state.tanggalTransaksi.format("YYYY-MM-DD")}`)
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

      let totalTransaksi = 0;
      data.response.forEach(function(val, i) {
        $(".history-listview").append(`
        <li>
          <a href="#" class="item btn-tools" data-nobukti="${val.nobukti}">
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

        totalTransaksi += parseFloat(val.total);
      });

      $(".history-listview").append(`
        <li>
          <a href="#" class="item">
          <div class="in">
            <div>
              <h2>Total: ${module.numberWithCommas(totalTransaksi)}</h2>
            </div>
          </div>
        </li>`);
    });
  },

  loadDetailData: function() {
    module.blockUI();

    $.get(`${apiUrl}api/Transaksi/detailTransaksi`, {
      "id_perusahaan": idPerusahaan,
      "nobukti": state.selectedNobukti
    })
    .done(function(data) {
      module.unblockUI();

      $("#modalDetail").modal("show");

      $("#text-toko").html(data.response.header.nama_toko);
      $("#text-nobukti").html(data.response.header.nobukti);
      $("#text-customer").html(data.response.header.nama_customer);
      $("#text-tgl").html(moment(data.response.header.tgl).format("DD/MM/YYYY"));
      $("#text-total").html(module.numberWithCommas(data.response.header.total));

      let details = data.response.detail;
      let append = "";
      if (details.length > 0) {
        details.forEach(function(val, i) {
          append += `<span>${val.nama_barang} (${val.qty} ${val.satuan}) @ Rp. ${module.numberWithCommas(val.harga_jual)}</span> <br />`;
        });
      }

      $("#text-item").html(append);
    })
  }
}

document.addEventListener('deviceready', historyTransaksi.init, false);

$(function() {
  historyTransaksi.loadData();

  $("#tanggal-transaksi").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
      format: "DD/MM/YYYY"
    }
  }, function(response) {
    state.tanggalTransaksi = response;

    historyTransaksi.loadData();
  });
});

$(document).on("click", ".btn-tools", function(e) {
  e.preventDefault();
  let nobukti = $(this).data("nobukti");
  state.selectedNobukti = nobukti;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-detail", function() {
  if (state.selectedNobukti == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  $("#ModalDetail").modal("show");
  historyTransaksi.loadDetailData();
});