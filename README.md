![MITR System Architecture](./structure.jpeg)

# 🚨 MITR SOS Device – Complete Emergency Alert System

**Mitr** is a compact, AI-powered emergency alert system designed to detect distress either automatically or manually, and notify trusted contacts with a live tracking link via SMS. This link opens a web dashboard that displays the victim’s real-time location.

> This system works fully independently from the victim’s smartphone and leverages a microcontroller + GSM/GPS module. The frontend website serves as the core interface for real-time monitoring.

---

## 📦 Project Structure

```
Complete-Mitr/
├── embedded/ # ESP32 + A7670C code (TinyML + GSM + GPS + Bluetooth)
│ └── MitrSOSDevice.ino
│
├── backend/ # Node.js + Express REST API for GPS logging and reset
│ ├── controllers/ # Handles routes logic (auth, device, emergency contacts)
│ ├── models/ # MongoDB schemas for Devices, Contacts, Triggers
│ ├── routes/ # RESTful endpoints
│ ├── middleware/ # Role, Auth, Rate-limit middlewares
│ ├── utils/ # Utilities (email, token, etc.)
│ └── server.js # Entry point
│
├── frontend/ # React App (Vite + TailwindCSS)
│ ├── src/
│ │ ├── pages/ # /track, /reset, /admin
│ │ ├── components/ # Reusable UI parts
│ │ └── assets/ # Logos, styles, etc.
│ └── public/
│
├── structure.jpeg # MITR architecture diagram
└── README.md # You are here 🚀
```

---

## 💡 Key Features

### 🎯 Embedded Hardware (ESP32 + A7670C)
- 🤖 **AI Scream Detection** (TinyML on-device model)
- 🔘 **Manual Button Trigger** for instant SOS
- 🌐 **GSM + GPS (A7670C)**:
  - Gets real-time GPS coordinates
  - Sends HTTP POST to cloud server (Render)
  - SMS is sent via GSM with tracking website link
- 📲 **Bluetooth Configuration**:
  - Add/edit contacts
  - Adjust AI sensitivity
  - Change trigger keyword
- 🧠 **Offline Buffering**:
  - If no internet: coordinates stored locally with timestamp
  - Auto-upload once GSM internet is back
- 🛑 **Post-SOS Lock**:
  - Device stops functioning until user resets from app or website

### 🌍 Web Dashboard (React.js)
- 📍 **Live Tracking Page** – `/track?id=DEVICE_ID`
- 🔐 **Admin Reset Page** – Secure reset interface for each device
- 🕓 **Timestamped Logs** – Display past SOS alerts with locations

---

## 🔧 Technologies Used

| Layer        | Tech Stack                              |
|--------------|-----------------------------------------|
| Device       | ESP32-S3, A7670C, Arduino, TinyML       |
| AI Model     | TensorFlow Lite for Microcontrollers    |
| Backend      | Node.js, Express.js, MongoDB            |
| Frontend     | React.js, Vite, TailwindCSS             |
| Hosting      | Render (API) + Vercel (Frontend)        |

---

## 🔐 Security & Privacy

- ⚠️ Emergency contacts and settings stored only on-device
- 🔒 All communication to backend uses secure HTTP with API key
- 🚫 No third-party tracking – only authorized contacts can access link

---

## 🔄 Workflow

1. Device detects a scream or button press
2. GPS coordinates are captured
3. Data is sent to `https://mitr-new-api.onrender.com/api/location`
4. Tracking link like `https://mitr-location.vercel.app/track?id=MITR001` is sent to emergency contacts via SMS
5. Contacts can follow victim’s location live until reset
6. Reset can be done via app or website admin panel

---

## 🔁 Offline Recovery

- If mobile data (GPRS) is unavailable:
  - Device stores all GPS data + timestamp in local memory
  - When internet is restored, all logs are pushed to the server in order

---

## 🧩 Future Additions

- 🎙️ Voice trigger word detection
- 🧠 Emotion classification in audio
- 🔋 Battery monitoring via Bluetooth
- 📱 Android app for contact management & quick pairing


---

## 🌐 Live Links

- 🌍 **Live Map (Frontend)**: [mitr-location.vercel.app](https://mitr-beta.vercel.app/)
- ⚙️ **API (Backend)**: [mitr-new-api.onrender.com](https://mitr-new-api.onrender.com/)
- 📦 **Embedded Repo**: `embedded/MitrSOSDevice.ino`
