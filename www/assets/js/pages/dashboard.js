let state = {
  updateUrl: null 
}

const dashboard = {
  init: function() {
    module.loadSidebar();
    module.loadBottomMenu('index.html');
    dashboard.checkAppVersion();
  },

  checkAppVersion: function() {
    $.get(`${apiUrl}api/Version`)
    .done(function(data) {
      if (data.response.version > appVersion) {
        $("#modalUpdate").modal("show");
        state.updateUrl = data.response.url;

        if(data.response.is_required == 1) {
          $("#btn-update-later").addClass("d-none");
        }
      }
    });
  }
}

document.addEventListener('deviceready', dashboard.init, false);

$("#btn-update-now").click(function() {
  if (state.updateUrl == null) {
    return false;
  }

  window.open(`${state.updateUrl}`, "_blank");
});