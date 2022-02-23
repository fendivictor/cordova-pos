let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");

const formPenerimaan = {
  init: function() {
    module.loadSidebar();
  },

  loadData: function(params) {
    $.get(`${apiUrl}api/Produk/find?id_perusahaan=${idPerusahaan}&order_column=nama&order_mode=asc&nama=${params.nama}`)
    .done(function(data) {
      $(".item-listview").html(null);

      if (data.metadata.status != 200) {
        $(".item-listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".item-listview").append(`<li><a href="#" data-kode="${val.kode}" class="btn-tools">${val.kode} - ${val.nama}</a></li>`);
      }); 
    });
  },

  onBackKeyDown: function() {
    window.location.href = "penerimaan.html";
  }
}

document.addEventListener('deviceready', formPenerimaan.init, false);
document.addEventListener("backbutton", formPenerimaan.onBackKeyDown, false); 

// Event
$(function() {
  formPenerimaan.loadData({
    "nama": ""
  });

  $("input[name='pencarian']").on("keyup", function() {
    let nama = $(this).val();
    formPenerimaan.loadData({
      "nama": nama
    });
  });
});

$("#btn-open-modal").click(function() {
  $("#ModalItem").modal("show");
});