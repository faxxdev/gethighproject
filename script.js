
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Chromium'da camın arkasındaki görüntü sıvı gibi kırılsın
  var ua = navigator.userAgent;
  if (/Chrome\//.test(ua) && !/Firefox|FxiOS/.test(ua)) root.classList.add("liquid-svg");

  // Kaydırınca açılan öğeler
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  // İmleci izleyen cam ışığı
  document.addEventListener("pointermove", function (e) {
    var g = e.target.closest ? e.target.closest(".glass") : null;
    if (!g) return;
    var r = g.getBoundingClientRect();
    g.style.setProperty("--mx", (e.clientX - r.left) + "px");
    g.style.setProperty("--my", (e.clientY - r.top) + "px");
  });

  // Adım çizgisi kaydırdıkça dolar
  var steps = document.querySelector(".steps");
  var nodes = steps ? steps.querySelectorAll(".node") : [];
  function update() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var mark = window.innerHeight * 0.62;
    var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    steps.style.setProperty("--p", p.toFixed(3));
    nodes.forEach(function (n) {
      var nr = n.getBoundingClientRect();
      n.classList.toggle("lit", nr.top + nr.height / 2 < mark);
    });
  }
  if (steps) {
    if (reduce) { nodes.forEach(function (n) { n.classList.add("lit"); }); }
    else {
      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      update();
    }
  }

  // Logo imlece göre hafifçe eğilir
  var stage = document.querySelector(".logo-stage");
  if (stage && !reduce && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", function (e) {
      var x = e.clientX / window.innerWidth - 0.5;
      var y = e.clientY / window.innerHeight - 0.5;
      stage.style.setProperty("--rx", (-y * 10).toFixed(2) + "deg");
      stage.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
    });
  }
})();

