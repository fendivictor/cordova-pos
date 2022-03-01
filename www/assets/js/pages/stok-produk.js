let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");

const stokProduk = {
  init: function() {
    module.loadSidebar();
  },
  
  loadData: function() {
    $.get(`${apiUrl}api/Stok/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".listview").append(`
        <li>
          <a href="#" class="item">
            <div class="in">
              <div>
                <header>${val.kode}</header>
                ${val.nama}
                <footer>${val.qty} ${val.satuan}</footer>
              </div>
            </div>
          </a>
        </li>`);
      });
    });
  },

  onBackKeyDown: function() {
    window.location.href = "product.html";
  }
}

document.addEventListener('deviceready', stokProduk.init, false);
document.addEventListener("backbutton", stokProduk.onBackKeyDown, false); 

// Event
$(function() {
  stokProduk.loadData();
});