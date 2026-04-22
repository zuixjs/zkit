import('{{ app.zkit.libraryPath }}controllers/mdl-button.module.js');

class AiChat extends ControllerInstance {
  state = {
    messages:[],
    systemPrompt: '',
    currentWidget: {html: '', css: '', js: ''},
    isLoading: false
  };

  markedLib = null;

  onInit() {
    // Load 'marked' library from local assets folder
    zuix.using('script', 'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.js', () => {
      this.markedLib = window.marked;
    });
    zuix.using('style', 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap', null, this.context);
    zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css', null, this.context);
  }

  onCreate() {
    const self = this;

    // 1. Declare logic for the view directives
    const viewContext = {
      sendMessage: () => self.handleSendMessage(),
      isLoading: () => self.state.isLoading,
      isChatEmpty: () => self.state.messages.length === 0,
      clearChat: () => {
        if (self.state.messages.length > 0) {
          this.field('chat_history').html('');
          self.state.messages = [];
          self.refreshUI();
        }
      }
    }; 
    this.declare(viewContext);
    this.expose('setCurrentWidget', (widget) => {
      this.state.currentWidget = widget;
    });

    // 2. Load system instructions
    this.loadSystemPrompt();

    // 3. Add keyboard listener for Enter key in textarea (Shift+Enter to newline)
    this.field('user_input').on('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        self.handleSendMessage();
      }
    });

    // 4. Initial UI render
    this.refreshUI();
    setTimeout(() => {
      this.field('chat_history').get().scrollTop = 0;
    }, 100);
  }

  onDispose() {
    // Clear listeners/timers if necessary
  }

  loadSystemPrompt() {
    fetch('{{ app.zkit.libraryPath }}/components/ai-chat/ai-instructions.md')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(text => {
        this.state.systemPrompt = text;
        this.log.info('System instructions loaded successfully.');
      })
      .catch(error => {
        this.log.error('Failed to load system instructions', error);
        this.state.systemPrompt = 'You are a helpful coding assistant.';
      });
  }

  handleSendMessage() {
    if (this.state.isLoading) return;

    const apiKeyInput = this.field('api_key').get();
    const modelSelect = this.field('model_select').get();
    const messageInput = this.field('user_input').get();

    const apiKey = apiKeyInput.value.trim();
    const selectedModel = modelSelect.value;
    const userMessage = messageInput.value.trim();

    if (!apiKey) {
      alert('Please enter a valid Gemini API Key.');
      return;
    }

    if (!userMessage) return;

    // Clear textarea
    messageInput.value = '';

    // Store user message and set loading state
    this.state.messages.push({ role: 'user', content: userMessage });
    this.state.isLoading = true;
    this.refreshUI();

    // Call API with the selected model
    this.fetchGeminiResponse(apiKey, selectedModel);
  }

  fetchGeminiResponse(apiKey, modelId) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    const formattedHistory = this.state.messages.map(msg => ({
      role: msg.role === 'ai' || msg.role === 'error' ? 'model' : 'user',
      parts:[{ text: msg.content }]
    })).filter(msg => msg.role !== 'error'); // Exclude past error messages from the payload context

    // --- APPEND WIDGET CONTEXT TO SYSTEM PROMPT ---
    let dynamicSystemPrompt = this.state.systemPrompt;
    const { html, css, js } = this.state.currentWidget;

    // If the current widget has any code, inject it into the system instructions
    if (html || css || js) {
      dynamicSystemPrompt += `\n\n### CURRENT WIDGET CONTEXT ###\n`;
      dynamicSystemPrompt += `Below is the code of the widget the user is currently editing.\n`;
      dynamicSystemPrompt += `Use this context to answer requests, suggest corrections, or implement additional features.\n\n`;

      if (html) dynamicSystemPrompt += `**HTML:**\n\`\`\`html\n${html}\n\`\`\`\n\n`;
      if (css)  dynamicSystemPrompt += `**CSS:**\n\`\`\`css\n${css}\n\`\`\`\n\n`;
      if (js)   dynamicSystemPrompt += `**JavaScript:**\n\`\`\`javascript\n${js}\n\`\`\`\n\n`;
    }
    // ----------------------------------------------

    const payload = {
      system_instruction: {
        parts: { text: dynamicSystemPrompt }
      },
      contents: formattedHistory
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        this.state.isLoading = false;

        if (data.error) {
          this.state.messages.push({ role: 'error', content: `API Error (${modelId}): ${data.error.message}` });
        } else if (data.candidates && data.candidates.length > 0) {
          let responseText = data.candidates[0].content.parts[0].text;
          responseText = this.parseAndTriggerCode(responseText);
          responseText = this.markedLib?.parse(responseText);
          this.state.messages.push({ role: 'ai', content: responseText });
        } else {
          this.state.messages.push({ role: 'error', content: 'No content returned from AI.' });
        }

        this.refreshUI();
      })
      .catch(error => {
        this.state.isLoading = false;
        this.state.messages.push({ role: 'error', content: `Network Error: ${error.message}` });
        this.refreshUI();
      });
  }

  refreshUI() {
    const historyContainer = this.field('chat_history');
    let htmlContent = '';

    // Build the chat DOM string based on current state
    this.state.messages.forEach(msg => {
      let bubbleClass = 'msg-ai';
      if (msg.role === 'user') bubbleClass = 'msg-user';
      if (msg.role === 'error') bubbleClass = 'msg-error';

      const safeText = msg.content;
        //.replace(/&/g, "&amp;")
        //.replace(/</g, "&lt;")
        //.replace(/>/g, "&gt;");

      htmlContent += `<div class="message ${bubbleClass}">${safeText}</div>`;
    });

    if (htmlContent.length > 0) historyContainer.html(htmlContent);

    // Auto-scroll
    const rawContainer = historyContainer.get();
    if (rawContainer) {
      setTimeout(() => {
        rawContainer.scrollTop = rawContainer.scrollHeight;
      }, 50);
    }

    //this.update();
  }

  parseAndTriggerCode(markdownText) {
    const extractBlock = (lang) => {
      const regex = new RegExp(`\`\`\`${lang}\\s*\\n([\\s\\S]*?)\`\`\``, 'gi');
      const match = markdownText.match(regex);
      return match ? match[0] : null; // Restituisce l'intero blocco (inclusi i backticks)
    };

    const htmlBlock = extractBlock('html');
    const cssBlock = extractBlock('css');
    const jsBlock = extractBlock('(?:javascript|js)');

    // Prepariamo il testo pulito sostituendo i blocchi trovati con i placeholder
    let processedText = markdownText;
    const data = { html: '', css: '', js: '' };

    if (htmlBlock) {
      data.html = htmlBlock.replace(/```html\s*\n([\s\S]*?)\n```/i, '$1').trim();
      processedText = processedText.replace(htmlBlock, '[HTML]');
    }

    if (cssBlock) {
      data.css = cssBlock.replace(/```css\s*\n([\s\S]*?)\n```/i, '$1').trim();
      processedText = processedText.replace(cssBlock, '[CSS]');
    }

    if (jsBlock) {
      data.js = jsBlock.replace(/```(?:javascript|js)\s*\n([\s\S]*?)\n```/i, '$1').trim();
      processedText = processedText.replace(jsBlock, '[JS]');
    }

    if (data.html || data.css || data.js) {
      this.trigger('widget:update', data);
      this.log.info('Extracted code sent via "widget-update" event.');
    } else {
      this.log.warn('No valid code block found in message.');
    }

    return processedText;
  }
}
