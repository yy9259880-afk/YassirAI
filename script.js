const btn = document.getElementById("startBtn");
const chat = document.getElementById("chat");
const result = document.getElementById("result");
const status = document.getElementById("status");
const mouth = document.getElementById("mouth");

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("المتصفح لا يدعم التعرف على الصوت.");
}

const recognition = new SpeechRecognition();

recognition.lang = "ar-MA";
recognition.interimResults = false;
recognition.continuous = false;

btn.addEventListener("click", () => {

    status.innerHTML = "🎤 أستمع إليك...";
    btn.disabled = true;

    recognition.start();

});

recognition.onresult = async (event) => {

    const text = event.results[0][0].transcript;

    result.innerHTML += `
        <br><br>
        <b>🧑 أنت:</b><br>
        ${text}
    `;

    status.innerHTML = "🤖 أفكر...";

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: text
            })

        });

        const data = await response.json();

        result.innerHTML += `
            <br><br>
            <b>🤖 YassirAI:</b><br>
            ${data.reply}
        `;

        chat.scrollTop = chat.scrollHeight;

        const speech = new SpeechSynthesisUtterance(data.reply);

        speech.lang = "ar";

        speech.rate = 1;

        speech.pitch = 1;

        speech.onstart = () => {

            status.innerHTML = "🗣️ أتحدث...";

            let open = false;

            mouth.timer = setInterval(() => {

                mouth.style.height = open ? "10px" : "25px";

                open = !open;

            },150);

        };

        speech.onend = () => {

            clearInterval(mouth.timer);

            mouth.style.height = "10px";

            status.innerHTML = "✅ انتهيت.";

            btn.disabled = false;

        };

        speechSynthesis.speak(speech);

    } catch (err) {

        console.error(err);

        result.innerHTML += `
            <br><br>
            ❌ حدث خطأ في الاتصال بالخادم.
        `;

        status.innerHTML = "خطأ";

        btn.disabled = false;

    }

};

recognition.onerror = () => {

    status.innerHTML = "❌ لم أسمع شيئاً.";

    btn.disabled = false;

};