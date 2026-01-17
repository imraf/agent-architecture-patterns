function showMainTab(tabId) {
    document.querySelectorAll('.main-tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const contentDiv = document.getElementById(tabId) || createTabContainer(tabId);
    
    contentDiv.style.display = 'block';
    setTimeout(() => contentDiv.classList.add('active'), 10);

    const navMap = {
        'intro': 0,
        'sequential': 1,
        'concurrent': 2,
        'groupchat': 3,
        'handoff': 4,
        'magentic': 5,
        'advanced': 6
    };
    const navIndex = navMap[tabId];
    if (navIndex !== undefined) {
        document.querySelectorAll('.nav-item')[navIndex].classList.add('active');
    }

    window.scrollTo(0, 0);
    if(window.hljs) hljs.highlightAll();
}

function createTabContainer(tabId) {
    let container = document.getElementById(tabId);
    if (!container) {
        container = document.createElement('div');
        container.id = tabId;
        container.className = 'main-tab-content';
        document.querySelector('main').appendChild(container);
    }
    
    const data = patternData[tabId];
    if (!data) return container;

    if (data.content) {
        container.innerHTML = data.content;
    } else {
        container.innerHTML = `
            <h1>${data.title}</h1>
            <p class="lead">${data.description}</p>
            
            <div class="analogy-box">
                <div class="analogy-title">${data.analogy.title}</div>
                <p>${data.analogy.text}</p>
            </div>

            <div class="example-tabs">
                ${data.examples.map((ex, index) => `
                    <button class="example-tab-btn ${index === 0 ? 'active' : ''}" 
                            data-target="${tabId}-ex${index}"
                            onclick="handleExampleClick(this)">
                        ${ex.title}
                    </button>
                `).join('')}
            </div>

            ${data.examples.map((ex, index) => `
                <div id="${tabId}-ex${index}" class="example-content ${index === 0 ? 'active' : ''}">
                    <div class="example-goal">
                        ${ex.intro}
                    </div>
                    
                    ${ex.steps.map((step, i) => `
                        <div class="step">
                            <div class="step-number">${i + 1}</div>
                            <div class="step-content">
                                <h3>${step.title}</h3>
                                <p>${step.text}</p>
                            </div>
                        </div>
                    `).join('')}

                    <div class="implementation-section">
                        <div class="implementation-header">
                            <h2>Implementation Guide</h2>
                            <div class="framework-tabs">
                                <button class="framework-btn active sk" onclick="switchFramework('${tabId}-ex${index}', 'sk', this)">Semantic Kernel</button>
                                <button class="framework-btn crew" onclick="switchFramework('${tabId}-ex${index}', 'crew', this)">CrewAI</button>
                            </div>
                        </div>

                        ${ex.implementations.map(impl => `
                            <div class="implementation ${impl.id === 'sk' ? 'active' : ''}" data-impl="${impl.id}">
                                <div class="install-card">
                                    <span class="install-label">Environment Setup</span>
                                    <span class="install-cmd">${impl.install}</span>
                                </div>
                                <details class="full-code" open>
                                    <summary>
                                        <span>${impl.name} Script</span>
                                        <button class="copy-btn" onclick="copyCode(event, this)">Copy Code</button>
                                    </summary>
                                    <pre><code class="language-python">${escapeHtml(impl.code)}</code></pre>
                                </details>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    }
    return container;
}

function handleExampleClick(btn) {
    const targetId = btn.getAttribute('data-target');
    const container = btn.parentElement.parentElement;
    
    container.querySelectorAll('.example-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    container.querySelectorAll('.example-content').forEach(div => div.classList.remove('active'));
    const targetDiv = document.getElementById(targetId);
    if(targetDiv) {
        targetDiv.classList.add('active');
        if(window.hljs) {
            targetDiv.querySelectorAll('pre code').forEach(block => {
                hljs.highlightElement(block);
            });
        }
    }
}

function switchFramework(exampleContentId, implId, btn) {
    const container = document.getElementById(exampleContentId);
    if(!container) return;

    const btnContainer = btn.parentElement;
    btnContainer.querySelectorAll('.framework-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    container.querySelectorAll('.implementation').forEach(div => {
        if(div.getAttribute('data-impl') === implId) {
            div.classList.add('active');
        } else {
            div.classList.remove('active');
        }
    });
}

function copyCode(event, btn) {
    event.preventDefault();
    event.stopPropagation();

    const pre = btn.closest('details').querySelector('pre');
    const code = pre.textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2000);
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', () => {
    showMainTab('intro');
});