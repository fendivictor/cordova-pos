let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");

const penerimaan = {
  init: function() {
    module.loadSidebar();
  },

  loadData: function() {
    $.get(`${apiUrl}api/Penerimaan/showPenerimaan?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $(".listview").html(null);

      if (data.metadata.status != 200) {
        $(".listview").html(`
          <li>
            <a href="#" class="item">
              <div class="in">
                <div>Data tidak ditemukan</div>
              </div>
            </a>
          </li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".listview").append(`
        <li>
          <a href="#" class="item">
            <div class="in">
              <div>
                <header>${val.nama_toko}</header>
                ${val.nama_supplier}
                <footer>${moment(val.insert_at).format("DD/MM/YYYY HH:mm")}</footer>
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

document.addEventListener('deviceready', penerimaan.init, false);
document.addEventListener("backbutton", penerimaan.onBackKeyDown, false); 

// Event
$(function() {
  penerimaan.loadData();
});