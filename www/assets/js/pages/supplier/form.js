let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let currentAction = module.readUrlParameter("action");
let currentKodeSelected = module.readUrlParameter("kode");

const formSupplier = {
  init: function() {
    module.loadSidebar();
    // module.loadBottomMenu('satuan.html');
  },

  onEdit: function() {
    if (currentAction == "edit") {
      $(".pageTitle").html("Edit Supplier");
      $.get(`${apiUrl}api/Supplier/find?kode=${currentKodeSelected}&id_perusahaan=${idPerusahaan}`)
      .done(function(data) {
        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        $("#kode_supplier").attr("readonly", true);
        $("#kode_supplier").val(data.response.kode);
        $("#nama_supplier").val(data.response.nama_supplier);
        $("#alamat").val(data.response.alamat);
        $("#telepon").val(data.response.telpon);
        $("#email").val(data.response.email);
      });
    }
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      currentAction == 'edit' ? `${apiUrl}api/Supplier/update` : `${apiUrl}api/Supplier/add`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "master-supplier.html";
      });
  },
  
  onBackKeyDown: function() {
    window.location.href = "master-supplier.html";
  }
}

document.addEventListener('deviceready', formSupplier.init, false);
document.addEventListener("backbutton", formSupplier.onBackKeyDown, false); 

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

      let kode_supplier = $("#kode_supplier").val();
      let nama_supplier = $("#nama_supplier").val();
      let alamat = $("#alamat").val();
      let telepon = $("#telepon").val();
      let email = $("#email").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("username", username);
      formData.append("kode", kode_supplier);
      formData.append("nama_supplier", nama_supplier);
      formData.append("alamat", alamat);
      formData.append("telpon", telepon);
      formData.append("email", email);

      if (currentAction == 'edit') {
        formData.append("kode", currentKodeSelected);
      }

      formSupplier.onSubmitForm(formData);

    }, false);
  });

  formSupplier.onEdit();
});