let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let currentAction = module.readUrlParameter("action");
let currentIdSelected = module.readUrlParameter("id");

const formKategori = {
  init: function() {
    module.loadSidebar();
  },

  onEdit: function() {
    if (currentAction == "edit") {
      $.get(`${apiUrl}api/master/Kategori/find/${currentIdSelected}?id_perusahaan=${idPerusahaan}`)
      .done(function(data) {
        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        $("#kategori").val(data.response.kategori);
      });
    }
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      currentAction == 'edit' ? `${apiUrl}api/master/Kategori/update` : `${apiUrl}api/master/Kategori/add`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "master-kategori.html";
      });
  },
  
  onBackKeyDown: function() {
    window.location.href = "master-kategori.html";
  }
}

document.addEventListener('deviceready', formKategori.init, false);
document.addEventListener("backbutton", formKategori.onBackKeyDown, false); 

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

      let kategori = $("#kategori").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("kategori", kategori);
      formData.append("username", username);

      if (currentAction == 'edit') {
        formData.append("id", currentIdSelected);
      }

      formKategori.onSubmitForm(formData);

    }, false);
  });

  formKategori.onEdit();
});