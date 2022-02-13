$(function() {
  let forms = document.getElementsByClassName('needs-validation');

  let validation = Array.prototype.filter.call(forms, function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');

      if (form.checkValidity() === false) {
        return false;
      }
      
      module.blockUI();

      let formData = new FormData($("#form-login")[0]);
      module.ajaxSubmitData(
        `${apiUrl}api/Auth/login`,
        formData,
        function (data) {
          let response = data.response;
          let metadata = data.metadata;

          module.unblockUI();

          if (metadata.status != 200) {
            $("#DialogIconedDanger").modal("show");
            $("#error-message").html(metadata.message);
            return false;
          }
          
          window.location.href = 'dashboard.html';
          auth.setCookie("username", response.username, 90);
          auth.setCookie("id_perusahaan", response.id_perusahaan, 90);
        }
      );

    }, false);
  });
});

const login = {
  init: function () {
    let isLoggedIn = auth.isLoggedIn();

    if (! isLoggedIn) {
      return false;
    }

    window.location.href = 'dashboard.html';
  }
}

document.addEventListener('deviceready', login.init, false);