// Etkileşimli ekran görüntüsü galerisi
(function () {
  var img = document.getElementById("shot-img"), layer = document.getElementById("layer"), tip = document.getElementById("tip");
  var cap = document.getElementById("shot-cap"), stage = document.getElementById("stage");
  var tabs = document.querySelectorAll(".shot-tabs button");
  if (!img || !tabs.length) return;
  var N = ["Ana Sayfa","Sistem Monitörü","Regedit","Başlangıç","Temizlik","Ağ","Servisler","Ayarlar","FiveM","FiveM Araçları"];
  var S = [
   {f:"ana-sayfa",s:[1136,796],c:"Sistem özeti, optimizasyon yüzdesi ve tek tıkla Temel / Optimal profil.",n:{1:214,2:378,3:419,4:460,5:501},
    p:[[388,396,"Optimizasyon skoru","Aktif tweak'lerin tüm tweak'lere oranı. Grup halindeki ayarlar tek sayılır."],[360,568,"Temel ve Optimal profil","Temel: çok güvenli, herkes için. Optimal: temel + oyun odaklı ek ayarlar."],[680,568,"Geri alma","Geri yükleme noktası oluştur ya da tüm tweak'leri tek tıkla geri al."],[137,575,"Şu an çalıyor","Spotify'da çalan şarkı albüm kapağıyla menüde görünür."]]},
   {f:"sistem-monitoru",s:[1135,795],c:"Donanım bilgilerin ve işlemci, ekran kartı, RAM, disk kullanımı canlı olarak.",n:{0:172,2:377,3:418,4:459,5:500},
    p:[[500,240,"Donanım bilgileri","İşlemci, ekran kartı, anakart, BIOS, çözünürlük ve disk tek kartta."],[480,430,"Canlı kullanım","İşlemci, ekran kartı, RAM ve disk kullanımı anlık güncellenir."]]},
   {f:"regedit",s:[1134,798],c:"Strafe ve input paketleri. Değişen kayıt yolu görünür, eski değerler yedeklenir.",n:{0:172,1:213,3:418,4:459,5:500},
    p:[[1047,305,"Tek tıkla aç/kapat","Anahtarı kapatınca eski değer geri yüklenir."],[590,285,"Etiketler","Kategori, güvenlik seviyesi, aktif durumu ve yeniden başlatma gerekip gerekmediği."],[400,330,"Kayıt yolu","Hangi kayıt anahtarının değiştiği satırda açıkça yazar."],[779,127,"Hepsini uygula","Paketteki tüm ayarları tek seferde uygular."]]},
   {f:"baslangic",s:[1137,797],c:"Windows ile açılan programları tek tıkla aç ya da kapat.",n:{0:171,1:212,2:376,4:458,5:499},
    p:[[1035,255,"Silmez, sadece durdurur","Kapatmak programı silmez, yalnızca otomatik başlamasını durdurur."],[412,247,"Kaynak etiketi","Kullanıcı, sistem ve 32-bit gibi etiketlerle programın nereden geldiği görünür."],[456,637,"Korumalı öğeler","Kritik sistem öğeleri korumalı olarak işaretlenir."]]},
   {f:"temizlik",s:[1130,797],c:"Geçici dosyalar, Windows Update önbelleği ve çökme raporları için tek tıkla temizlik.",n:{2:281,3:322,5:404,6:445},
    p:[[1019,205,"Çalıştır","Her temizlik işlemini tek tıkla çalıştırır."],[1045,80,"Hepsini çalıştır","Listedeki tüm temizlikleri sırayla yapar."],[556,193,"Güvenlik etiketi","Silinecek şeyin ne kadar güvenli olduğu etiketle gösterilir."]]},
   {f:"ag",s:[1136,794],c:"DNS seçenekleri, DNS önbelleği temizliği ve TCP gecikme ayarı.",n:{2:182,3:223,4:264,6:346,8:427,9:468},
    p:[[1050,240,"DNS seçimi","Cloudflare, Google veya Quad9. Aynı anda yalnızca biri aktif olur."],[1038,553,"DNS önbelleği","Eski DNS kayıtlarını tek tıkla temizler."],[1050,685,"Nagle kapalı","Küçük paketlerin bekletilmeden gitmesini sağlayarak gecikmeyi düşürür."]]},
   {f:"servisler",s:[1139,792],c:"Çekirdek yalıtımı, Secure Boot ve önemli servislerin sağlık durumu.",n:{3:127,4:168,5:209,8:331,9:372},
    p:[[685,188,"Sistem sağlık durumu","Kaç kontrolün yolunda olduğunu çubukta gösterir."],[377,250,"Hepsini etkinleştir","Kapalı olanları tek tıkla kalıcı olarak etkinleştirir."],[350,358,"Güvenlik kontrolleri","Çekirdek yalıtımı ve Secure Boot durumu açıklamasıyla görünür."]]},
   {f:"ayarlar",s:[1137,800],c:"Koyu, açık, Stitch, Hello Kitty ve daha fazla tema. Her temanın önerilen bir efekti var.",n:{5:168,6:209,8:291,9:332},
    p:[[410,350,"Tema kartları","Seçim kaydedilir, program bir sonraki açılışta aynı temayla başlar."],[843,527,"Hello Kitty","Pembe, beyaz ve kırmızı fiyonklu tatlı tema."],[410,437,"Önerilen efekt","Her temanın kayan yıldız, kalp gibi kendine uygun bir efekti var."]]},
   {f:"fivem",s:[1132,789],c:"Cache temizliği, öncelik ve GPU ayarları FiveM için hazır.",n:{5:161,6:202,7:488,9:325},
    p:[[1034,240,"Cache temizle","server-cache ve nui-storage temizlenir, oyun dosyalarına dokunulmaz."],[700,541,"Zaten aktif","Sistemde zaten açık olan ayarlar bu şekilde işaretlenir."],[631,643,"Dikkat etiketi","Dikkat gerektiren ayarlar sarı etiketle uyarılır."]]},
   {f:"fivem-araclari",s:[1133,795],c:"Sensitivity bulucu, mouse testi, hazırlık kontrolü ve ping testi.",n:{5:165,6:206,7:492,8:288},
    p:[[475,152,"Dört araç","Sensitivity Bulucu, Mouse Testi, Hazırlık Kontrolü ve Ping & Başlat."],[500,340,"DPI aralığı","En düşük ve en yüksek DPI'ı gir, adım adım daraltarak sana uygun değeri bul."],[550,652,"Geri bildirim","Çok hızlı, çok yavaş ya da tam kıvamında diyerek bir sonraki adıma geç."]]}
  ];
  var cur = 0, busy = false;
  function pct(v, t) { return (v / t * 100).toFixed(2) + "%"; }
  function build(i) {
    var s = S[i], w = s.s[0], h = s.s[1], out = "";
    for (var t in s.n) out += '<button type="button" class="hs" data-go="' + t + '" aria-label="' + N[t] + ' sayfasına git" title="' + N[t] + '" style="left:' + pct(24, w) + ";top:" + pct(s.n[t] - 17, h) + ";width:" + pct(210, w) + ";height:" + pct(34, h) + '"></button>';
    s.p.forEach(function (p, k) { out += '<button type="button" class="pin" data-k="' + k + '" aria-label="' + p[2] + '" style="left:' + pct(p[0], w) + ";top:" + pct(p[1], h) + '"></button>'; });
    layer.innerHTML = out;
    tip.classList.remove("on");
  }
  function showTip(k) {
    var s = S[cur], p = s.p[k], x = p[0] / s.s[0] * 100, y = p[1] / s.s[1] * 100;
    tip.innerHTML = "<b></b><span></span>";
    tip.firstChild.textContent = p[2]; tip.lastChild.textContent = p[3];
    tip.style.left = Math.min(80, Math.max(20, x)) + "%";
    tip.style.top = y > 55 ? "auto" : "calc(" + y + "% + 20px)";
    tip.style.bottom = y > 55 ? "calc(" + (100 - y) + "% + 20px)" : "auto";
    tip.classList.add("on");
  }
  function go(i) {
    i = (i + S.length) % S.length;
    if (i === cur || busy) return;
    busy = true; cur = i;
    tabs.forEach(function (t, n) { t.setAttribute("aria-selected", n === i ? "true" : "false"); });
    img.classList.add("swap"); layer.innerHTML = ""; tip.classList.remove("on");
    setTimeout(function () {
      img.onload = function () { img.classList.remove("swap"); busy = false; };
      img.src = "img/" + S[i].f + ".webp"; img.alt = "GetHigh " + N[i] + " sayfası";
      img.width = S[i].s[0]; img.height = S[i].s[1]; cap.textContent = S[i].c; build(i);
      if (img.complete) { img.classList.remove("swap"); busy = false; }
    }, 170);
    tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
  build(0);
  tabs.forEach(function (t, n) { t.addEventListener("click", function () { go(n); }); });
  document.getElementById("prev").onclick = function () { go(cur - 1); };
  document.getElementById("next").onclick = function () { go(cur + 1); };
  layer.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.go) go(+b.dataset.go); else showTip(+b.dataset.k);
  });
  layer.addEventListener("pointerover", function (e) { var b = e.target.closest(".pin"); if (b && e.pointerType === "mouse") showTip(+b.dataset.k); });
  layer.addEventListener("pointerout", function (e) { if (e.target.closest(".pin") && e.pointerType === "mouse") tip.classList.remove("on"); });
  document.addEventListener("click", function (e) { if (!e.target.closest(".pin")) tip.classList.remove("on"); });
  document.querySelector(".shot-tabs").addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(cur + 1); tabs[cur].focus(); }
    if (e.key === "ArrowLeft") { go(cur - 1); tabs[cur].focus(); }
  });
  var x0 = null;
  stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(d) > 60) go(cur + (d < 0 ? 1 : -1));
  });
  var pb = document.getElementById("pins-btn");
  pb.onclick = function () { var off = stage.classList.toggle("nopins"); pb.textContent = "Noktalar: " + (off ? "kapalı" : "açık"); pb.setAttribute("aria-pressed", off ? "false" : "true"); };
  document.getElementById("zoom").onclick = function () {
    var d = document.createElement("div"); d.className = "lb"; d.innerHTML = '<img alt="">';
    d.firstChild.src = img.src; d.firstChild.alt = img.alt;
    function close() { d.remove(); document.removeEventListener("keydown", esc); }
    function esc(e) { if (e.key === "Escape") close(); }
    d.onclick = close; document.addEventListener("keydown", esc); document.body.appendChild(d);
  };
  window.addEventListener("load", function () { S.forEach(function (s) { new Image().src = "img/" + s.f + ".webp"; }); });
})();
