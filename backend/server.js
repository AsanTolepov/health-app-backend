// backend/server.js
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';

const app = express();

// CORS ruxsatlari (Frontend backendga ulanishi uchun)
app.use(cors());

// --- YANGI QO'SHILGAN QISM ---
// Bu qism brauzerda saytni ochganingizda "Cannot GET /" xatosi chiqmasligi uchun.
app.get('/', (req, res) => {
    res.send("Health App Backend Serveri muvaffaqiyatli ishlamoqda! Socket.io tayyor.");
});
// -----------------------------

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // "*" hozircha hamma joydan kirishga ruxsat beradi (Frontend Vercel yoki Netlifyda bo'lsa ham ishlaydi)
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    // 1. Foydalanuvchi ulanganda uning ID sini o'ziga qaytaramiz (Video qo'ng'iroq uchun kerak)
    socket.emit("me", socket.id);

    // 2. Chat xonalariga ulanish
    socket.on('join_chat', (chatRoomId) => {
        socket.join(chatRoomId);
        console.log(`User joined room: ${chatRoomId}`);
    });

    // 3. Xabar yuborish
    socket.on('send_message', (data) => {
        // Xabarni faqat shu xonadagi boshqa odamga yuborish
        socket.to(data.chatRoomId).emit('receive_message', data);
    });

    // 4. Video qo'ng'iroq: Qo'ng'iroq qilish
    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callUser", { 
            signal: data.signalData, 
            from: data.from, 
            name: data.name 
        });
    });

    // 5. Video qo'ng'iroq: Qo'ng'iroqni qabul qilish
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    // 6. Foydalanuvchi chiqib ketganda
    socket.on('disconnect', () => {
        socket.broadcast.emit("callEnded");
        console.log("User disconnected");
    });
});

// Serverni ishga tushirish
// Render avtomatik ravishda process.env.PORT ni beradi (odatda 10000)
const PORT = process.env.PORT || 3001; 

server.listen(PORT, () => {
  console.log(`SERVER ${PORT}-portda ishlamoqda`);
});