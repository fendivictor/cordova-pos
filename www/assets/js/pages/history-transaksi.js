let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedNobukti: null,
  tanggalTransaksi: moment(),
  selectedDevice: null
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

$("#btn-cetak-transaksi").click(function() {
  BTPrinter.connected(function(data){
    if (data == 'false') {
      BTPrinter.list(function(data){
        $("#list-devices").html(null);
        let listDevices = "";
        data.forEach(function(val, i) {
          if (i % 3 == 0 || i == 0) {
            listDevices += `
            <li>
              <a href="#" class="btn btn-list btn-select-device" data-device="${val}" data-dismiss="modal">
                <span>
                  <ion-icon name="list-outline"></ion-icon>
                  ${val}
                </span>
              </a>
            </li>`;
          }
        });
        $("#list-devices").append(listDevices);
        $("#actionBluetooth").modal("show");
      },function(err){
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html("Gagal Mencari Printer");
        return false;
      });
    } else {
      module.blockUI();

      $.get(`${apiUrl}api/Transaksi/detailTransaksi`, {
        "id_perusahaan": idPerusahaan,
        "nobukti": state.selectedNobukti
      })
      .done(function(data) {
        module.unblockUI();

        BTPrinter.printTextSizeAlign(null, null, data.response.header.nama_toko, 0, 1);
        BTPrinter.printTextSizeAlign(null, null, data.response.header.nobukti, 1, 0);
        BTPrinter.printTextSizeAlign(null, null, data.response.header.nama_customer, 1, 0);
        BTPrinter.printTextSizeAlign(null, null, moment(data.response.header.tgl).format("DD/MM/YYYY"), 1, 0);  

        let details = data.response.detail;
        if (details.length > 0) {
          details.forEach(function(val, i) {
            BTPrinter.printTextSizeAlign(null, null, `${val.nama_barang}`, 1, 0);
            BTPrinter.printTextSizeAlign(null, null, `(${val.qty} ${val.satuan}) x Rp. ${module.numberWithCommas(val.harga_jual)} = ${module.numberWithCommas(val.qty * val.harga_jual)}`, 1, 0);
          });
        }

        BTPrinter.printTextSizeAlign(null, null, `Total: Rp. ${module.numberWithCommas(data.response.header.total)}`, 1, 0);
        BTPrinter.printPOSCommand(null, null, "0C");
        BTPrinter.printPOSCommand(null, null, "0C");
        BTPrinter.printPOSCommand(null, null, "0C");
      })
    }
  },function(err){
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Gagal Konek ke printer");
    return false;
  });
});

$(document).on("click", ".btn-select-device", function() {
  let device = $(this).data("device");

  state.selectedDevice = device;

  BTPrinter.connect(function(data){
    $("#DialogInfo").modal("show");
    $("#info-message").html(`Berhasil Konek dengan Printer`);
  },function(err){
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Gagal Konek ke printer");
    return false;
  }, device);
});