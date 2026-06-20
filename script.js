const API_URL = "http://127.0.0.1:8000/ask";

const seedMemories = [
    {
        title: "RDS Database Connectivity Issue",
        time: "07:09 pm",
        tags: ["able", "connect", "with"],
        text: "Generating a new solution for your database connectivity issue. RDS connectivity problems typically stem from security groups, subnet configurations, or authentication issues.",
        question: "Why is my RDS not able to connect with the CLI?"
    },
    {
        title: "EC2 Website Not Loading",
        time: "10:42 AM",
        tags: ["ec2", "website", "not loading", "loading"],
        text: "I found a similar issue in my memory. If your EC2 website is not loading, it's usually a security group or network configuration issue.",
        question: "My EC2 website is not loading"
    },
    {
        title: "S3 Access Denied",
        time: "10:51 AM",
        tags: ["s3", "access denied", "access", "denied"],
        text: "I found a matching memory for this issue. The S3 Access Denied error occurs when your AWS user or role does not have permission to access the bucket.",
        question: "S3 Access Denied error"
    },
    {
        title: "IAM Permission Error",
        time: "11:07 AM",
        tags: ["iam", "permission", "error", "policy"],
        text: "Memory match found for IAM Permission Error. IAM Permission Errors occur when a user or service lacks the necessary permissions to perform an action.",
        question: "IAM Permission Error"
    },
    {
        title: "CloudWatch Alarm Not Triggering",
        time: "11:18 AM",
        tags: ["cloudwatch", "alarm", "metric"],
        text: "Check the metric namespace, period, statistic, threshold, and whether the alarm has enough datapoints to evaluate.",
        question: "CloudWatch alarm not triggering"
    },
    {
        title: "Load Balancer Health Check Failed",
        time: "11:32 AM",
        tags: ["elb", "health check", "target"],
        text: "Validate the health check path, target port, security groups, and application response status from the load balancer.",
        question: "Load balancer health check failed"
    }
];

let memories = [...seedMemories];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function currentTime() {
    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function titleFromQuestion(question) {
    const compact = question.trim().replace(/\s+/g, " ");
    if (!compact) {
        return "CloudOps Incident";
    }

    const known = [
        ["rds", "RDS Database Connectivity Issue"],
        ["ec2", "EC2 Website Not Loading"],
        ["s3", "S3 Access Denied"],
        ["iam", "IAM Permission Error"],
        ["cloudwatch", "CloudWatch Alarm Not Triggering"],
        ["load balancer", "Load Balancer Health Check Failed"]
    ];

    const lower = compact.toLowerCase();
    const match = known.find(([keyword]) => lower.includes(keyword));

    if (match) {
        return match[1];
    }

    return compact
        .split(" ")
        .slice(0, 6)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function tagsFromQuestion(question) {
    return question
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .slice(0, 4);
}

function iconDocument() {
    return '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>';
}

function iconChevron() {
    return '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
}

function iconClock() {
    return '<svg viewBox="0 0 24 24"><path d="M12 8v5l3 2"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>';
}

function renderRecentMemories() {
    const list = document.getElementById("recent-memory-list");
    if (!list) {
        return;
    }

    list.innerHTML = memories.slice(0, 5).map((memory) => `
        <div class="recent-memory-item">
            ${iconDocument()}
            <strong>${escapeHtml(memory.title)}</strong>
            <time>${escapeHtml(memory.time)}</time>
        </div>
    `).join("");
}

function renderMemoryGrid(filter = "") {
    const grid = document.getElementById("memory-grid");
    const label = document.getElementById("memory-count-label");
    if (!grid || !label) {
        return;
    }

    const query = filter.trim().toLowerCase();
    const filtered = memories.filter((memory) => {
        const haystack = `${memory.title} ${memory.tags.join(" ")} ${memory.text}`.toLowerCase();
        return haystack.includes(query);
    });

    label.textContent = `${filtered.length} of ${memories.length} memories`;
    grid.innerHTML = filtered.map((memory) => `
        <article class="memory-card">
            <div class="memory-icon">${iconDocument()}</div>
            <div>
                <h3>${escapeHtml(memory.title)}</h3>
                <div class="memory-meta">
                    ${iconClock()}
                    <span>${escapeHtml(memory.time)}</span>
                    <span class="today-pill">Today</span>
                </div>
                <div class="tag-list">
                    ${memory.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
                </div>
            </div>
            <button class="ask-again" data-question="${escapeHtml(memory.question)}">Ask Again</button>
            <button class="expand-button" aria-label="Expand memory">${iconChevron()}</button>
            <p>${escapeHtml(memory.text)}</p>
        </article>
    `).join("");
}

function renderAnalyticsLists() {
    const timeline = document.getElementById("timeline-list");
    const breakdown = document.getElementById("breakdown-list");

    if (timeline) {
        timeline.innerHTML = memories.slice(0, 4).map((memory) => `
            <div class="timeline-item">
                <span class="timeline-dot"></span>
                <span>${escapeHtml(memory.time)}</span>
                <span class="today-pill">Today</span>
                <strong>${escapeHtml(memory.title)}</strong>
            </div>
        `).join("");
    }

    if (breakdown) {
        breakdown.innerHTML = memories.slice(0, 5).map((memory) => `
            <div class="breakdown-item">
                <span>${escapeHtml(memory.title)}</span>
                <time>${escapeHtml(memory.time)}</time>
            </div>
        `).join("");
    }
}

function switchView(viewName) {
    document.querySelectorAll(".view").forEach((view) => {
        view.classList.toggle("active", view.id === `${viewName}-view`);
    });

    document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.view === viewName);
    });
}

