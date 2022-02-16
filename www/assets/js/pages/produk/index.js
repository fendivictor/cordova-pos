let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedKode: null
}

const masterProduk = {
  init: function() {
    module.loadSidebar();
  },

  loadData: function() {
    $.get(`${apiUrl}api/Produk/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".listview").append(`<li><a href="#" data-kode="${val.kode}" class="btn-tools">${val.kode} - ${val.nama}</a></li>`);
      }); 
    });
  },

  removeData: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(
      `${apiUrl}api/Produk/remove/`,
      formData,
      function(data) {
        module.unblockUI();
        masterProduk.loadData();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        toastbox("toast-success", 3000);
        $("#success-text").html(data.metadata.message);
      });
  },

  onBackKeyDown: function() {
    window.location.href = "product.html";
  }
}

document.addEventListener('deviceready', masterProduk.init, false);
document.addEventListener("backbutton", masterProduk.onBackKeyDown, false); 

// Event
$(function() {
  masterProduk.loadData();
});

$(document).on("click", ".btn-tools", function() {
  let kode = $(this).data("kode");
  state.selectedKode = kode;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-edit", function() {
  if (state.selectedKode == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  window.location.href = `form-produk.html?kode=${state.selectedKode}&action=edit`;
});

$(document).on("click", ".btn-delete", function() {
  $("#modalDelete").modal("show");
});

$("#btn-confirm-delete").click(function() {
  $("#modalDelete").modal("hide");

  if (state.selectedKode == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("kode", state.selectedKode);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);

  masterProduk.removeData(formData);
});