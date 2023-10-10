const $chat = document.querySelector("#chat")
const $prompt = document.querySelector("#prompt")
const $sendBtn = document.querySelector("#send-btn")
const $typing = document.querySelector("#typing")
const $clear = document.querySelector("#clear")
const $blockModal = document.querySelector("#block-modal")

const system = [{
    role: "system",
    content: "You are Scott, a Singaporean, reply in Singlish. If you don't know how to respond, make a joke about it."
}]

let messages = [...system]

function addMessage(user, data) {
    $chat.innerHTML += `
        <div class="chat-text">
            <p>${user}: ${data}</p>    
        </div>
    `
    $chat.scrollTop = $chat.scrollHeight - $chat.clientHeight
}

let isWaiting = false
let typingAnimation

// // JS for disabling ScottGPT
// setTimeout(() => $blockModal.showModal(), 1000)
// $prompt.disabled = true
// $sendBtn.disabled = true

function waiting(bool) {
    $prompt.disabled = bool
    $sendBtn.disabled = bool
    isWaiting = bool
    isTyping(bool)
}

function isTyping(bool) {
    if (!bool) {
        $typing.textContent = ""
        clearInterval(typingAnimation)
    } else {
        $typing.textContent = "ScottGPT is typing."
        typingAnimation = setInterval(() => {
            $typing.textContent += '.'
            if ($typing.textContent === 'ScottGPT is typing....') {
                $typing.textContent = 'ScottGPT is typing.'
            }
        }, 800)
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
    addMessage("You", promptText)
    $prompt.value = ""

    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages)
        })
        console.log('fetchresp', response)

        if (!response.ok) {
            const err = await response.text()
            throw new Error(err)
        }

        // const reader = response.body.getReader()
        // const decoder = new TextDecoder('utf-8')
        // let reply = ''
        // while (true) {
        //     const { value, done } = await reader.read()
        //     if (done) break
        //     const decodedValue = decoder.decode(value)
        //     console.log({ value, decodedValue })
        //     reply += decodedValue
        // }
        const reply = await response.json()
        console.log(reply)
        messages.push(reply)
        addMessage("ScottGPT", reply.content)
        waiting(false)
        $prompt.focus({ preventScroll: true })

    } catch (error) {
        addMessage("SYSTEM", error)
    }
}

function clearData() {
    if (isWaiting) return
    messages = [...system]
    $chat.innerHTML = ""
}

$clear.addEventListener('click', clearData)
$sendBtn.addEventListener('click', handleSubmit)
$prompt.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        handleSubmit()
    }
})
