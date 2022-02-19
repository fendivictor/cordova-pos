let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let currentAction = module.readUrlParameter("action");
let currentIdSelected = module.readUrlParameter("id");

const formSatuan = {
  init: function() {
    module.loadSidebar();
    // module.loadBottomMenu('satuan.html');
  },

  onEdit: function() {
    if (currentAction == "edit") {
      $(".pageTitle").html("Edit Satuan");
      $.get(`${apiUrl}api/master/Satuan/find/${currentIdSelected}?id_perusahaan=${idPerusahaan}`)
      .done(function(data) {
        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        $("#satuan").val(data.response.satuan);
      });
    }
  },

  onSubmitForm: function(formData) {
    module.blockUI();
    module.ajaxSubmitData(
      currentAction == 'edit' ? `${apiUrl}api/master/Satuan/update` : `${apiUrl}api/master/Satuan/add`,
      formData, 
      function(data) {
        module.unblockUI();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        window.location.href = "master-satuan.html";
      });
  },
  
  onBackKeyDown: function() {
    window.location.href = "master-satuan.html";
  }
}

document.addEventListener('deviceready', formSatuan.init, false);
document.addEventListener("backbutton", formSatuan.onBackKeyDown, false); 

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

      let satuan = $("#satuan").val();

      let formData = new FormData();
      formData.append("id_perusahaan", idPerusahaan);
      formData.append("satuan", satuan);
      formData.append("username", username);

      if (currentAction == 'edit') {
        formData.append("id", currentIdSelected);
      }

      formSatuan.onSubmitForm(formData);

    }, false);
  });

  formSatuan.onEdit();
});