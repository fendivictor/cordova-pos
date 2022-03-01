let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  selectedId: null,
  produk: null,
  qty: 0
}

const formPenerimaan = {
  init: function() {
    module.loadSidebar();
  },

  loadSupplier: function() {
    $.get(`${apiUrl}api/Supplier/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#supplier").html(null);

      $("#supplier").append(`<option value="">Pilih Supplier</option>`);
      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#supplier").append(`<option value="${val.kode}">${val.nama_supplier}</option>`);
      });
    });
  },

  loadToko: function() {
    $.get(`${apiUrl}api/Toko/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#lokasi").html(null);

      $("#lokasi").append(`<option value="">Pilih Toko</option>`);
      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#lokasi").append(`<option value="${val.id}">${val.nama_toko}</option>`);
      });
    });
  },

  loadData: function(params) {
    $.get(`${apiUrl}api/Produk/find?id_perusahaan=${idPerusahaan}&order_column=nama&order_mode=asc&nama=${params.nama}`)
    .done(function(data) {
      $(".item-listview").html(null);

      if (data.metadata.status != 200) {
        $(".item-listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".item-listview").append(`<li><a href="#" data-kode="${val.kode}" class="btn-add-to-cart">${val.kode} - ${val.nama}</a></li>`);
      }); 
    });
  },

  loadCartItem: function(params) {
    $.get(`${apiUrl}api/Penerimaan/showTemp?id_perusahaan=${idPerusahaan}&username=${username}&kode=`)
    .done(function(data) {
      $(".cart-listview").html(null);

      if (data.metadata.status != 200) {
        $(".cart-listview").html(`
          <li><a href="#">Belum ada Produk ditambahkan</a></li>
        `);
        $("#btn-create-penerimaan").attr("disabled", true);
        return false;
      }
      $("#btn-create-penerimaan").attr("disabled", false);
      data.response.forEach(function(val, i) {
        $(".cart-listview").append(`<li><a href="#" data-id="${val.id}" data-produk="${val.kode} - ${val.nama}" data-qty="${val.qty}" class="btn-tools">${val.kode} - ${val.nama}<span class="badge badge-primary">${val.qty}</span></a></li>`);
      }); 
    });
  },

  removeData: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(
      `${apiUrl}api/Penerimaan/removeTemp/`,
      formData,
      function(data) {
        module.unblockUI();
        formPenerimaan.loadCartItem();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        toastbox("toast-success", 3000);
        $("#success-text").html(data.metadata.message);
      });
  },

  updateData: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(`${apiUrl}api/Penerimaan/updateTemp`, formData, function(data) {
      module.unblockUI();

      if (data.metadata.status != 200) {
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html(data.metadata.message);
        return false;
      }
  
      formPenerimaan.loadCartItem();
      $("#DialogForm").modal("hide");
    });
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      `${apiUrl}api/Penerimaan/addPenerimaan`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "penerimaan.html";
      });
  },

  onBackKeyDown: function() {
    window.location.href = "penerimaan.html";
  }
}

document.addEventListener('deviceready', formPenerimaan.init, false);
document.addEventListener("backbutton", formPenerimaan.onBackKeyDown, false); 

// Event
$(function() {
  formPenerimaan.loadData({
    "nama": ""
  });

  formPenerimaan.loadCartItem();

  $("input[name='pencarian']").on("keyup", function() {
    let nama = $(this).val();
    formPenerimaan.loadData({
      "nama": nama
    });
  });

  formPenerimaan.loadSupplier();
  formPenerimaan.loadToko();

  let forms = document.getElementsByClassName('needs-validation');

  Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');

      if (form.checkValidity() === false) {
        return false;
      }

      let nonota = $("#nonota").val();
      let supplier = $("#supplier").val();
      let lokasi = $("#lokasi").val();
      let catatan = $("#catatan").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("username", username);
      formData.append("nonota", nonota);
      formData.append("supplier", supplier);
      formData.append("toko", lokasi);
      formData.append("catatan", catatan);

      formPenerimaan.onSubmitForm(formData);

    }, false);
  });
});

$("#btn-open-modal").click(function() {
  $("#ModalItem").modal("show");
});

$(document).on("click", ".btn-add-to-cart", function() {
  let kode = $(this).data("kode");
  let formData = new FormData();
  formData.append("kode", kode);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);

  module.ajaxSubmitData(`${apiUrl}api/Penerimaan/addToTemp`, formData, function(data) {
    if (data.metadata.status != 200) {
      $("#DialogIconedDanger").modal("show");
      $("#error-message").html(data.metadata.message);
      return false;
    }

    formPenerimaan.loadCartItem();
  });
});

$(document).on("click", ".btn-tools", function() {
  let id = $(this).data("id");
  let produk = $(this).data("produk");
  let qty = $(this).data("qty");
  state.selectedId = id;
  state.produk = produk;
  state.qty = qty;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-edit", function() {
  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  $("#DialogForm").modal("show");
  $("#item").val(state.produk);
  $("#qty").val(state.qty);
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

  formPenerimaan.removeData(formData);
});

$("#btn-update-cart").click(function() {
  let qty = $("#qty").val();

  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("id", state.selectedId);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);
  formData.append("qty", qty);

  formPenerimaan.updateData(formData);
});

$("#btn-create-penerimaan").click(function() {
  $("#ModalPenerimaan").modal("show");
});