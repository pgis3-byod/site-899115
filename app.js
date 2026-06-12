const gamesEl = document.getElementById("games");

let games = [];

const params = new URLSearchParams(location.search);
const currentGame = params.get("lesson");

async function getGames() {
  if (!games.length) {
    games = await fetch("games.json").then(r => r.json());
  }

  return games;
}

if (currentGame) {
  (async () => {
    const games = await getGames();

    if (!games.includes(currentGame)) {
      document.body.innerHTML = "Game not found";
      throw new Error("Lesson not found");
    }

    document.body.innerHTML = `
<!--widgets-->
  
<div id="batteryWidget">
  <svg viewBox="0 0 24 24" class="battery-icon">
    <rect x="2" y="7" width="18" height="10" rx="2" ry="2"
      fill="none" stroke="currentColor" stroke-width="2"/>
    <rect id="batteryLevel" x="2.5" y="7" width="0" height="10"
      fill="currentColor"/>
    <rect x="20" y="10" width="2" height="4"
      fill="currentColor"/>
  </svg>

  <span id="batteryText">--%</span>
</div>

<style>


#batteryWidget {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-family: sans-serif;
  font-size: 14px;
  z-index: 9999;
}

.battery-icon {
  width: 24px;
  height: 24px;
}
</style>

<script>

</script>
  
<div id="fps-counter">FPS: N/A</div>

<style>
#fps-counter{
    position: fixed;
  top: 35px;
  right: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-family: sans-serif;
  font-size: 14px;
  z-index: 9999;
}
</style>




  
<!--main content-->
  

    
    <div style="text-align: left; margin: 0; padding: 20px; background: black; color: whitesmoke; font-family: Arial;">
      <a href="/" style="color: white;">← Back to Homepage</a>
      <a href="games/${currentGame}.html" download style="margin-left: 12px;">Download game</a>
      <h3 style="text-align: center;">PGIS</h3>
    </div>

    <iframe
      id="frame"
      src="games/${currentGame}.html"
      style="height: 638px; width: 100%; max-width: 1500px; border: none; display: block; margin: 20px auto;"
      title="game">
    </iframe>

    <button
      id="fullscreenBtn"
      style="position: fixed; top: 20px; left: 330px; z-index: 999999; border: medium; cursor: pointer; background-color: rgb(68, 68, 68); color: whitesmoke; border-radius: 5px;">
      Fullscreen
    </button>

    <button
      id="aboutBlankBtn"
      style="position: fixed; top: 20px; left: 410px; z-index: 999999; background: rgb(68, 68, 68); color: whitesmoke; border-radius: 5px; border: medium; cursor: pointer;">
      Open in about:blank
    </button>

    <button
      id="cloakBtn"
      style="position: fixed; top: 20px; left: 548px; z-index: 99999; border: medium; cursor: pointer; background-color: rgb(68, 68, 68); color: whitesmoke; border-radius: 5px;">
      Cloak tab
    </button>
    `;



    
    window.openFullscreen = function () {
      const iframe = document.getElementById("frame");

      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    };

    document
      .getElementById("fullscreenBtn")
      .addEventListener("click", openFullscreen);

    window.loadUrl = function () {
      const win = window.open("about:blank");

      if (!win) return;

      win.document.open();
      win.document.write(document.documentElement.outerHTML);
      win.document.close();
    };

    document
      .getElementById("aboutBlankBtn")
      .addEventListener("click", loadUrl);

    function cloakTab() {
      const btn = document.getElementById("cloakBtn");

      let toggled = false;

      const originalTitle = document.title;

      function setFavicon(url) {
        let link =
          document.querySelector("link[rel~='icon']") ||
          document.createElement("link");

        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = url;

        document.head.appendChild(link);
      }

      const originalFavicon =
        document.querySelector("link[rel~='icon']")?.href || "";

      btn.onclick = function () {
        toggled = !toggled;

        if (toggled) {
          document.title = "Google Classroom";

          setFavicon(
            "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://staticin.pages.dev/settings&size=16"
          );
        } else {
          document.title = originalTitle;
          setFavicon(originalFavicon);
        }
      };
    }

    cloakTab();





    

//widgets start//

//fps//
(() => {
    const fpsCounter = document.getElementById("fps-counter");

    let frames = 0;
    let lastTime = performance.now();

    function loop(now) {
        frames++;

        if (now >= lastTime + 1000) {
            const fps = Math.round((frames * 1000) / (now - lastTime));
            fpsCounter.textContent = "FPS: " + fps;
            frames = 0;
            lastTime = now;
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
})();

//battery//


async function initBattery() {
  if (!navigator.getBattery) {
    document.getElementById("batteryText").textContent = "N/A";
    return;
  }

  const battery = await navigator.getBattery();

  function update() {
    const level = Math.round(battery.level * 100);

    document.getElementById("batteryText").textContent = level + "%";

    const fill = document.getElementById("batteryLevel");
    fill.setAttribute("width", (level / 100) * 16.5);
  }

  update();

  battery.addEventListener("levelchange", update);
  battery.addEventListener("chargingchange", update);
}

initBattery();


//widgets end//




    




    
  })();
}

window.loadGames = async function () {
  const games = await getGames();

  const container = document.getElementById("games");
  if (!container) return;

  container.innerHTML = `
    <div id="cards2">
      ${games.map(game => `
        <div class="gamediv">
          <b>${game}</b>
          <img src="games/${game}.png" width="100" height="100">
          <a href="?lesson=${encodeURIComponent(game)}">
            <button>play</button>
          </a>
        </div>
      `).join("")}
    </div>
  `;
};





window.Home = async function () {




  
  const html = await fetch("/index.html").then(r => r.text());
  const doc = new DOMParser().parseFromString(html, "text/html");

  document.getElementById("games").innerHTML =
    doc.getElementById("games").innerHTML;


 
};

window.proxy = async function () {
    document.getElementById("games").innerHTML = `
      <iframe id="browser" style="width: 100%; height: 100vh;" src="https://homework--spmspy0800.replit.app"></iframe>
    `;
};

window.settings = async function () {
    document.getElementById("games").innerHTML = `
       <div class="card">
  <div class="settings">
    <h2>Panic key</h2>
  <h3>The panic key is <b>ctrl + q</b></h3>
  
  <p style="display: inline-block;">Panic key url:</p> 
<input id="panicUrl" type="text" placeholder="google.com">
  </div>
    <div class="settings">

 <h2>Tab cloak</h2>

    <button id="toggleButton">ON/OFF</button>
<br>
    <p style="display: inline-block;">Title: </p>
    <input id="cloakTitleInput" type="text" placeholder="Google Classroom">
<br>
    <p style="display: inline-block;">Favicon URL: </p>
    <input id="cloakIconInput" type="text" placeholder="https://...">

    </div>
    <div class="settings">

    <h2>URL cloak</h2>
    <button id="aboutBlankBtn">Open site in about:blank</button> <button id="blobBtn">Open site in blob:</button>
    </div>
        <div class="settings">

    <h2>Theme</h2>
    <button id="themeToggle">Light Mode (beta)</button> <button id="particlesToggle">Particles</button>
    </div>
    </div>
<br><br>
<details>
  <summary>Advanced</summary>
    <div class="card">
  <div class="settings">
  <h2>browser</h2>
  <p style="display: inline-block;">embedd URL (must start with http(s)://)</p>
  <input placeholder="https://croxyproxy.com" id="browserUrl">
  </div>
  <div class="settings">
  <h2>eruda dev tools</h2>
  <button id="erudaButtonToggle">Eruda Button Toggle</button>
</div>

  <div class="settings">
  <h2>JavaScript runner</h2>
  <textarea id="jsCode" placeholder="Enter JavaScript here"></textarea>
<button id="runJsButton">Run JavaScript</button>
</div>
  
  </div>
</details>


    </div>
          `;
  
  updateToggleButton();

};


window.chat = async function () {
    document.getElementById("games").innerHTML = `
      <iframe src="/chat/rules.html"></iframe>
      `;
};



window.test = async function () {
    document.getElementById("games").innerHTML = `
      <h1 class="main-text">test</h1>
      <p>this is an example page in pgis 3</p>
    `;
};










//settings//





document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "panicUrl") {
    saveUrl(e.target.value);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.target && e.target.id === "panicUrl" && e.key === "Enter") {
    saveUrl(e.target.value);
  }

  if (e.ctrlKey && e.key.toLowerCase() === "q") {
    e.preventDefault();
    window.location.href =
      localStorage.getItem("redirectUrl") || "https://google.com";
  }
});

