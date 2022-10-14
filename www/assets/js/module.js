const module = {
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
    $.ajax(module.ajaxSubmitConfig(url, formData))
    .done(function(data) {
      onSuccess(data);
    })
    .fail(function(err) {
      $("#DialogIconedDanger").modal("show");
      $("#error-message").html("Terjadi kesalahan server!");
      module.unblockUI();
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

  loadSidebar: function() {
    let username = auth.getCookie("username");
    module.getUserInformation(username)
    .then(function(usernameData) {
      $.get('views/sidebar.html')
      .done(function (data) {
        $("#sidebar-here").html(data);
        
        // Set User Profile
        if (usernameData.metadata.status == 200) {
          $("#profilename-display").html(usernameData.response.profile_name);
          $("#username-display").html(usernameData.response.username.toUpperCase());
        }

        // Dark Mode Detection
        let checkDarkModeStatus = localStorage.getItem("MobilekitDarkModeActive");
        // if dark mode on
        if (checkDarkModeStatus === 1 || checkDarkModeStatus === "1") {
          $(".dark-mode-switch").attr('checked', true);

          if (! $("body").hasClass("dark-mode-active")) {
            $("body").addClass("dark-mode-active");
          }
        } else {
          $(".dark-mode-switch").attr('checked', false);
        }

        $.get(`${apiUrl}api/Transaksi/showTransaksi?id_perusahaan=${usernameData.response.id_perusahaan}`)
        .done(function(data) {
          $(".total-pending").html(data.response.length);
        });
      });
    });
  },

  loadBottomMenu: function(active) {
    $.get('views/bottom-menu.html')
    .done(function (data) {
      $("#bottom-menu-here").html(data);

      $(`.appBottomMenu a.item`).removeClass("active");
      $(`.appBottomMenu a[href='${active}']`).addClass("active");
    });
  },

  getUserInformation: async function(username) {
    return fetch(`${apiUrl}api/User/get/${username}`)
    .then(function (result) {
      return result;
    })
    .then(function (data) {
      return data.json();
    });
  },

  blockUI: function() {
    $("#loader").css("display", "");
  },

  unblockUI: function() {
    setTimeout(() => {
      $("#loader").fadeToggle(250);
    }, 500); // hide delay when page load
  },

  readUrlParameter: function(getParams) {
    let url = new URL(window.location);
    let params = url.searchParams.get(getParams);

    return params;
  },

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}