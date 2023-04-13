const $chat = document.querySelector("#chat")
const $prompt = document.querySelector("#prompt")
const $sendBtn = document.querySelector("#send-btn")
const $typing = document.querySelector("#typing")
const $clear = document.querySelector("#clear")
// const $export = document.querySelector("#export")

const system = [{
    role: "system", 
    content: "You are Scott, a Singaporean, reply in Singlish. If you don't know how to respond, make a joke about it."
}]

let messages = [...system]

function addMessage(user, data) {
    return `
        <div class="chat-text">
            <p>${user}: ${data}</p>    
        </div>
    `
}

const url = 'https://scott-gpt.onrender.com/'
let isWaiting = false
let typingAnimation

function waiting(bool) {
    $prompt.disabled = bool
    $sendBtn.disabled = bool
    isWaiting = bool
    isTyping(bool)

}

function isTyping(bool) {
    if (!bool) {
        $typing.classList.add('hidden')
        clearInterval(typingAnimation)
    } else {
        $typing.classList.remove('hidden')
        $typing.textContent = "ScottGPT is typing."
        typingAnimation = setInterval(() => {
            $typing.textContent += '.'
            if ($typing.textContent === 'ScottGPT is typing....') {
                $typing.textContent = 'ScottGPT is typing.'
            }
        }, 1000)
    }
}

const handleSubmit = async e => {
    if (isWaiting) return
    waiting(true)
    const promptText = $prompt.value
    messages.push({
        role: "user", 
        content: promptText
    })
    $chat.innerHTML += addMessage("You", promptText)
    $prompt.value = ""
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages)
    })

    if (response.ok) {
        const data = await response.json()
        messages.push(data.reply)
        $chat.innerHTML += addMessage("ScottGPT", data.reply.content)
        waiting(false)
    } else {
        const err = await response.text()
        $chat.innerHTML += addMessage("ERROR", err)
        alert(err)
    }
}

function clearData() {
    if (isWaiting) return
    messages = [...system]
    $chat.innerHTML = ""
}

// function exportData() {
//     if (isWaiting) return
//     alert("Export chat to be implemented.")
// }

// $export.addEventListener('click', exportData)
$clear.addEventListener('click', clearData)
$sendBtn.addEventListener('click', handleSubmit)
$prompt.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        handleSubmit()
    }
})
