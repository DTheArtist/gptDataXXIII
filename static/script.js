
async function loadJsonData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

async function initialize() {
    const jsonData = await loadJsonData('/static/conversations.json'); // Replace with the correct path
    populateConversations(jsonData); // Call function to populate conversations
}

function populateConversations(jsonData) {
    var root = document.getElementById("root");
    for (var i = 0; i < jsonData.length; i++) {
        var conversation = jsonData[i];
        var messages = getConversationMessages(conversation);
        var div = document.createElement("div");
        div.className = "conversation";
        var title = document.createElement("h4");
        title.innerHTML = conversation.title;
        title.onclick = toggleMessages; // Add click event to toggle visibility
        div.appendChild(title);
        addCopyAllButton(div); // Add Copy All button
        for (var j = 0; j < messages.length; j++) {
            var message = document.createElement("pre");
            message.className = "message hidden"; // Initially hide messages
            message.id = "message-" + i + "-" + j; // Unique ID for each message part of the search function
            message.innerHTML = `<div class="author">${messages[j].author}</div><div>${messages[j].text}</div>`;
            addCopyButton(message, messages[j].text);
            div.appendChild(message);
        }
        root.appendChild(div);
    }
};

window.onload = initialize;


function getConversationMessages(conversation) {
    var messages = [];
    var currentNode = conversation.current_node;
    while (currentNode != null) {
        var node = conversation.mapping[currentNode];
        if (
            node.message &&
            node.message.content &&
            node.message.content.content_type == "text" &&
            node.message.content.parts.length > 0 &&
            node.message.content.parts[0].length > 0 &&
            (node.message.author.role !== "system" ||
                node.message.metadata.is_user_system_message)
        ) {
            author = node.message.author.role;
            if (author === "assistant") {
                author = "ChatGPT";
            } else if (
                author === "system" &&
                node.message.metadata.is_user_system_message
            ) {
                author = "Custom user info";
            }
            messages.push({
                author,
                text: node.message.content.parts[0],
            });
        }
        currentNode = node.parent;
    }
    return messages.reverse();
}

function toggleMessages(event) {
    var conversationDiv = event.currentTarget.parentNode;
    var messages = conversationDiv.querySelectorAll(".message");
    messages.forEach(function (msg) {
        msg.classList.toggle("hidden");
    });
}
function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
}

function addCopyButton(messageDiv, text) {
    var copyBtn = document.createElement("button");
    copyBtn.innerHTML = "Copy";
    copyBtn.onclick = function () {
        copyToClipboard(text);
    };
    messageDiv.appendChild(copyBtn);
}
function copyAllMessages(conversationDiv) {
    var messages = conversationDiv.querySelectorAll(".message");
    var allText = "";
    messages.forEach(function (msg) {
        allText += msg.textContent + "\n"; // Combine all messages text
    });
    copyToClipboard(allText);
}

function addCopyAllButton(conversationDiv) {
    var copyAllBtn = document.createElement("button");
    copyAllBtn.innerHTML = "Copy All Messages";
    copyAllBtn.onclick = function () {
        copyAllMessages(conversationDiv);
    };
    conversationDiv.insertBefore(
        copyAllBtn,
        conversationDiv.firstChild.nextSibling,
    ); // Insert after the title
}
function searchMessages() {
    var searchTerm = document
        .getElementById("searchInput")
        .value.toLowerCase();
    var conversations = document.querySelectorAll(".conversation");

    conversations.forEach(function (conversation) {
        var messages = conversation.querySelectorAll(".message");
        var matchFound = false;

        messages.forEach(function (msg) {
            var text = msg.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                matchFound = true;
            }
        });

        if (matchFound) {
            conversation.style.display = ""; // Show conversation
        } else {
            conversation.style.display = "none"; // Hide conversation
        }
    });
}


            