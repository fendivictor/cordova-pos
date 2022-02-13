const routes = {
  loadPage: function (page) {
    $.get(`views/${page}.html`, function(data) {
      $("#app").html(data);

      setTimeout(routes.initFunc(page), 1000);
    });

    if (state.isAuthenticated) {
      $.get(`views/menu.html`, function(data) {
        $("#app-menu").html(data);
      });
    }
  },

  initFunc: function(page) {
    let funCollection = {
      "dashboard": dashboard.init()
    };

    return funCollection[page];
  }
}