function addUserMessage(text) {
    const chatBox = document.getElementById("chat-box");
    chatBox.insertAdjacentHTML("beforeend", `
        <article class="chat-message user-message">
            <p>${escapeHtml(text)}</p>
            <time>${currentTime()}</time>
        </article>
    `);
}

function addBotMessage(answer, source) {
    const chatBox = document.getElementById("chat-box");
    const sourceLabel = source === "memory" ? "Retrieved from Memory" : "Newly Generated";

    chatBox.insertAdjacentHTML("beforeend", `
        <article class="bot-row">
            <div class="bot-avatar">
                <svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.2A3.5 3.5 0 0 0 9.5 18H10a2 2 0 0 0 4 0h.5a3.5 3.5 0 0 0 2.5-5.8A3 3 0 0 0 15 7V6a3 3 0 0 0-3-3Z"/></svg>
            </div>
            <div class="bot-message">
                <span class="source-badge">
                    <svg viewBox="0 0 24 24"><path d="M12 2v5M12 17v5M4.9 4.9l3.5 3.5M15.6 15.6l3.5 3.5M2 12h5M17 12h5M4.9 19.1l3.5-3.5M15.6 8.4l3.5-3.5"/></svg>
                    ${sourceLabel}
                </span>
                <div class="answer-card">
                    <p>${escapeHtml(answer)}</p>
                </div>
            </div>
        </article>
    `);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function addMemory(question, answer, source) {
    memories.unshift({
        title: titleFromQuestion(question),
        time: currentTime(),
        tags: tagsFromQuestion(question),
        text: answer,
        question,
        source
    });

    renderRecentMemories();
    renderMemoryGrid(document.getElementById("memory-search")?.value || "");
    renderAnalyticsLists();
}

async function sendMessage(messageText) {
    const input = document.getElementById("message");
    const button = document.getElementById("send-button");
    const text = (messageText || input.value).trim();

    if (!text) {
        return;
    }

    switchView("assistant");
    addUserMessage(text);
    input.value = "";
    button.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: text
            })
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        const answer = data.answer || "I could not find a response for that issue.";
        const source = data.source || "generated";

        addBotMessage(answer, source);
        addMemory(text, answer, source);
    } catch (error) {
        console.error(error);
        addBotMessage("ERROR: Could not connect to backend.", "generated");
    } finally {
        button.disabled = false;
        input.focus();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".nav-item").forEach((button) => {
        button.addEventListener("click", () => switchView(button.dataset.view));
    });

    document.addEventListener("click", (event) => {
        const questionButton = event.target.closest("[data-question]");
        if (questionButton) {
            sendMessage(questionButton.dataset.question);
        }
    });

    document.getElementById("chat-form").addEventListener("submit", (event) => {
        event.preventDefault();
        sendMessage();
    });

    document.getElementById("memory-search").addEventListener("input", (event) => {
        renderMemoryGrid(event.target.value);
    });

    renderRecentMemories();
    renderMemoryGrid();
    renderAnalyticsLists();
});
