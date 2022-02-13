$(document).on("submit", "#form-login", function(e) {
  e.preventDefault();
  let formData = new FormData($(this)[0]);

  let username = $("#form-login #username").val();
  let password = $("#form-login #password").val();

  auth.signin(username, password);
});