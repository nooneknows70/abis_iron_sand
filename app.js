(function () {
  var w = document.getElementById("weight");
  var r = document.getElementById("ratio");
  var s = document.getElementById("status");

  function update() {
    var result = IronSand.evaluate(w.value);
    r.textContent = result.ratioText;
    s.textContent = result.statusText;
    s.style.background = result.background;
  }

  w.addEventListener("input", update);
  document.getElementById("reset").addEventListener("click", function () {
    w.value = "";
    update();
    w.focus();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
})();
