const appVersion = "1.0.0";

const core = {
  init: function() {
    $("#app-version").html(appVersion);

    if (! auth.isLoggedIn()) {
      routes.loadPage("login");
      return false;
    }

    if (! state.isAuthenticated) {
      routes.loadPage("login");
      return false;
    }

    routes.loadPage("dashboard");
  },

  ajaxSubmitConfig: function(url, formData) {
    return {
      url: `${url}`,
      type: "post",
      dataType: "json",
      data: formData,
      contentType: false,
      processData: false
    }
  },

  ajaxSubmitData: function(url, formData, onSuccess) {
    $.ajax(core.ajaxSubmitConfig(url, formData))
    .done(function(data) {
      onSuccess(data);
    })
    .fail(function(err) {
      toastr.error("Gagal mengirim data!");
    });
  },

  ajaxUploadFile: function(url, formData, progressBar, onSuccess) {
    $.ajax({
      url: url,
      type: "post",
      dataType: "json",
      contentType: false,
      processData: false,
      cache: false,
      data: formData,
      xhr: function() {
        core.unBlockUI();
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;

            progressBar.html(`
            <div class="progress mt-3">
              <div class="progress-bar bg-success" role="progressbar" aria-valuenow="${(Math.round(percentComplete * 100))}" aria-valuemin="0" aria-valuemax="100" style="width: ${(Math.round(percentComplete * 100))}%">
                <span class="sr-only">${(Math.round(percentComplete * 100))}% Complete</span>
              </div>
            </div>`)
          }
        }, false);

        return xhr;
      },
      success: function(data) {
        onSuccess(data);
      },
      error: function(err) {
        toastr.error("Gagal mengirim data!");
      }
    });
  },

  blockUI: function() {
    $.blockUI({
      css: {
        backgroundColor: 'transparent',
        border: 'none'
      },
      message: '<div class="loader"></div>',
      baseZ: 1500,
      overlayCSS: {
        backgroundColor: '#fff',
        opacity: 0.7,
        cursor: 'wait'
      }
    });
  },

  unBlockUI: function() {
    $.unblockUI();
  },
}

document.addEventListener('deviceready', core.init, false);