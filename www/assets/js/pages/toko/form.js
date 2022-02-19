let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let currentAction = module.readUrlParameter("action");
let currentIdSelected = module.readUrlParameter("id");

const formToko = {
  init: function() {
    module.loadSidebar();
    // module.loadBottomMenu('satuan.html');
  },

  onEdit: function() {
    if (currentAction == "edit") {
      $(".pageTitle").html("Edit Toko");
      $.get(`${apiUrl}api/Toko/find/${currentIdSelected}?id_perusahaan=${idPerusahaan}`)
      .done(function(data) {
        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        $("#toko").val(data.response.nama_toko);
        $("#alamat").val(data.response.alamat);
      });
    }
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      currentAction == 'edit' ? `${apiUrl}api/Toko/update` : `${apiUrl}api/Toko/add`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "toko.html";
      });
  },
  
  onBackKeyDown: function() {
    window.location.href = "toko.html";
  }
}

document.addEventListener('deviceready', formToko.init, false);
document.addEventListener("backbutton", formToko.onBackKeyDown, false); 

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

      let toko = $("#toko").val();
      let alamat = $("#alamat").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("nama_toko", toko);
      formData.append("alamat", alamat);
      formData.append("username", username);

      if (currentAction == 'edit') {
        formData.append("id", currentIdSelected);
      }

      formToko.onSubmitForm(formData);

    }, false);
  });

  formToko.onEdit();
});