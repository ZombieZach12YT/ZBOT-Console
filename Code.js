(function createCustomConsole() {
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
    #customConsole.hidden {
      transform: translateY(100%);
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
    #customConsoleLog::-webkit-scrollbar-track,
    #commandSuggestions::-webkit-scrollbar-track {
      background: transparent;
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

  // --- Elements
  const container = document.createElement('div');
  container.id = 'customConsole';

  const header = document.createElement('div');
  header.id = 'customConsoleHeader';

  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'fullscreenToggle';
  toggleBtn.textContent = 'Fullscreen';

  header.appendChild(toggleBtn);
  container.appendChild(header);

  const logDiv = document.createElement('div');
  logDiv.id = 'customConsoleLog';

  const inputContainer = document.createElement('div');
  inputContainer.id = 'customConsoleInput';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Type JavaScript or /clear...';

  const suggestionBox = document.createElement('div');
  suggestionBox.id = 'commandSuggestions';
  suggestionBox.style.display = 'none';

  inputContainer.appendChild(input);
  inputContainer.appendChild(suggestionBox);
  container.appendChild(logDiv);
  container.appendChild(inputContainer);
  document.body.appendChild(container);

  // --- Logging
  function log(message, isError = false) {
    const line = document.createElement('p');
    line.textContent = message;
    line.style.color = isError ? '#f44336' : '#90caf9';
    logDiv.appendChild(line);
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // --- Commands
  const commands = {
    clear: () => {
      logDiv.innerHTML = "";
    }
  };

  const commandList = Object.keys(commands);
  let activeSuggestionIndex = -1;

  // --- Input handler
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
    if (matches.length === 0) {
      hideSuggestions();
      return;
    }

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
    activeSuggestionIndex = -1;
  }

  function updateSuggestionHighlight() {
    [...suggestionBox.children].forEach((el, i) => {
      el.classList.toggle('active', i === activeSuggestionIndex);
    });
  }

  // --- Hook console.log
  console._log = console.log;
  console.log = (...args) => {
    args.forEach(arg => log(arg));
    console._log.apply(console, args);
  };

  // --- Right Ctrl toggles console
  let isVisible = true;
  document.addEventListener('keydown', (e) => {
    if (e.code === 'ControlRight') {
      isVisible = !isVisible;
      container.classList.toggle('hidden', !isVisible);
    }
  });

  // --- Fullscreen toggle
  let isFull = false;
  toggleBtn.addEventListener('click', () => {
    isFull = !isFull;
    container.classList.toggle('fullscreen', isFull);
    toggleBtn.textContent = isFull ? 'Exit Fullscreen' : 'Fullscreen';
  });

  log('🛠️ Custom console ready. Press Right Ctrl to toggle visibility.');
})();
