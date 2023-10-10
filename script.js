const $chat = document.querySelector("#chat")
const $prompt = document.querySelector("#prompt")
const $sendBtn = document.querySelector("#send-btn")
const $typing = document.querySelector("#typing")
const $clear = document.querySelector("#clear")
const $blockModal = document.querySelector("#block-modal")

let messages = []
let isWaiting = false
let typingAnimation

// // JS for disabling ScottGPT
// setTimeout(() => $blockModal.showModal(), 1000)
// $prompt.disabled = true
// $sendBtn.disabled = true

function addMessage(user, data = '', id = `m-${messages.length}`) {
    $chat.innerHTML += `
        <div class="chat-text">
            <p id=${id}>${user}: ${data}</p>    
        </div>
    `
    $chat.scrollTop = $chat.scrollHeight - $chat.clientHeight
}

function addStreamingMessage(html, text) {
    html.textContent += text
    $chat.scrollTop = $chat.scrollHeight - $chat.clientHeight
}

function waiting(bool) {
    $prompt.disabled = bool
    $sendBtn.disabled = bool
    isWaiting = bool
}

const handleSubmit = async e => {
    if (isWaiting) return
    waiting(true)
    const promptText = $prompt.value
    addMessage("You", promptText)
    messages.push({
        role: "user",
        content: promptText
    })
    $prompt.value = ""

    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages)
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(err)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let reply = ''
        addMessage("ScottGPT")
        const $id = document.querySelector(`#m-${messages.length}`)
        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            const decodedValue = decoder.decode(value)
            reply += decodedValue
            addStreamingMessage($id, decodedValue)
        }
        messages.push({ role: 'assistant', content: reply })

        // for block reply instead of streaming
        // const reply = await response.json()
        // addMessage("ScottGPT", reply.content)
        // messages.push(reply)

        waiting(false)
        $prompt.focus({ preventScroll: true })

    } catch (error) {
        addMessage("SYSTEM", error)
    }
}

function clearData() {
    if (isWaiting) return
    messages = []
    $chat.innerHTML = ""
}

$clear.addEventListener('click', clearData)
$sendBtn.addEventListener('click', handleSubmit)
$prompt.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        handleSubmit()
    }
})
