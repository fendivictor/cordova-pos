let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedId: null
}

const masterKategori = {
  init: function() {
    module.loadSidebar();
  },
  
  loadData: function() {
    $.get(`${apiUrl}api/master/Kategori/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".listview").append(`<li><a href="#" data-id="${val.id}" class="btn-tools">${val.kategori}</a></li>`);
      });
    });
  },

  removeData: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(
      `${apiUrl}api/master/Kategori/remove/`,
      formData,
      function(data) {
        module.unblockUI();
        masterKategori.loadData();

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

document.addEventListener('deviceready', masterKategori.init, false);
document.addEventListener("backbutton", masterKategori.onBackKeyDown, false); 

// Event
$(function() {
  masterKategori.loadData();
});

$(document).on("click", ".btn-tools", function() {
  let id = $(this).data("id");
  state.selectedId = id;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-edit", function() {
  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  window.location.href = `form-satuan.html?id=${state.selectedId}&action=edit`;
});

$(document).on("click", ".btn-delete", function() {
  $("#modalDelete").modal("show");
});

$("#btn-confirm-delete").click(function() {
  $("#modalDelete").modal("hide");

  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("id", state.selectedId);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);

  masterKategori.removeData(formData);
});