function saveUrl(value) {
  let url = value.trim();
  if (!url) return;

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  localStorage.setItem("redirectUrl", url);
  alert("Saved");
}










const TOGGLE_KEY = "buttonEnabled";
const CLOAK_TITLE_KEY = "cloakTitle";
const CLOAK_ICON_KEY = "cloakIcon";

const originalTitle = document.title;
const originalFavicon =
  document.querySelector("link[rel~='icon']")?.href || "";

function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = url;
}

function applyCloak() {
  const enabled = localStorage.getItem(TOGGLE_KEY) === "true";

  const title =
    localStorage.getItem(CLOAK_TITLE_KEY) || "Google Classroom";

  const icon =
    localStorage.getItem(CLOAK_ICON_KEY) ||
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://staticin.pages.dev/settings&size=16";

  if (enabled) {
    document.title = title;
    setFavicon(icon);
  } else {
    document.title = originalTitle;
    setFavicon(originalFavicon);
  }

  updateToggleButton();
}

function updateToggleButton() {
  const button = document.getElementById("toggleButton");
  if (!button) return;

  const enabled = localStorage.getItem(TOGGLE_KEY) === "true";
  button.textContent = enabled ? "ON" : "OFF";
}

document.addEventListener("click", (e) => {
  if (e.target?.id === "toggleButton") {
    const enabled = localStorage.getItem(TOGGLE_KEY) === "true";
    localStorage.setItem(TOGGLE_KEY, (!enabled).toString());
    applyCloak();
  }
});

