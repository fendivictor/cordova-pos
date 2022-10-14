let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let state = {
  tanggalAwal: moment(),
  tanggalAkhir: moment(),
  selectedNobukti: null
}

const penerimaan = {
  init: function() {
    module.loadSidebar();
  },

  loadData: function() {
    $.get(`${apiUrl}api/Penerimaan/showPenerimaan?id_perusahaan=${idPerusahaan}&startdate=${state.tanggalAwal.format('YYYY-MM-DD')}&enddate=${state.tanggalAkhir.format('YYYY-MM-DD')}`)
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
          <a href="#" class="item btn-tools" data-nobukti="${val.nobukti}">
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

  $("#tanggal-penerimaan").daterangepicker({
    showDropdowns: true,
    locale: {
      format: "DD/MM/YYYY"
    }
  }, function(start, end) {
    state.tanggalAwal = start;
    state.tanggalAkhir = end;

    penerimaan.loadData();
  });
});

$(document).on("click", ".btn-tools", function(e) {
  e.preventDefault();
  let nobukti = $(this).data("nobukti");
  state.selectedNobukti = nobukti;

  $("#actionSheet").modal("show");
});