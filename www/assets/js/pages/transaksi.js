let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedNobukti: null,
  kekurangan: 0
}

const transaksi = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('transaksi.html');
  },
  
  loadData: function() {
    $.get(`${apiUrl}api/Transaksi/showTransaksi?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".tr-listview").html(null);

      if (data.metadata.status != 200) {
        $(".tr-listview").html(`
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
        $(".tr-listview").append(`
        <li>
          <a href="#" class="item btn-tools" data-nobukti="${val.nobukti}" data-kekurangan="${val.kekurangan}">
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

        totalTransaksi += parseFloat(val.kekurangan);
      });

      $(".tr-listview").append(`
        <li>
          <a href="#" class="item">
          <div class="in">
            <div>
              <h2>Total Piutang: ${module.numberWithCommas(totalTransaksi)}</h2>
            </div>
          </div>
        </li>`);
    });
  },

  updateBayar: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(`${apiUrl}api/Transaksi/updateBayar`, formData, function(data) {
      module.unblockUI();

      if (data.metadata.status != 200) {
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html(data.metadata.message);
        return false;
      }
  
      transaksi.loadData();
      $("#DialogForm").modal("hide");

      if (data.response.kembalian > 0) {
        $("#DialogInfo").modal("show");
        $("#info-message").html(`Terdapat kelebihan Bayar sejumlah Rp. ${module.numberWithCommas(data.response.kembalian)}`);
        return false;
      }
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
          append += `<span>${val.nama_barang} (${val.qty} ${val.satuan})</span> <br />`;
        });
      }

      $("#text-item").html(append);
    })
  }
}

document.addEventListener('deviceready', transaksi.init, false);

$(function() {
  transaksi.loadData();
});

$(document).on("click", ".btn-tools", function() {
  let nobukti = $(this).data("nobukti");
  let kekurangan = $(this).data("kekurangan");
  state.selectedNobukti = nobukti;
  state.kekurangan = kekurangan;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-edit", function() {
  if (state.selectedNobukti == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  $("#DialogForm").modal("show");
  $("#nobukti").val(state.selectedNobukti);
  $("#jumlah_bayar").val(state.kekurangan);
});

$(document).on("click", ".btn-detail", function() {
  if (state.selectedNobukti == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  $("#ModalDetail").modal("show");
  transaksi.loadDetailData();
});

$("#btn-update-transaksi").click(function() {
  let jumlah_bayar = $("#jumlah_bayar").val();

  if (state.selectedNobukti == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("nobukti", state.selectedNobukti);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);
  formData.append("jumlah_bayar", jumlah_bayar);

  transaksi.updateBayar(formData);
});