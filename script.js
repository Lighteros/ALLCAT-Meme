(() => {
  const cfg = window.ALLCAT || {};
  const solMint = "So11111111111111111111111111111111111111112";
  const contract = (cfg.contract || "").trim();
  const dexBase = cfg.dexBase || "https://dexscreener.com/solana";
  const chartUrl = contract ? `${dexBase}/${contract}` : dexBase;
  const buyUrl = contract
    ? `${cfg.pumpswap || "https://swap.pump.fun/"}?input=${solMint}&output=${contract}`
    : cfg.pumpswap || "https://swap.pump.fun/";
  const xUrl = cfg.x || "https://x.com/ALLCATMEME";
  const embed = `${chartUrl}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`;

  document.querySelectorAll("[data-link='buy']").forEach((el) => el.setAttribute("href", buyUrl));
  document.querySelectorAll("[data-link='chart']").forEach((el) => el.setAttribute("href", chartUrl));
  document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", xUrl));

  const frame = document.getElementById("dex-embed");
  if (frame) frame.src = embed;

  const caChip = document.getElementById("ca-chip");
  const caValue = document.getElementById("ca-value");
  if (caValue) caValue.textContent = contract || "waiting for the deal";
  if (caChip) {
    caChip.addEventListener("click", async () => {
      if (!contract) return;
      try {
        await navigator.clipboard.writeText(contract);
        caValue.textContent = "copied to the stack";
        setTimeout(() => {
          caValue.textContent = contract;
        }, 1400);
      } catch (_) {
        caValue.textContent = contract;
      }
    });
  }

  const rail = document.querySelector(".rail");
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && rail) {
    toggle.addEventListener("click", () => {
      const open = rail.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        rail.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealables = document.querySelectorAll(".hole, .seat, .screen, .banner-frame");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  revealables.forEach((el) => io.observe(el));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("felt-canvas");
  if (!canvas || reduce) return;

  const ctx = canvas.getContext("2d");
  const chips = [];
  const sparks = [];
  let w = 0;
  let h = 0;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  };

  const spawn = () => {
    chips.length = 0;
    sparks.length = 0;
    const chipCount = Math.min(18, Math.floor(w / 90));
    const colors = ["#c41e3a", "#1d3f7a", "#efe6d2"];
    for (let i = 0; i < chipCount; i += 1) {
      chips.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 7 + Math.random() * 11,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -0.12 - Math.random() * 0.22,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.01,
        color: colors[i % colors.length],
      });
    }
    const sparkCount = Math.min(90, Math.floor(w / 16));
    for (let i = 0; i < sparkCount; i += 1) {
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.4,
        s: 0.08 + Math.random() * 0.28,
        a: 0.18 + Math.random() * 0.4,
      });
    }
  };

  const drawChip = (chip) => {
    ctx.save();
    ctx.translate(chip.x, chip.y);
    ctx.rotate(chip.rot);
    ctx.beginPath();
    ctx.fillStyle = chip.color;
    ctx.arc(0, 0, chip.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(0, 0, chip.r * 0.62, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    sparks.forEach((spark) => {
      spark.y -= spark.s;
      spark.x += Math.sin(spark.y * 0.02) * 0.18;
      if (spark.y < -4) {
        spark.y = h + 4;
        spark.x = Math.random() * w;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(247, 231, 178, ${spark.a})`;
      ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
      ctx.fill();
    });
    chips.forEach((chip) => {
      chip.x += chip.vx;
      chip.y += chip.vy;
      chip.rot += chip.vr;
      if (chip.y < -20) {
        chip.y = h + 20;
        chip.x = Math.random() * w;
      }
      if (chip.x < -20) chip.x = w + 20;
      if (chip.x > w + 20) chip.x = -20;
      drawChip(chip);
    });
    requestAnimationFrame(tick);
  };

  resize();
  spawn();
  window.addEventListener("resize", () => {
    resize();
    spawn();
  });
  tick();
})();
