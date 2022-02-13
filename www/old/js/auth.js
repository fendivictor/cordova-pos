const auth = {
  isLoggedIn: function() {
    let username = auth.getCookie("username");

    if (! username) {
      return false;
    }

    state.isAuthenticated = true;
    return true;
  },

  signin: function(username, password) {
    if (username != 'joni' || password != '1234') {
      Swal.fire("", "Username atau Password Salah", "error");
      return false;
    }

    state.isAuthenticated = true;
    routes.loadPage("dashboard");
    auth.setCookie("username", username, 99);
  },

  signout: function() {
    Swal.fire({
      title: "Konfirmasi",
      text: "Apakah yakin akan sign out dari aplikasi ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak"
    })
    .then(function(result){
      if (result.value) {
        auth.deleteAllCookies();
        state.isAuthenticated = false;
        routes.loadPage("login");
        $("#app-menu").html(null);
        return false;
      }
    });
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
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
}

$(document).on("click", "#btn-logout", function() {
  auth.signout();
})