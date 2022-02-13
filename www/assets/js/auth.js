const auth = {
  isLoggedIn: function() {
    let username = auth.getCookie("username");

    if (! username) {
      return false;
    }
    
    return true;
  },

  setCookie: function(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },

  getCookie: function(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  deleteAllCookies: function() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    window.cookieManager.clear(function() {
      console.log('Cookies cleared!');
    });
  },

  logout: function() {
    auth.deleteAllCookies();
    window.location.href = 'index.html';
  }
}

$(document).on("click", "#btn-logout", function() {
  $("#sidebarPanel").modal("hide");
  $("#modalLogout").modal("show");
});

$(document).on("click", "#btn-confirm-logout", function() {
  auth.logout();
});