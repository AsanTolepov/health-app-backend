// src/pages/user/chat.tsx
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import "animate.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const Chat: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text:
        "Salom! Men Sog‘liqni Tahlil Qilish botiman. Alomatlaringizni yozing (masalan: 'Ko‘krak og‘riqi, 30, erkak', 'chest pain' yoki 'боль в груди').",
      sender: "bot",
    },
  ]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ovoz o‘qish uchun global state
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // 🔊 Matnni ovozda o‘qish (UZ offline, ravonlashtirilgan, EN va RU default)
  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Brauzeringiz speechSynthesis-ni qo‘llab-quvvatlamaydi");
      return;
    }

    // Agar hozir o‘qilayotgan bo‘lsa → STOP
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setCurrentUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    let lang = "uz-UZ";
    if (/[a-zA-Z]/.test(text)) lang = "en-US";
    if (/[а-яА-Я]/.test(text)) lang = "ru-RU";

    utterance.lang = lang;
    utterance.rate = 0.9; // Biroz sekinroq va ravonroq
    utterance.pitch = 1;

    // O‘zbekcha matnni ravonlashtirish
    if (lang === "uz-UZ") {
      utterance.text = text
        .replace(/o'/gi, "oʻ")
        .replace(/g'/gi, "gʻ")
        .replace(/sh/gi, "ш")
        .replace(/ch/gi, "ч")
        .replace(/ng/gi, "нг")
        .replace(/ts/gi, "тс");
      const voices = speechSynthesis.getVoices();
      const uzbekVoice = voices.find((v) => v.lang === "uz-UZ" || v.lang === "uz");
      if (uzbekVoice) utterance.voice = uzbekVoice; // Eng yaxshi o‘zbekcha ovoz
    }

    // O‘qish tugagandan keyin statusni tozalash
    utterance.onend = () => setCurrentUtterance(null);

    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (!input.trim() || sending) return;
    setSending(true);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");

    // Demo bot javobi
    setTimeout(() => {
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Rahmat! Tez orada javob beraman!",
      };
      setMessages((prev) => [...prev, botReply]);
      speakText(botReply.text); // Avtomatik ovoz bilan o‘qish
    }, 800);

    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col p-4">
      {/* Chat Header - Fixed va sticky */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50 shadow-lg">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Icon icon="lucide:bot" className="text-4xl" /> AI Health Assistant
        </h2>
        <button
          onClick={() => window.history.back()}
          className="text-white hover:text-gray-200 transition duration-300"
        >
          <Icon icon="lucide:x" className="text-2xl" />
        </button>
      </div>

      {/* Chat Content - Headerdan pastga offset qo'shish */}
      <div className="flex-1 pt-24 pb-6 bg-white rounded-3xl shadow-2xl overflow-hidden mt-2 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4 chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } items-start`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white animate__animated animate__fadeInRight"
                    : "bg-teal-100 text-gray-800 animate__animated animate__fadeInLeft"
                } shadow-lg flex items-start gap-2`}
              >
                <p className="text-lg break-words">{msg.text}</p>

                {/* 🔊 Bot javobi uchun ovoz tugmasi */}
                {msg.sender === "bot" && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="text-teal-600 hover:text-teal-800 transition duration-300"
                  >
                    <Icon
                      icon={
                        window.speechSynthesis.speaking
                          ? "lucide:stop-circle"
                          : "lucide:volume-2"
                      }
                      className="text-2xl"
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Alomatlaringizni yozing (uz/en/ru)..."
            className="flex-1 border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-lg shadow-md"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center shadow-md w-14 h-14"
          >
            <Icon icon="lucide:send" className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;