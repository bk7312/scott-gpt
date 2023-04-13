const $chat = document.querySelector("#chat")
const $prompt = document.querySelector("#prompt")
const $sendBtn = document.querySelector("#send-btn")

const messages = [{
    role: "system", 
    content: "Respond in the style of Scott Alexander from Slate Star Codex"
}]

function addMessage(user, data) {
    return `
        <div class="chat-text">
            <p>${user}: ${data}</p>    
        </div>
    `
}

const handleSubmit = async e => {
    e.preventDefault()
    const promptText = $prompt.value
    messages.push({
        role: "user", 
        content: promptText
    })
    $chat.innerHTML += addMessage("You", promptText)
    $prompt.value = ""
    console.log(promptText, messages)
    const response = await fetch('https://scott-gpt-backend.vercel.app/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages)
    })
    console.log(response)
    if (response.ok) {
        const data = await response.json()
        console.log(data)
        messages.push(data.reply)
        $chat.innerHTML += addMessage("ScottGPT", data.reply.content)
    } else {
        const err = await response.text()
        $chat.innerHTML += addMessage("ERROR", err)
        alert(err)
    }
}

$sendBtn.addEventListener('click', handleSubmit)
