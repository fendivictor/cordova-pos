let idPerusahaan = auth.getCookie("id_perusahaan");
let username = auth.getCookie("username");
let activeToko = localStorage.getItem("activeToko");
let state = {
  selectedId: null,
  produk: null,
  kode: null,
  qty: 0
}

const formTransaksi = {
  init: function() {
    module.loadSidebar();
  },

  onBackKeyDown: function() {
    window.location.href = "transaksi.html";
  },

  loadData: function(params) {
    $.get(`${apiUrl}api/Stok/findStokToko?id_perusahaan=${idPerusahaan}&nama=${params.nama}&id_toko=${params.id_toko}`)
    .done(function(data) {
      $(".item-listview").html(null);

      if (data.metadata.status != 200) {
        $(".item-listview").html(`
          <li><a href="#">Data tidak ditemukan</a></li>
        `);

        return false;
      }

      data.response.forEach(function(val, i) {
        $(".item-listview").append(`
        <li>
          <a href="#" class="item btn-add-to-cart" data-kode="${val.kode}">
            <div class="in">
              <div class="text-left">
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

  loadToko: function() {
    $.get(`${apiUrl}api/Toko/find?id_perusahaan=${idPerusahaan}`)
    .done(function(data) {
      $("#lokasi").html(null);

      $("#lokasi").append(`<option value="">Pilih Toko</option>`);
      if (data.metadata.status != 200) {
        return false;
      }

      data.response.forEach(function(val, i) {
        $("#lokasi").append(`<option value="${val.id}" ${(activeToko == val.id ? "selected" : "")}>${val.nama_toko}</option>`);
      });
    });
  },

  loadCartItem: function() {
    let activeToko = localStorage.getItem("activeToko");
    
    $.get(`${apiUrl}api/Transaksi/showTemp?id_perusahaan=${idPerusahaan}&id_toko=${activeToko}&username=${username}&kode=`)
    .done(function(data) {
      $(".cart-listview").html(null);

      if (data.metadata.status != 200) {
        $(".cart-listview").html(`
          <li><a href="#">Belum ada Produk ditambahkan</a></li>
        `);
        $("#btn-create-transaksi").attr("disabled", true);
        return false;
      }
      $("#btn-create-transaksi").attr("disabled", false);
      data.response.forEach(function(val, i) {
        $(".cart-listview").append(`
        <li>
          <a href="#" 
            data-id="${val.id}" 
            data-kode="${val.kode_produk}" 
            data-produk="${val.kode_produk} - ${val.nama_barang}" 
            data-qty="${val.qty}" 
            class="btn-tools item">
            <div class="in">
              <div>
                <header></header>
                ${val.kode_produk} - ${val.nama_barang} 
                <footer>Rp. ${module.numberWithCommas(val.harga_jual)}</footer> 
              </div>
              <span class="badge badge-primary mt-2">Qty: ${val.qty}</span>
            </div>
          </a>
        </li>`);
      }); 
    });
  },

  addToCart: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(`${apiUrl}api/Transaksi/addTemp`, formData, function(data) {
      module.unblockUI();

      if (data.metadata.status != 200) {
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html(data.metadata.message);
        return false;
      }
  
      formTransaksi.loadCartItem();
    });
  },

  updateChart: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(`${apiUrl}api/Transaksi/updateTemp`, formData, function(data) {
      module.unblockUI();

      if (data.metadata.status != 200) {
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html(data.metadata.message);
        return false;
      }
  
      formTransaksi.loadCartItem();
      $("#DialogForm").modal("hide");
    });
  },

  removeData: function(formData) {
    module.blockUI();

    module.ajaxSubmitData(
      `${apiUrl}api/Transaksi/removeTemp/`,
      formData,
      function(data) {
        module.unblockUI();
        formTransaksi.loadCartItem();

        if (data.metadata.status != 200) {
          $("#DialogIconedDanger").modal("show");
          $("#error-message").html(data.metadata.message);
          return false;
        }

        toastbox("toast-success", 3000);
        $("#success-text").html(data.metadata.message);
      });
  },

  hitungTagihan: function() {
    let totalTagihan = $("#total-tagihan").val();
    let diskon = $("#diskon").val();
    let jumlahBayar = $("#bayar").val();
    jumlahBayar = (parseFloat(jumlahBayar) - parseFloat(diskon));

    let selisih = parseFloat(jumlahBayar) - parseFloat(totalTagihan);
    
    if (selisih < 0) {
      $("#kekurangan").val(selisih * -1);
      $("#kembalian").val(0);
    } else if (selisih > 0) {
      $("#kekurangan").val(0);
      $("#kembalian").val(selisih);
    } else {
      $("#kembalian").val(0);
      $("#kekurangan").val(0);
    }
  }
}

document.addEventListener('deviceready', formTransaksi.init, false);
document.addEventListener("backbutton", formTransaksi.onBackKeyDown, false); 

// Event
$(function() {
  let pencarian = $("input[name='pencarian']").val();

  formTransaksi.loadToko();
  formTransaksi.loadData({
    "id_perusahaan": idPerusahaan,
    "nama": pencarian,
    "id_toko": activeToko
  });
  formTransaksi.loadCartItem();
});

$("#btn-open-modal").click(function() {
  $("#ModalItem").modal("show");
});

$("#lokasi").change(function() {
  $("input[name='pencarian']").val("");
  let thisValue = $(this).val();
  localStorage.setItem("activeToko", thisValue);

  formTransaksi.loadData({
    "id_perusahaan": idPerusahaan,
    "nama": "",
    "id_toko": thisValue
  });
  formTransaksi.loadCartItem();
});

$("input[name='pencarian']").on("keyup", function() {
  let thisValue = $(this).val();
  let activeToko = localStorage.getItem("activeToko");
  formTransaksi.loadData({
    "id_perusahaan": idPerusahaan,
    "nama": thisValue,
    "id_toko": activeToko
  });
});

$(document).on("click", ".btn-add-to-cart", function() {
  let kode = $(this).data("kode");
  let activeToko = localStorage.getItem("activeToko");

  let formData = new FormData();
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("id_toko", activeToko);
  formData.append("kode_produk", kode);
  formData.append("qty", 1);
  formData.append("username", username);

  formTransaksi.addToCart(formData);
});

$(document).on("click", ".btn-tools", function() {
  let id = $(this).data("id");
  let produk = $(this).data("produk");
  let qty = $(this).data("qty");
  let kode = $(this).data("kode");
  state.selectedId = id;
  state.produk = produk;
  state.qty = qty;
  state.kode = kode;

  $("#actionSheet").modal("show");
});

$(document).on("click", ".btn-edit", function() {
  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  $("#DialogForm").modal("show");
  $("#item").val(state.produk);
  $("#qty").val(state.qty);
});

$(document).on("click", ".btn-delete", function() {
  $("#modalDelete").modal("show");
});

$("#btn-confirm-delete").click(function() {
  $("#modalDelete").modal("hide");

  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("id", state.selectedId);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);

  formTransaksi.removeData(formData);
});

$("#btn-update-cart").click(function() {
  let qty = $("#qty").val();

  if (state.selectedId == null) {
    $("#DialogIconedDanger").modal("show");
    $("#error-message").html("Tidak ada data terpilih");
    return false;
  }

  let formData = new FormData();
  formData.append("id", state.selectedId);
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("username", username);
  formData.append("qty", qty);

  formTransaksi.updateChart(formData);
});

$("#btn-create-transaksi").click(function() {
  let activeToko = localStorage.getItem("activeToko");

  $("#ModalPenerimaan").modal("show");

  $.get(`${apiUrl}api/Transaksi/totalTemp`, {
    "id_perusahaan": idPerusahaan,
    "id_toko": activeToko,
    "username": username
  })
  .done(function(data) {
    $("#total-tagihan").val(data.response.total);
    formTransaksi.hitungTagihan();
  });
});

$("#total-tagihan, #diskon, #bayar").change(function() {
  formTransaksi.hitungTagihan();
});

$("#form-transaksi").submit(function(e) {
  e.preventDefault();
  module.blockUI();
  let customer = $("#customer").val();
  let id_toko = localStorage.getItem("activeToko");
  let diskon = $("#diskon").val();
  let bayar = $("#bayar").val();
  let kekurangan = $("#kekurangan").val();
  let kembalian = $("#kembalian").val();

  let formData = new FormData();
  formData.append("id_perusahaan", idPerusahaan);
  formData.append("customer", customer);
  formData.append("id_toko", id_toko);
  formData.append("diskon", diskon);
  formData.append("bayar", bayar);
  formData.append("kekurangan", kekurangan);
  formData.append("kembalian", kembalian);
  formData.append("username", username);

  module.ajaxSubmitData(
    `${apiUrl}api/Transaksi/addTransaksi`,
    formData,
    function (data) {
      module.unblockUI();

      if (data.metadata.status != 200) {
        $("#DialogIconedDanger").modal("show");
        $("#error-message").html(data.metadata.message);
        return false;
      }

      $("#DialogInfo").modal("show");
      if (data.response.kekurangan > 0) {
        $("#info-message").html(`Terdapat kekurangan Bayar sejumlah Rp. ${module.numberWithCommas(data.response.kekurangan)}`);
        return false;
      }

      if (data.response.kembalian > 0) {
        $("#info-message").html(`Terdapat kelebihan Bayar sejumlah Rp. ${module.numberWithCommas(data.response.kembalian)}`);
        return false;
      }

      $("#info-message").html(`Transaksi Berhasil`);
      return false;
    }
  );
});