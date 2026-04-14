/**
 * SYNAPSE - Code Environment Engine
 * Handles live compilation, debounced execution, and local storage persistence.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Cache DOM Elements
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('js-editor');
    
    const editorsContainer = document.getElementById('editors-container');
    const outputWrapper = document.getElementById('output-wrapper');
    const resizer = document.getElementById('resizer');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    const outputFrame = document.getElementById('output-frame');
    const autoRunToggle = document.getElementById('auto-run-toggle');
    const runBtn = document.getElementById('run-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Core Engine Compiler
    function compileCode() {
        const html = htmlEditor.value;
        const css = cssEditor.value;
        const js = jsEditor.value;
        
        // Construct the document to be rendered
        const frameContent = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>
                        try {
                            ${js}
                        } catch (err) {
                            console.error('Synapse JS Error:', err);
                        }
                        // Important to prevent loop infinite triggers if they write console.log loops etc.
                    <\/script>
                </body>
            </html>
        `;
        
        // Inject into iframe via srcdoc for security & speed 
        outputFrame.srcdoc = frameContent;
        
        // Save to LocalStorage
        saveToLocalStorage();
    }
    
    // Auto-Run Implementation using Debounce
    // This prevents the engine from compiling on every single keystroke.
    let timeout;
    function handleInput() {
        if (autoRunToggle.checked) {
            clearTimeout(timeout);
            timeout = setTimeout(compileCode, 500); // 500ms delay
        }
    }
    
    // Data Persistence using Local Storage
    function saveToLocalStorage() {
        const state = {
            html: htmlEditor.value,
            css: cssEditor.value,
            js: jsEditor.value
        };
        localStorage.setItem('synapse_session', JSON.stringify(state));
    }
    
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('synapse_session');
        if (savedData) {
            const state = JSON.parse(savedData);
            htmlEditor.value = state.html || '';
            cssEditor.value = state.css || '';
            jsEditor.value = state.js || '';
        } else {
            // Keep the default placeholder data visually, but don't force write it.
            // If we wanted to parse default placeholders and treat as values, we could do it here
        }
        
        // Initial compile
        compileCode();
    }

    // Advanced Editing Features (Tab indentation support)
    function handleTabKey(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Set text to include tab (using 2 spaces for standard web format)
            textarea.value = textarea.value.substring(0, start) +
                            "  " + textarea.value.substring(end);

            // Put cursor in right position
            textarea.selectionStart = textarea.selectionEnd = start + 2;
            
            handleInput(); // Trigger compilation if auto-run is on
        }
    }

    // Event Listeners
    htmlEditor.addEventListener('input', handleInput);
    cssEditor.addEventListener('input', handleInput);
    jsEditor.addEventListener('input', handleInput);
    
    htmlEditor.addEventListener('keydown', handleTabKey);
    cssEditor.addEventListener('keydown', handleTabKey);
    jsEditor.addEventListener('keydown', handleTabKey);
    
    runBtn.addEventListener('click', compileCode);
    
    clearBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to clear all code?')) {
            htmlEditor.value = '';
            cssEditor.value = '';
            jsEditor.value = '';
            compileCode();
        }
    });

    // Auto-Run Button visual state toggle
    autoRunToggle.addEventListener('change', () => {
        if (autoRunToggle.checked) {
            runBtn.style.opacity = '0.5';
            runBtn.title = "Auto-run is enabled";
            compileCode(); // Run immediately when turned on
        } else {
            runBtn.style.opacity = '1';
            runBtn.title = "Click to run code";
        }
    });

    // --- Mobile Tabs Logic ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.editor-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetClass = btn.getAttribute('data-target');
            document.querySelector('.' + targetClass).classList.add('active');
        });
    });

    document.querySelector('.html-pane').classList.add('active');

    // --- Resizer Logic ---
    let isResizing = false;

    function startResize() {
        isResizing = true;
        document.body.style.cursor = 'row-resize';
        outputWrapper.style.pointerEvents = 'none';
    }

    function doResize(clientY) {
        if (!isResizing) return;
        const navHeight = 60;
        const tabsEl = document.getElementById('mobile-tabs');
        const mobileTabsHeight = (tabsEl && window.getComputedStyle(tabsEl).display !== 'none') ? tabsEl.offsetHeight : 0;
        
        let topSectionHeight = clientY - navHeight - mobileTabsHeight;
        const minHeight = 60;
        const maxTop = window.innerHeight - navHeight - minHeight;
        
        if (topSectionHeight < minHeight) topSectionHeight = minHeight;
        if (topSectionHeight > maxTop) topSectionHeight = maxTop;
        
        const totalHeight = window.innerHeight - navHeight - mobileTabsHeight;
        const topPercentage = (topSectionHeight / totalHeight) * 100;
        
        editorsContainer.style.flexBasis = `${topPercentage}%`;
        outputWrapper.style.flexBasis = `${100 - topPercentage}%`;
    }

    function stopResize() {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            outputWrapper.style.pointerEvents = '';
        }
    }

    resizer.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', (e) => doResize(e.clientY));
    document.addEventListener('mouseup', stopResize);
    
    resizer.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        startResize();
    }, { passive: false });
    document.addEventListener('touchmove', (e) => {
        if(isResizing && e.touches.length > 0) {
            doResize(e.touches[0].clientY);
        }
    });
    document.addEventListener('touchend', stopResize);
    
    // Initialize App
    loadFromLocalStorage();
    
    // Initial UI Setup for button state
    if (autoRunToggle.checked) {
        runBtn.style.opacity = '0.5';
    }
});
