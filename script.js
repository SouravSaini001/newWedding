(function () {
  /* ---------- Edit these details ---------- */
  var CONFIG = {
    bride: "Mamta", groom: "Harsh",
    brideDeva: "ममता", groomDeva: "हर्ष",
    /* Paste the Google Drive share link of each photo between the quotes.
       In Drive: right-click the photo > Share > General access: "Anyone with the link" > Copy link. */
    groomPhoto: "",
    bridePhoto: "",
    weddingISO: "2026-12-11T19:30:00+05:30",
    events: [
      { deva: "लगन", name: "Lagan", glyph: "❋", date: "Wed, 9 Dec 2026", time: "Morning", place: "Details shared by the family", note: "The sacred lagan ceremony, with blessings from the elders.", dress: "Traditional", accent: "#c98a0d" },
      { deva: "संगीत", name: "Sangeet", glyph: "♪", date: "Thu, 10 Dec 2026", time: "7:30 pm", place: "Details shared by the family", note: "Dance performances, dhol and an open floor.", dress: "Festive and colourful", accent: "#8a2b6e" },
      { deva: "विवाह", name: "Vivah", glyph: "ॐ", date: "Fri, 11 Dec 2026", time: "Baraat swagat 7:30 pm, pheras 9:30 pm", place: "Rahish Farm, Narnaul", note: "We welcome the baraat with milni, followed by jaimala, kanyadaan, saptapadi and sindoor. Dinner follows at Rahish Farm.", dress: "Traditional, rich colours", accent: "#c9261c" }
    ]
  };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Text from config ---------- */
  $("nameA").textContent = CONFIG.bride; $("nameB").textContent = CONFIG.groom; /* bride first */
  $("devaNames").innerHTML = CONFIG.brideDeva + " &nbsp;·&nbsp; " + CONFIG.groomDeva;

  $("gateNames").textContent = CONFIG.bride + " weds " + CONFIG.groom;

  /* ---------- Couple photos from Google Drive links ---------- */
  function driveImageUrl(link) {
    if (!link) return "";
    var m = link.match(/\/d\/([\w-]+)/) || link.match(/[?&]id=([\w-]+)/);
    return m ? "https://lh3.googleusercontent.com/d/" + m[1] : link; /* any other direct image URL is used as given */
  }
  function setPhoto(archId, link, alt) {
    var url = driveImageUrl(link), arch = $(archId);
    if (!url || !arch) return;
    var img = new Image();
    img.alt = alt; img.referrerPolicy = "no-referrer";
    img.onload = function () { arch.textContent = ""; arch.appendChild(img); };
    img.src = url; /* if it fails to load, the initial letter stays */
  }
  setPhoto("groomArch", CONFIG.groomPhoto, CONFIG.groom);
  setPhoto("brideArch", CONFIG.bridePhoto, CONFIG.bride);

  /* ---------- Gate ---------- */
  var music = null; /* set by the Mangal Dhwani block below */
  var gate = $("gate"), opened = false;
  function openGate() {
    if (opened) return; opened = true;
    if (music) music.play(); /* the tap that opens the card also starts the music */
    gate.classList.add("open");
    setTimeout(function () { gate.style.display = "none"; startPetals(true); }, 2800);
  }
  $("gateBtn").addEventListener("click", openGate);
  gate.addEventListener("click", openGate);

  /* ---------- Toran (marigold garland) ---------- */
  (function () {
    var host = $("toran"), W = 1200, H = 150;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("preserveAspectRatio", "xMidYMin slice");
    var cols = ["#f0891a", "#e0ae4b", "#c9261c", "#f0891a"];
    var bar = document.createElementNS(NS, "rect");
    bar.setAttribute("x", 0); bar.setAttribute("y", 0); bar.setAttribute("width", W); bar.setAttribute("height", 12); bar.setAttribute("fill", "#e0ae4b");
    svg.appendChild(bar);
    var n = 24, step = W / n;
    for (var i = 0; i < n; i++) {
      var x = step * i + step / 2;
      var len = (i % 2 === 0) ? 6 : 4;
      for (var j = 0; j < len; j++) {
        var c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", x + Math.sin(j + i) * 2); c.setAttribute("cy", 22 + j * 15);
        c.setAttribute("r", j === len - 1 ? 9 : 7);
        c.setAttribute("fill", j === len - 1 ? "#c9261c" : cols[(i + j) % cols.length]);
        c.setAttribute("stroke", "#4a0b10"); c.setAttribute("stroke-width", 1);
        svg.appendChild(c);
      }
      var leaf = document.createElementNS(NS, "path");
      var lx = x - step / 2;
      leaf.setAttribute("d", "M" + lx + " 12 q-10 16 0 32 q10 -16 0 -32z");
      leaf.setAttribute("fill", "#2f6b3a"); leaf.setAttribute("stroke", "#e0ae4b"); leaf.setAttribute("stroke-width", "1");
      svg.insertBefore(leaf, bar.nextSibling);
    }
    host.appendChild(svg);
    var gt = $("gateToran");
    if (gt) gt.appendChild(svg.cloneNode(true));
  })();

  /* ---------- 3D mandala ---------- */
  (function () {
    var host = $("mandala");
    function petalPath(r1, r2, w) {
      var m = (r1 + r2) / 2;
      return "M0 " + (-r1) + " Q" + w + " " + (-m) + " 0 " + (-r2) + " Q" + (-w) + " " + (-m) + " 0 " + (-r1) + "Z";
    }
    function layer(opts) {
      var d = document.createElement("div"); d.className = "layer";
      d.style.transform = "translateZ(" + opts.z + "px)";
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "-260 -260 520 520");
      svg.style.setProperty("--spd", opts.spd + "s");
      svg.style.setProperty("--dir", opts.dir || "normal");
      for (var i = 0; i < opts.n; i++) {
        var g = document.createElementNS(NS, "g");
        g.setAttribute("transform", "rotate(" + (i * 360 / opts.n) + ")");
        var p = document.createElementNS(NS, "path");
        p.setAttribute("d", petalPath(opts.r1, opts.r2, opts.w));
        p.setAttribute("fill", opts.fill); p.setAttribute("fill-opacity", opts.fo);
        p.setAttribute("stroke", opts.stroke); p.setAttribute("stroke-width", opts.sw || 1.5);
        g.appendChild(p);
        if (opts.dot) {
          var c = document.createElementNS(NS, "circle");
          c.setAttribute("cx", 0); c.setAttribute("cy", -(opts.r2 + 8)); c.setAttribute("r", 3.2); c.setAttribute("fill", opts.dot);
          g.appendChild(c);
        }
        svg.appendChild(g);
      }
      d.appendChild(svg);
      host.insertBefore(d, host.querySelector(".names"));
    }
    layer({ z: -150, spd: 140, n: 32, r1: 170, r2: 245, w: 16, fill: "#4a0b10", fo: 0.8, stroke: "#e0ae4b", dot: "#e0ae4b" });
    layer({ z: -100, spd: 90, dir: "reverse", n: 24, r1: 130, r2: 220, w: 26, fill: "#c9261c", fo: 0.55, stroke: "#e0ae4b" });
    layer({ z: -50, spd: 70, n: 16, r1: 95, r2: 185, w: 34, fill: "#f0891a", fo: 0.7, stroke: "#fbefd5", sw: 1.2 });
    layer({ z: 0, spd: 55, dir: "reverse", n: 12, r1: 60, r2: 150, w: 32, fill: "#e0ae4b", fo: 0.55, stroke: "#4a0b10" });
    layer({ z: 50, spd: 45, n: 8, r1: 30, r2: 105, w: 26, fill: "#c9261c", fo: 0.85, stroke: "#e0ae4b" });

    var stage = $("stage"), rx = 12, ry = 0, tx = 12, ty = 0, raf = 0;
    function frame() {
      rx += (tx - rx) * 0.08; ry += (ty - ry) * 0.08;
      host.style.setProperty("--rx", rx.toFixed(2) + "deg");
      host.style.setProperty("--ry", ry.toFixed(2) + "deg");
      if (Math.abs(tx - rx) > 0.05 || Math.abs(ty - ry) > 0.05) raf = requestAnimationFrame(frame); else raf = 0;
    }
    function aim(e) {
      var r = stage.getBoundingClientRect();
      var px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      tx = 12 - py * 26; ty = px * 30;
      if (!raf) raf = requestAnimationFrame(frame);
    }
    if (!reduce) {
      stage.addEventListener("pointermove", aim);
      stage.addEventListener("pointerleave", function () { tx = 12; ty = 0; if (!raf) raf = requestAnimationFrame(frame); });
      var t0 = 0;
      (function idle(t) {
        if (!raf && !stage.matches(":hover")) {
          tx = 12 + Math.sin(t / 2600) * 5; ty = Math.sin(t / 3400) * 14;
          rx += (tx - rx) * 0.05; ry += (ty - ry) * 0.05;
          host.style.setProperty("--rx", rx.toFixed(2) + "deg");
          host.style.setProperty("--ry", ry.toFixed(2) + "deg");
        }
        requestAnimationFrame(idle);
      })(0);
    }
  })();

  /* ---------- Ceremony cards ---------- */
  (function () {
    var host = $("cards");
    CONFIG.events.forEach(function (ev) {
      var t = document.createElement("div"); t.className = "tilt";
      var b = document.createElement("button"); b.type = "button"; b.className = "flip"; b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", ev.name + ", " + ev.date + ". Turn card over for details.");
      b.innerHTML =
        '<span class="face front" style="--accent:' + ev.accent + '">' +
          '<span class="glyph deva" aria-hidden="true">' + ev.glyph + '</span>' +
          '<span class="deva-title">' + ev.deva + '</span>' +
          '<h3>' + ev.name + '</h3>' +
          '<span class="when">' + ev.date + '</span>' +
          '<span class="flip-hint">Tap to turn</span>' +
        '</span>' +
        '<span class="face back">' +
          '<h3>' + ev.name + '</h3>' +
          '<p>' + ev.time + '</p>' +
          '<p>' + ev.place + '</p>' +
          '<p>' + ev.note + '</p>' +
          '<p class="dress">Attire: ' + ev.dress + '</p>' +
        '</span>';
      b.addEventListener("click", function () {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
      });
      t.appendChild(b); host.appendChild(t);
      if (!reduce && window.matchMedia("(hover: hover)").matches) {
        t.addEventListener("pointermove", function (e) {
          var r = t.getBoundingClientRect();
          t.style.setProperty("--ty", (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(1) + "deg");
          t.style.setProperty("--tx", ((0.5 - (e.clientY - r.top) / r.height) * 12).toFixed(1) + "deg");
        });
        t.addEventListener("pointerleave", function () { t.style.setProperty("--tx", "0deg"); t.style.setProperty("--ty", "0deg"); });
      }
    });
  })();

  /* ---------- Countdown ---------- */
  (function () {
    var target = new Date(CONFIG.weddingISO).getTime();
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        $("cdD").textContent = $("cdH").textContent = $("cdM").textContent = $("cdS").textContent = "00";
        $("cdNote").textContent = "The celebrations have begun. Thank you for your blessings.";
        return;
      }
      var s = Math.floor(diff / 1000);
      $("cdD").textContent = pad(Math.floor(s / 86400));
      $("cdH").textContent = pad(Math.floor(s % 86400 / 3600));
      $("cdM").textContent = pad(Math.floor(s % 3600 / 60));
      $("cdS").textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------- Scroll rise ---------- */
  (function () {
    var els = document.querySelectorAll(".rise");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add("in"); }); }, 6000);
  })();

  /* ---------- Falling petals ---------- */
  var petalsOn = false;
  function startPetals() {
    if (petalsOn || reduce) return; petalsOn = true;
    var cv = $("petals"), ctx = cv.getContext("2d"), W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { W = window.innerWidth; H = window.innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener("resize", size);
    var cols = ["#f0891a", "#e0ae4b", "#c9261c", "#f7b04a", "#e8587a"];
    var n = W < 600 ? 22 : 38, ps = [];
    function mk(top) {
      return { x: Math.random() * W, y: top ? -20 - Math.random() * H : Math.random() * H, s: 5 + Math.random() * 8, v: 0.5 + Math.random() * 1.1,
        a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.04, sw: Math.random() * 6.28, c: cols[Math.floor(Math.random() * cols.length)] };
    }
    for (var i = 0; i < n; i++) ps.push(mk(false));
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(function (p, i) {
        p.y += p.v; p.sw += 0.02; p.x += Math.sin(p.sw) * 0.8; p.a += p.va;
        if (p.y > H + 20) ps[i] = mk(true);
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.globalAlpha = 0.85; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.28); ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  }
  if (reduce) { /* no petals */ }

  /* ---------- Mangal Dhwani (synthesised drone and plucks) ---------- */
  (function () {
    var btn = $("sound"), ac = null, master = null, timer = null, on = false, nodes = [];
    function pluck(freq, when) {
      var o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = "triangle"; o.frequency.value = freq;
      f.type = "lowpass"; f.frequency.value = 1800;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(0.35, when + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 2.6);
      o.connect(f); f.connect(g); g.connect(master);
      o.start(when); o.stop(when + 2.7);
    }
    function bell(when) {
      [880, 1318.5, 1760].forEach(function (fr, i) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = "sine"; o.frequency.value = fr;
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(0.08 / (i + 1), when + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 3);
        o.connect(g); g.connect(master); o.start(when); o.stop(when + 3.1);
      });
    }
    function start() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!ac) {
        ac = new AC(); master = ac.createGain(); master.gain.value = 0.0001; master.connect(ac.destination);
        [146.83, 146.83 * 1.5, 293.66].forEach(function (fr, i) {
          var o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
          o.type = "sawtooth"; o.frequency.value = fr; o.detune.value = (i - 1) * 4;
          f.type = "lowpass"; f.frequency.value = 500; g.gain.value = 0.05;
          o.connect(f); f.connect(g); g.connect(master); o.start(); nodes.push(o);
        });
      }
      if (ac.resume) ac.resume();
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.linearRampToValueAtTime(0.7, ac.currentTime + 1.5);
      var seq = [220.5, 293.66, 293.66, 146.83], k = 0;
      function step() { pluck(seq[k % 4], ac.currentTime + 0.05); if (k % 8 === 0) bell(ac.currentTime + 0.1); k++; }
      step(); timer = setInterval(step, 2100);
      return true;
    }
    function stop() {
      clearInterval(timer);
      if (master) { master.gain.cancelScheduledValues(ac.currentTime); master.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.6); }
    }
    function paint() {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = "Mangal Dhwani: " + (on ? "on" : "off");
    }
    music = {
      play: function () {
        if (on) return;
        try { if (start()) { on = true; paint(); } } catch (err) { /* browser refused audio; the button still works */ }
      }
    };
    btn.addEventListener("click", function () {
      if (!on) { if (!start()) { btn.textContent = "Sound unavailable"; return; } on = true; }
      else { stop(); on = false; }
      paint();
    });
  })();

  /* ---------- Diyas (lit oil lamps) ---------- */
  (function () {
    var lamp = '<svg viewBox="0 0 80 84" aria-hidden="true"><g class="flame"><path d="M40 40C26 26 35 12 40 2c5 10 14 24 0 38z" fill="#ffb347"/><path d="M40 38c-7-8-3-16 0-22 3 6 7 14 0 22z" fill="#fff3b0"/></g><path d="M6 46Q40 94 74 46Q40 58 6 46Z" fill="#c9261c" stroke="#e0ae4b" stroke-width="3"/><path d="M15 52Q40 72 65 52" fill="none" stroke="#f0891a" stroke-width="3"/><ellipse cx="40" cy="46" rx="34" ry="5" fill="#7d1210" stroke="#e0ae4b" stroke-width="3"/></svg>';
    document.querySelectorAll(".diya").forEach(function (d, i) { d.innerHTML = lamp; d.style.setProperty("--delay", (i * 0.37) + "s"); });
  })();

  /* ---------- Lotus under each portrait ---------- */
  document.querySelectorAll(".person .arch").forEach(function (a) {
    a.insertAdjacentHTML("afterend", '<svg class="lotus-base" viewBox="0 0 200 100" aria-hidden="true"><use href="#lotus"/></svg>');
  });

  /* ---------- Watermark parallax ---------- */
  (function () {
    if (reduce) return;
    var wms = [].slice.call(document.querySelectorAll(".wm")), ticking = false;
    function update() {
      ticking = false;
      var h = window.innerHeight;
      wms.forEach(function (w) {
        var r = w.parentElement.getBoundingClientRect();
        w.style.setProperty("--y", ((r.top + r.height / 2 - h / 2) * -0.14).toFixed(1));
      });
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

})();