document.addEventListener("input", (e) => {
  if (e.target?.id === "cloakTitleInput") {
    localStorage.setItem(CLOAK_TITLE_KEY, e.target.value);
    applyCloak();
  }

  if (e.target?.id === "cloakIconInput") {
    localStorage.setItem(CLOAK_ICON_KEY, e.target.value);
    applyCloak();
  }
});

if (localStorage.getItem(TOGGLE_KEY) === null) {
  localStorage.setItem(TOGGLE_KEY, "false");
}

applyCloak();
















document.addEventListener("click", (e) => {
  const btn = e.target.closest("#aboutBlankBtn");
  if (!btn) return;

  const win = window.open("about:blank");

  const iframe = win.document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.src = window.location.href;

  win.document.body.style.margin = "0";
  win.document.body.appendChild(iframe);
});


document.addEventListener("click", (e) => {
  const btn = e.target.closest("#blobBtn");
  if (!btn) return;

  const html = `
    <!doctype html>
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            height: 100%;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${location.href}"></iframe>
      </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  window.open(url);
});







const KEY = "theme";

function apply(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  }
}

function getTheme() {
  return localStorage.getItem(KEY) || "dark";
}

function toggle() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";

  localStorage.setItem(KEY, next);
  apply(next);
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "themeToggle") {
    toggle();
  }
});

apply(getTheme());










const PARTICLES_KEY = "particlesEnabled";

function updateParticles() {
  const enabled = localStorage.getItem(PARTICLES_KEY) !== "false";

  const particles = document.getElementById("particles-js");
  if (particles) {
    particles.style.display = enabled ? "" : "none";
  }

  const button = document.getElementById("particlesToggle");
  if (button) {
    button.textContent = enabled ? "Particles: ON" : "Particles: OFF";
  }
}

document.addEventListener("click", (e) => {
  const button = e.target.closest("#particlesToggle");
  if (!button) return;

  const enabled = localStorage.getItem(PARTICLES_KEY) !== "false";
  localStorage.setItem(PARTICLES_KEY, String(!enabled));

  updateParticles();
});

if (localStorage.getItem(PARTICLES_KEY) === null) {
  localStorage.setItem(PARTICLES_KEY, "true");
}

updateParticles();



















const STORAGE_KEY = "iframeUrl";

function applyBrowserUrl(url) {
  const iframe = document.getElementById("browser");
  if (iframe && url) {
    iframe.src = url;
  }
}

function saveBrowserUrl(url) {
  localStorage.setItem(STORAGE_KEY, url);
  applyBrowserUrl(url);
}

function bindBrowserUrlInput() {
  const input = document.getElementById("browserUrl");
  if (!input || input.dataset.bound === "true") return;

  input.dataset.bound = "true";

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const url = input.value.trim();
    if (!url) return;

    saveBrowserUrl(url);
  });
}

function applySavedBrowserUrl() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) applyBrowserUrl(saved);
}

const observer = new MutationObserver(() => {
  bindBrowserUrlInput();
  applySavedBrowserUrl();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

bindBrowserUrlInput();
applySavedBrowserUrl();




















const ERUDA_BUTTON_KEY = "eruda_button_visible";

function applyErudaButtonState() {
  const visible = localStorage.getItem(ERUDA_BUTTON_KEY) !== "false";

  const erudaContainer = document.getElementById("eruda");
  if (erudaContainer) {
    erudaContainer.style.display = visible ? "" : "none";
  }

  const btn = document.getElementById("erudaButtonToggle");
  if (btn) {
    btn.textContent = visible
      ? "Eruda Button ON"
      : "Eruda Button OFF";
  }
}

function toggleErudaButton() {
  const visible = localStorage.getItem(ERUDA_BUTTON_KEY) !== "false";
  localStorage.setItem(ERUDA_BUTTON_KEY, (!visible).toString());
  applyErudaButtonState();
}

document.addEventListener("click", (e) => {
  if (e.target?.id === "erudaButtonToggle") {
    toggleErudaButton();
  }
});

document.addEventListener("DOMContentLoaded", applyErudaButtonState);













document.addEventListener("click", (e) => {
  if (e.target?.id !== "runJsButton") return;

  const textarea = document.getElementById("jsCode");

  if (!textarea) {
    alert("Textarea not found.");
    return;
  }

  const code = textarea.value;

  if (!code.trim()) {
    alert("Please enter some JavaScript.");
    return;
  }

  if (!confirm(
    "Warning: Running JavaScript can break the page or cause unexpected behavior.\n\nDo you want to continue?"
  )) {
    return;
  }

  try {
    new Function(code)();
  } catch (err) {
    alert("Error:\n" + err);
    console.error(err);
  }
});
