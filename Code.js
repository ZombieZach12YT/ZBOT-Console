(function createZBOT() {
  // Remove older versions
  const old = document.getElementById('ZBOT-console');
  if (old) old.remove();

  // --- Styles
  const style = document.createElement('style');
  style.textContent = `
    #ZBOT-console {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40vh;
      background: #1a1a1a;
      color: #e0e0e0;
      font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
      display: flex;
      flex-direction: column;
      z-index: 9999;
      box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.7);
      transition: all 0.3s ease;
      border-top: 1px solid #333;
      resize: vertical;
      overflow: hidden;
      min-height: 150px;
      max-height: 90vh;
      border-radius: 8px 8px 0 0;
    }
    
    #ZBOT-console.fullscreen {
      position: fixed;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      height: 100vh !important;
      width: 100vw !important;
      max-height: 100vh !important;
      resize: none;
      border-radius: 0;
    }
    
    #ZBOT-header {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: linear-gradient(90deg, #2a2a2a, #1e1e1e);
      border-bottom: 1px solid #333;
      user-select: none;
      align-items: center;
    }
    
    #ZBOT-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      color: #7e57c2;
      font-size: 0.9rem;
    }
    
    #ZBOT-title span {
      color: #e0e0e0;
      font-size: 0.8em;
      opacity: 0.7;
    }
    
    #ZBOT-controls {
      display: flex;
      gap: 6px;
    }
    
    .ZBOT-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid #444;
      color: #ccc;
      font-size: 0.75rem;
      padding: 4px 10px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .ZBOT-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #555;
    }
    
    .ZBOT-btn svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }
    
    #ZBOT-log {
      flex: 1;
      padding: 10px 12px;
      overflow-y: auto;
      font-size: 0.9rem;
      line-height: 1.5;
      background: #1a1a1a;
    }
    
    #ZBOT-log::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }
    
    #ZBOT-log::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 4px;
    }
    
    #ZBOT-log::-webkit-scrollbar-track {
      background: transparent;
    }
    
    #ZBOT-log p {
      margin: 0;
      padding: 4px 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
    
    .log-time {
      color: #666;
      margin-right: 10px;
      font-size: 0.75em;
    }
    
    #ZBOT-input-container {
      position: relative;
      display: flex;
      border-top: 1px solid #333;
      background: #222;
      align-items: center;
    }
    
    #ZBOT-prefix {
      padding: 0 12px;
      color: #7e57c2;
      user-select: none;
      font-weight: bold;
    }
    
    #ZBOT-input {
      flex: 1;
      padding: 10px 12px;
      border: none;
      background: transparent;
      color: white;
      font-family: inherit;
      font-size: 0.9rem;
    }
    
    #ZBOT-input:focus {
      outline: none;
    }
    
    #ZBOT-suggestions {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #252525;
      border: 1px solid #444;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10000;
      box-shadow: 0 -5px 15px rgba(0,0,0,0.3);
      border-radius: 4px 4px 0 0;
      display: none;
    }
    
    #ZBOT-suggestions div {
      padding: 8px 12px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #333;
    }
    
    #ZBOT-suggestions div:last-child {
      border-bottom: none;
    }
    
    #ZBOT-suggestions div .cmd-desc {
      color: #777;
      font-size: 0.8em;
    }
    
    #ZBOT-suggestions div.active, #ZBOT-suggestions div:hover {
      background: #333;
    }
    
    /* Log level colors */
    .log-info { color: #64b5f6; }
    .log-success { color: #81c784; }
    .log-warning { color: #ffb74d; }
    .log-error { color: #e57373; }
    .log-debug { color: #ba68c8; }
    .log-system { color: #4db6ac; }
    .log-object { color: #fff176; }
    
    .ZBOT-blink {
      animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
      50% { opacity: 0; }
    }
    
    /* Status indicator */
    #ZBOT-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #81c784;
      margin-right: 8px;
    }
    
    /* Command highlight */
    .ZBOT-command {
      color: #7e57c2;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  // SVG Icons
  const svgIcons = {
    fullscreen: `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
    exitFullscreen: `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`,
    clear: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>`
  };

  // Create console container
  const container = document.createElement('div');
  container.id = 'ZBOT-console';

  // Create header
  const header = document.createElement('div');
  header.id = 'ZBOT-header';

  const titleDiv = document.createElement('div');
  titleDiv.id = 'ZBOT-title';
  titleDiv.innerHTML = `
    <div id="ZBOT-status"></div>
    <span>ZBOT</span>
    <span>v1.0.0</span>
  `;

  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'ZBOT-controls';

  const clearBtn = document.createElement('button');
  clearBtn.className = 'ZBOT-btn';
  clearBtn.title = 'Clear console (Ctrl+L)';
  clearBtn.innerHTML = `${svgIcons.clear} Clear`;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'ZBOT-btn';
  toggleBtn.id = 'ZBOT-fullscreen';
  toggleBtn.title = 'Toggle fullscreen (F11)';
  toggleBtn.innerHTML = `${svgIcons.fullscreen} Fullscreen`;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'ZBOT-btn';
  closeBtn.title = 'Close console (Right Ctrl)';
  closeBtn.innerHTML = `${svgIcons.close} Close`;

  controlsDiv.appendChild(clearBtn);
  controlsDiv.appendChild(toggleBtn);
  controlsDiv.appendChild(closeBtn);
  header.appendChild(titleDiv);
  header.appendChild(controlsDiv);

  // Create log area
  const logDiv = document.createElement('div');
  logDiv.id = 'ZBOT-log';

  // Create input area
  const inputContainer = document.createElement('div');
  inputContainer.id = 'ZBOT-input-container';

  const prefixSpan = document.createElement('div');
  prefixSpan.id = 'ZBOT-prefix';
  prefixSpan.textContent = '>';

  const input = document.createElement('input');
  input.id = 'ZBOT-input';
  input.type = 'text';
  input.placeholder = 'do /help for help';
  input.spellcheck = false;
  input.autocomplete = 'off';
  input.autocapitalize = 'off';
  input.autocorrect = 'off';

  const suggestionBox = document.createElement('div');
  suggestionBox.id = 'ZBOT-suggestions';

  inputContainer.appendChild(prefixSpan);
  inputContainer.appendChild(input);
  inputContainer.appendChild(suggestionBox);
  container.appendChild(header);
  container.appendChild(logDiv);
  container.appendChild(inputContainer);
  document.body.appendChild(container);

  // Logging system
  const logger = {
    info: (message) => log(message, 'info'),
    success: (message) => log(message, 'success'),
    warn: (message) => log(message, 'warning'),
    error: (message) => log(message, 'error'),
    debug: (message) => log(message, 'debug'),
    system: (message) => log(message, 'system'),
    object: (obj) => {
      try {
        const str = typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
        log(str, 'object');
      } catch (e) {
        log(`[Object] ${e.message}`, 'error');
      }
    },
    table: (data) => {
      if (!Array.isArray(data) && typeof data !== 'object') {
        log(`Table data must be an array or object`, 'error');
        return;
      }
      
      try {
        const table = document.createElement('pre');
        table.style.margin = '0';
        table.style.padding = '6px 0';
        table.style.fontFamily = 'inherit';
        table.style.color = '#e0e0e0';
        
        if (Array.isArray(data)) {
          if (data.length === 0) {
            table.textContent = 'Empty array';
            logDiv.appendChild(table);
            return;
          }
          
          if (typeof data[0] === 'object') {
            const keys = Object.keys(data[0]);
            const header = keys.join('\t');
            const rows = data.map(item => 
              keys.map(key => 
                typeof item[key] === 'object' ? '[Object]' : String(item[key])
              ).join('\t')
            );
            table.textContent = [header, ...rows].join('\n');
          } else {
            table.textContent = data.join('\n');
          }
        } else {
          table.textContent = Object.entries(data).map(([key, value]) => 
            `${key}: ${typeof value === 'object' ? '[Object]' : value}`
          ).join('\n');
        }
        
        logDiv.appendChild(table);
        logDiv.scrollTop = logDiv.scrollHeight;
      } catch (e) {
        log(`Error displaying table: ${e.message}`, 'error');
      }
    }
  };

  function log(message, type = 'info') {
    const line = document.createElement('p');
    const time = new Date();
    const timeStr = time.toLocaleTimeString();
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'log-time';
    timeSpan.textContent = `[${timeStr}]`;
    
    line.appendChild(timeSpan);
    
    const contentSpan = document.createElement('span');
    contentSpan.className = `log-${type}`;
    
    const lines = String(message).split('\n');
    lines.forEach((text, i) => {
      if (i > 0) {
        line.appendChild(document.createElement('br'));
        const indent = document.createElement('span');
        indent.style.display = 'inline-block';
        indent.style.width = '70px';
        line.appendChild(indent);
      }
      contentSpan.appendChild(document.createTextNode(text));
    });
    
    line.appendChild(contentSpan);
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // Command system
  const commands = {
    clear: {
      execute: () => (logDiv.innerHTML = ""),
      description: "Clear the console output"
    },
    "any-blook": {
      execute: () => {
        try {
          const snode = Object.values(window.document.querySelector('#app>div>div'))[1].children[0]._owner.stateNode;
          function setBlooks(blks) {
            snode.setState({ unlocks: Object.keys(blks) });
            logger.success("All Blooks unlocked successfully!");
            console.log("Blooks Found!");
          }
          if (!window.location.href.includes("/lobby")) {
            logger.error("You must be on the lobby for this cheat to work!");
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
          logger.error("Error running /any-blook: " + err.message);
          console.error(err);
        }
      },
      description: "Unlock all blooks in the game"
    },
    "set-blook-spam": {
      execute: (speed = 1) => {
        const el = document.querySelector("._blooksHolder_1bg6w_141");
        if (!el) return logger.error("Cannot find ._blooksHolder_1bg6w_141");
        if (window._blookClickInterval) clearInterval(window._blookClickInterval);
        const ms = parseInt(speed);
        if (isNaN(ms) || ms < 1) return logger.error("Invalid speed. Use a number >= 1.");
        window._blookClickInterval = setInterval(() => {
          const children = [...el.children];
          if (!children.length) return;
          const rand = Math.floor(Math.random() * children.length);
          children[rand].click();
        }, ms);
        logger.success(`Blook spam started (every ${ms}ms).`);
      },
      description: "Start random blook clicking [speed=1ms]"
    },
    "stop-blook-spam": {
      execute: () => {
        if (window._blookClickInterval) {
          clearInterval(window._blookClickInterval);
          delete window._blookClickInterval;
          logger.success("Blook spam stopped.");
        } else {
          logger.warn("Blook spam is not running.");
        }
      },
      description: "Stop the blook spam"
    },
    "auto-answer": {
      execute: () => {
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
      description: "Automatically answer questions"
    },
    "answer-highlight": {
      execute: () => {
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
      },
      description: "Highlight correct answers"
    },
    help: {
      execute: (cmd) => {
        if (cmd) {
          if (commands[cmd]) {
            logger.info(`Help for /${cmd}: ${commands[cmd].description}`);
          } else {
            logger.error(`Unknown command: /${cmd}`);
          }
        } else {
          logger.info("Available commands:");
          Object.keys(commands).forEach(cmd => {
            logger.info(`/${cmd}${' '.repeat(20 - cmd.length)} ${commands[cmd].description}`);
          });
        }
      },
      description: "Show help for commands [command]"
    }
  };

  const commandList = Object.keys(commands);
  let activeSuggestionIndex = -1;
  let commandHistory = [];
  let historyIndex = -1;

  // Input handling
  input.addEventListener('keydown', (e) => {
    const code = input.value.trim();

    // History navigation
    if (e.key === 'ArrowUp' && suggestionBox.style.display !== 'block') {
      if (commandHistory.length > 0) {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[commandHistory.length - 1 - historyIndex];
        }
      }
      e.preventDefault();
      return;
    }
    
    if (e.key === 'ArrowDown' && suggestionBox.style.display !== 'block') {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[commandHistory.length - 1 - historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        input.value = '';
      }
      e.preventDefault();
      return;
    }

    // Suggestion navigation
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
      } else if ((e.key === 'Enter' || e.key === 'Tab') && activeSuggestionIndex > -1) {
        input.value = '/' + suggestionBox.children[activeSuggestionIndex].getAttribute('data-cmd');
        hideSuggestions();
        e.preventDefault();
        return;
      }
    }

    // Execute command
    if (e.key === 'Enter') {
      if (!code) return;
      
      logger.info(code);
      commandHistory.unshift(code);
      historyIndex = -1;
      
      hideSuggestions();
      if (code.startsWith('/')) {
        const [cmd, ...args] = code.slice(1).split(' ');
        if (commands[cmd]) {
          try {
            commands[cmd].execute(...args);
          } catch (err) {
            logger.error(`Command error: ${err.message}`);
          }
        } else {
            logger.error(`Unknown command: /${cmd}. Type /help for available commands.`);
        }
      } else {
        logger.error("Only commands are accepted (starting with /). Type /help for available commands.");
      }
      input.value = '';
      activeSuggestionIndex = -1;
    }
  });

  input.addEventListener('input', () => {
    const value = input.value;
    if (value.startsWith('/')) {
      const query = value.slice(1).toLowerCase();
      const matches = commandList.filter(cmd => cmd.toLowerCase().startsWith(query));
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
      item.setAttribute('data-cmd', cmd);
      
      const cmdSpan = document.createElement('span');
      cmdSpan.textContent = cmd;
      
      const descSpan = document.createElement('span');
      descSpan.className = 'cmd-desc';
      descSpan.textContent = commands[cmd].description;
      
      item.appendChild(cmdSpan);
      item.appendChild(descSpan);
      
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
    activeSuggestionIndex = -1;
  }

  function updateSuggestionHighlight() {
    [...suggestionBox.children].forEach((child, index) => {
      if (index === activeSuggestionIndex) {
        child.classList.add('active');
        child.scrollIntoView({ block: 'nearest' });
      } else {
        child.classList.remove('active');
      }
    });
  }

  // UI Controls
  clearBtn.addEventListener('click', () => {
    logDiv.innerHTML = "";
  });

  toggleBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen');
    if (container.classList.contains('fullscreen')) {
      toggleBtn.innerHTML = `${svgIcons.exitFullscreen} Exit Fullscreen`;
      container.style.height = '100vh';
      container.style.width = '100vw';
    } else {
      toggleBtn.innerHTML = `${svgIcons.fullscreen} Fullscreen`;
      container.style.height = '40vh';
      container.style.width = '';
    }
    window.dispatchEvent(new Event('resize'));
  });

  closeBtn.addEventListener('click', () => {
    container.style.display = 'none';
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Toggle console with Right Ctrl
    if (e.key === 'Control' && e.location === 2) {
      container.style.display = container.style.display === 'none' ? 'flex' : 'none';
      if (container.style.display !== 'none') {
        input.focus();
      }
      e.preventDefault();
    }
    
    // Clear console with Ctrl+L
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      logDiv.innerHTML = "";
      e.preventDefault();
    }
    
    // Toggle fullscreen with F11
    if (e.key === 'F11') {
      container.classList.toggle('fullscreen');
      if (container.classList.contains('fullscreen')) {
        toggleBtn.innerHTML = `${svgIcons.exitFullscreen} Exit Fullscreen`;
        container.style.height = '100vh';
        container.style.width = '100vw';
      } else {
        toggleBtn.innerHTML = `${svgIcons.fullscreen} Fullscreen`;
        container.style.height = '40vh';
        container.style.width = '';
      }
      e.preventDefault();
    }
  });

  // Welcome message
  logger.system('ZBOT initialized');
  logger.system('Type /help for available commands');
  logger.system('Press Right Ctrl to toggle console, F11 for fullscreen');
})();
