(function createCustomConsole() {
  // Remove older versions
  const old = document.getElementById('customConsole');
  if (old) old.remove();

  // --- Styles
  const style = document.createElement('style');
  style.textContent = `
    #customConsole {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40vh;
      background: rgba(18, 18, 18, 0.95);
      color: #fff;
      font-family: monospace;
      display: flex;
      flex-direction: column;
      z-index: 9999;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
      transition: all 0.3s ease;
    }
    #customConsole.fullscreen {
      top: 0;
      height: 100vh;
    }
    #customConsoleHeader {
      display: flex;
      justify-content: flex-end;
      padding: 5px 10px;
      background: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid #444;
    }
    #fullscreenToggle {
      background: transparent;
      border: 1px solid #555;
      color: #ccc;
      font-size: 0.8rem;
      padding: 3px 6px;
      cursor: pointer;
      border-radius: 4px;
    }
    #fullscreenToggle:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    #customConsoleLog {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
    }
    #customConsoleLog::-webkit-scrollbar,
    #commandSuggestions::-webkit-scrollbar {
      width: 8px;
    }
    #customConsoleLog::-webkit-scrollbar-thumb,
    #commandSuggestions::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    #customConsoleLog p {
      margin: 0;
      padding: 0.2rem 0;
    }
    #customConsoleInput {
      position: relative;
      display: flex;
      border-top: 1px solid #333;
      background: #1e1e1e;
    }
    #customConsoleInput input {
      flex: 1;
      padding: 1rem;
      border: none;
      background: #1e1e1e;
      color: white;
      font-family: monospace;
      font-size: 1rem;
    }
    #customConsoleInput input:focus {
      outline: none;
    }
    #commandSuggestions {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #222;
      border: 1px solid #444;
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      z-index: 10000;
    }
    #commandSuggestions div {
      padding: 0.5rem;
      cursor: pointer;
    }
    #commandSuggestions div.active {
      background: #444;
    }
    #commandSuggestions div:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);

  // Elements
  const container = document.createElement('div');
  container.id = 'customConsole';

  const header = document.createElement('div');
  header.id = 'customConsoleHeader';

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'fullscreenToggle';
  toggleBtn.textContent = 'Fullscreen';
  header.appendChild(toggleBtn);

  const logDiv = document.createElement('div');
  logDiv.id = 'customConsoleLog';

  const inputContainer = document.createElement('div');
  inputContainer.id = 'customConsoleInput';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = '/command...';

  const suggestionBox = document.createElement('div');
  suggestionBox.id = 'commandSuggestions';
  suggestionBox.style.display = 'none';

  inputContainer.appendChild(input);
  inputContainer.appendChild(suggestionBox);
  container.appendChild(header);
  container.appendChild(logDiv);
  container.appendChild(inputContainer);
  document.body.appendChild(container);

  // Logging
  function log(message, isError = false) {
    const line = document.createElement('p');
    line.textContent = message;
    line.style.color = isError ? '#f44336' : '#90caf9';
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // Commands
  const commands = {
    clear: () => (logDiv.innerHTML = ""),
    "any-blook": () => {
      try {
        const snode = Object.values(window.document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
        function setBlooks(blks) {
          snode.setState({ unlocks: Object.keys(blks) });
          alert("All Blooks ran successfully!");
          console.log("Blooks Found!");
        }
        if (!window.location.href.includes("/lobby")) {
          alert("You must be on the lobby for this cheat to work!");
          console.error("you must be on the lobby page!");
        } else {
          if (window.Object.keys.toString().includes("native code")) {
            const t = window.Object.keys;
            window.Object.keys = function (a) {
              if (a["Breakfast Combo"]) {
                window.Object.keys = t;
                setBlooks(a);
              }
              return t(a);
            };
          }
        }
        snode.render();
      } catch (err) {
        log("Error running /any-blook", true);
        console.error(err);
      }
    },
    "set-blook-spam": (speed = 1) => {
      const el = document.querySelector("._blooksHolder_1bg6w_141");
      if (!el) return log("❌ Cannot find ._blooksHolder_1bg6w_141", true);
      if (window._blookClickInterval) clearInterval(window._blookClickInterval);
      const ms = parseInt(speed);
      if (isNaN(ms) || ms < 1) return log("❌ Invalid speed. Use a number >= 1.", true); // Speed now starts from 1ms
      window._blookClickInterval = setInterval(() => {
        const children = [...el.children];
        if (!children.length) return;
        const rand = Math.floor(Math.random() * children.length);
        children[rand].click();
      }, ms);
      log(`⚡ Blook spam started (every ${ms}ms).`);
    },
    "stop-blook-spam": () => {
      if (window._blookClickInterval) {
        clearInterval(window._blookClickInterval);
        delete window._blookClickInterval;
        log("⏹️ Blook spam stopped.");
      } else {
        log("⚠️ Blook spam is not running.");
      }
    },
    "auto-answer": () => {
      (() => {
        const cheat = (async () => {
          const { stateNode: { state: { question, stage, feedback }, props: { client: { question: pquestion } } } } = Object.values((function react(r = document.querySelector("body>div")) { return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div")) })())[1].children[0]._owner;
          try {
            if (question.qType != "typing") if (stage !== "feedback" && !feedback) [...document.querySelectorAll(`[class*="answerContainer"]`)][(question || pquestion).answers.map((x, i) => (question || pquestion).correctAnswers.includes(x) ? i : null).filter(x => x != null)[0]]?.click?.();
            else document.querySelector('[class*="feedback"]')?.firstChild?.click?.();
            else Object.values(document.querySelector("[class*='typingAnswerWrapper']"))[1].children._owner.stateNode.sendAnswer(question.answers[0])
          } catch { }
        });
        let img = new Image;
        img.src = "https://raw.githubusercontent.com/05Konz/Blooket-Cheats/main/autoupdate/timestamps/global/autoAnswer.png?" + Date.now();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          const c = document.createElement("canvas");
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, this.width, this.height);
          let { data } = ctx.getImageData(0, 0, this.width, this.height), decode = "", last;
          for (let i = 0; i < data.length; i += 4) {
            let char = String.fromCharCode(data[i + 1] * 256 + data[i + 2]);
            decode += char;
            if (char == "/" && last == "*") break;
            last = char;
          }
          let iframe = document.querySelector("iframe");
          const [_, time, error] = decode.match(/LastUpdated: (.+?); ErrorMessage: "(.+?)"/);
          if (parseInt(time) <= 1693429947379 || iframe.contentWindow.confirm(error)) cheat();
        }
        img.onerror = img.onabort = () => (img.src = null, cheat());
      })();
    },
    "answer-highlight": () => {
      (() => {
        const cheat = (async () => {
          const { stateNode: { state, props } } = Object.values((function react(r = document.querySelector("body>div")) { return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div")) })())[1].children[0]._owner;
          [...document.querySelectorAll(`[class*="answerContainer"]`)].forEach((answer, i) => {
            if ((state.question || props.client.question).correctAnswers.includes((state.question || props.client.question).answers[i])) answer.style.backgroundColor = "rgb(0, 207, 119)";
            else answer.style.backgroundColor = "rgb(189, 15, 38)";
          });
        });
        let img = new Image;
        img.src = "https://raw.githubusercontent.com/05Konz/Blooket-Cheats/main/autoupdate/timestamps/global/highlightAnswers.png?" + Date.now();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          const c = document.createElement("canvas");
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, this.width, this.height);
          let { data } = ctx.getImageData(0, 0, this.width, this.height), decode = "", last;
          for (let i = 0; i < data.length; i += 4) {
            let char = String.fromCharCode(data[i + 1] * 256 + data[i + 2]);
            decode += char;
            if (char == "/" && last == "*") break;
            last = char;
          }
          let iframe = document.querySelector("iframe");
          const [_, time, error] = decode.match(/LastUpdated: (.+?); ErrorMessage: "(.+?)"/);
          if (parseInt(time) <= 1693429947392 || iframe.contentWindow.confirm(error)) cheat();
        }
        img.onerror = img.onabort = () => (img.src = null, cheat());
      })();
    }
  };

  const commandList = Object.keys(commands);
  let activeSuggestionIndex = -1;

  // Input logic
  input.addEventListener('keydown', (e) => {
    const code = input.value.trim();

    if (suggestionBox.style.display === 'block') {
      if (e.key === 'ArrowDown') {
        activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestionBox.children.length;
        updateSuggestionHighlight();
        e.preventDefault();
        return;
      } else if (e.key === 'ArrowUp') {
        activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestionBox.children.length) % suggestionBox.children.length;
        updateSuggestionHighlight();
        e.preventDefault();
        return;
      } else if (e.key === 'Enter' && activeSuggestionIndex > -1) {
        input.value = '/' + suggestionBox.children[activeSuggestionIndex].textContent;
        hideSuggestions();
        e.preventDefault();
        return;
      }
    }

    if (e.key === 'Enter') {
      log(`> ${code}`);
      hideSuggestions();
      if (code.startsWith('/')) {
        const [cmd, ...args] = code.slice(1).split(' ');
        if (commands[cmd]) {
          try {
            commands[cmd](...args);
          } catch (err) {
            log(`Command error: ${err.message}`, true);
          }
        } else {
          log(`Unknown command: /${cmd}`, true);
        }
      } else {
        try {
          const result = eval(code);
          log(result);
        } catch (err) {
          log(err.message, true);
        }
      }
      input.value = '';
      activeSuggestionIndex = -1;
    }
  });

  input.addEventListener('input', () => {
    const value = input.value;
    if (value.startsWith('/')) {
      const query = value.slice(1).toLowerCase();
      const matches = commandList.filter(cmd => cmd.startsWith(query));
      showSuggestions(matches);
    } else {
      hideSuggestions();
    }
  });

  function showSuggestions(matches) {
    suggestionBox.innerHTML = '';
    activeSuggestionIndex = -1;
    if (!matches.length) return hideSuggestions();
    matches.forEach(cmd => {
      const item = document.createElement('div');
      item.textContent = cmd;
      item.addEventListener('click', () => {
        input.value = '/' + cmd;
        hideSuggestions();
        input.focus();
      });
      suggestionBox.appendChild(item);
    });
    suggestionBox.style.display = 'block';
  }

  function hideSuggestions() {
    suggestionBox.style.display = 'none';
  }

  function updateSuggestionHighlight() {
    [...suggestionBox.children].forEach((child, index) => {
      if (index === activeSuggestionIndex) {
        child.classList.add('active');
      } else {
        child.classList.remove('active');
      }
    });
  }

  // Toggle visibility of the console when Right Ctrl is pressed
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Control' && e.location === 2) { // Right Control
      container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }
  });

  // Toggle fullscreen
  toggleBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen');
    toggleBtn.textContent = container.classList.contains('fullscreen') ? 'Exit Fullscreen' : 'Fullscreen';
  });

  // Show the console open by default
  log('Welcome to Custom Console!');
})();
