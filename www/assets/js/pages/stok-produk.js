let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let fileTransfer;
let storageLocation;
let fileOpener;
let state = {
  tanggalMutasiAwal: moment(),
  tanggalMutasiAkhir: moment()
}

const stokProduk = {
  init: function() {
    module.loadSidebar();
    storageLocation = cordova.file.externalDataDirectory;
    fileOpener = cordova.plugins.fileOpener2;
  },
  
  loadData: function() {
    let lokasi = $("#lokasi").val();

    $.get(`${apiUrl}api/Stok/find?id_perusahaan=${idPerusahaan}&id_toko=${lokasi}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".listview").append(`
        <li>
          <a href="#" class="item">
            <div class="in">
              <div>
                <header>${val.kode}</header>
                ${val.nama}
                <footer>${val.qty} ${val.satuan}</footer>
              </div>
            </div>
          </a>
        </li>`);
      });
    });
  },

  onBackKeyDown: function() {
    window.location.href = "product.html";
  },

  loadToko: function() {
    $.get(`${apiUrl}api/Toko/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#lokasi").html(null);

      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#lokasi").append(`<option value="${val.id}">${val.nama_toko}</option>`);
      });

      stokProduk.loadData();
    });
  },

  onDownloadFile: function(args) {
    fileTransfer = new FileTransfer();
    let url = encodeURI(args.url);

    module.blockUI();

    fileTransfer.download(
      url,
      args.targetPath,
      function(entry) {
        module.unblockUI();
        fileOpener.open(
          entry.toURL(),
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          {
            error: function() {
              Swal.fire("Gagal", "Tidak menemukan aplikasi yang sesuai", "error");
            }
          }
        )
      },
      function (error) {
        console.log(error);
        module.unblockUI();
      },
      true,
      args.options
    )
  }
}

document.addEventListener('deviceready', stokProduk.init, false);
document.addEventListener("backbutton", stokProduk.onBackKeyDown, false); 

// Event
$(function() {
  stokProduk.loadToko();
  $("#tanggal-mutasi-awal").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
      format: "DD/MM/YYYY"
    }
  }, function(start, end) {
    state.tanggalMutasiAwal = start;
    state.tanggalMutasiAwal = end;
  });

  $("#tanggal-mutasi-akhir").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    locale: {
      format: "DD/MM/YYYY"
    }
  }, function(start, end) {
    state.tanggalMutasiAkhir = start;
    state.tanggalMutasiAkhir = end;
  });
});

$("#lokasi").change(function(e) {
  stokProduk.loadData();
});

$("#download-kartu-stok").click(function() {
  $("#ModalKartuStok").modal("show");
});

$("#form-kartu-stok").submit(function(e) {
  e.preventDefault();

  stokProduk.onDownloadFile({
    url: `${apiUrl}/api/Stok/excelKartuStok?start=${state.tanggalMutasiAwal.format("YYYY-MM-DD")}&end=${state.tanggalMutasiAkhir.format("YYYY-MM-DD")}&id_perusahaan=${idPerusahaan}`,
    targetPath: `${storageLocation}kartu-stok-${state.tanggalMutasiAwal.format("DDMMYY")}-${state.tanggalMutasiAkhir.format("DDMMYY")}.xlsx`,
    options: {}
  });
});