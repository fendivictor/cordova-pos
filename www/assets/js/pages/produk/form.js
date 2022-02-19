let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let currentAction = module.readUrlParameter("action");
let currentKodeSelected = module.readUrlParameter("kode");

const formProduk = {
  init: function() {
    module.loadSidebar();
  },

  loadKategori: function() {
    $.get(`${apiUrl}api/master/Kategori/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#kategori").html(null);

      $("#kategori").append(`<option value="">Pilih Kategori</option>`);
      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#kategori").append(`<option value="${val.id}">${val.kategori}</option>`);
      });
    });
  },

  loadSatuan: function() {
    $.get(`${apiUrl}api/master/Satuan/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#satuan").html(null);

      $("#satuan").append(`<option value="">Pilih Satuan</option>`);
      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#satuan").append(`<option value="${val.satuan}">${val.satuan}</option>`);
      });
    });
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      currentAction == 'edit' ? `${apiUrl}api/Produk/update` : `${apiUrl}api/Produk/add`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "master-produk.html";
      });
  },

  onEdit: function() {
    if (currentAction == "edit") {
      $(".pageTitle").html("Edit Produk");
      $.get(`${apiUrl}api/Produk/find?kode=${currentKodeSelected}&id_perusahaan=${idPerusahaan}`)
      .done(function(data) {
        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        $("#kode").val(data.response.kode);
        $("#nama").val(data.response.nama);
        $("#kategori").val(data.response.id_kategori).trigger("change");
        $("#harga_beli").val(data.response.harga_beli);
        $("#harga_jual").val(data.response.harga_jual);
        $("#satuan").val(data.response.satuan).trigger("change");
      });
    }
  },

  onBackKeyDown: function() {
    window.location.href = "master-produk.html";
  }
}

document.addEventListener('deviceready', formProduk.init, false);
document.addEventListener("backbutton", formProduk.onBackKeyDown, false); 

// Event
$(function() {
  let forms = document.getElementsByClassName('needs-validation');

  Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');

      if (form.checkValidity() === false) {
        return false;
      }

      let kode = $("#kode").val();
      let nama = $("#nama").val();
      let id_kategori = $("#kategori").val();
      let kategori = $("#kategori option:selected").text();
      let harga_beli = $("#harga_beli").val();
      let harga_jual = $("#harga_jual").val();
      let satuan = $("#satuan").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("username", username);
      formData.append("barcode", "");
      formData.append("kode", kode);
      formData.append("nama", nama);
      formData.append("id_kategori", id_kategori);
      formData.append("kategori", kategori);
      formData.append("harga_beli", harga_beli);
      formData.append("harga_jual", harga_jual);
      formData.append("satuan", satuan);

      if (currentAction == 'edit') {
        formData.append("kode", currentKodeSelected);
      }

      formProduk.onSubmitForm(formData);

    }, false);
  });

  formProduk.loadKategori();
  formProduk.loadSatuan();

  setTimeout(
    formProduk.onEdit,
    1000
  );
});