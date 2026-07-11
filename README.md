# ⚡ PRODUCTIVEDUDE — Spatial Life OS (V2.0)

PRODUCTIVEDUDE is a premium, spatial productivity dashboard built for hyper-focused minds. Designed with ultra-glassmorphism, shifting radial mesh backgrounds, and smooth spring physics, it allows you to master your syllabus, block your calendar, track consistency cycles, and dump spontaneous thoughts in a frictionless inbox.

---

## ✨ Primary Features

*   **📊 Bento Dashboard & Energy Ring**: A central dashboard featuring SVG momentum trackers that scale and update in real-time as tasks and habits are checked off. Includes a Daily Diary log to record daily accomplishments.
*   **📅 Time-Blocking Timetable**: A 7-day hourly timetable supporting interactive **HTML5 Drag-and-Drop** to schedule pending items into specific slots. Includes a monthly calendar view.
*   **📚 Academic Velocity Hub**: Monitor semester syllabus progress with interactive checklist units. Includes a live ticking exam countdown module and a visual GPA tracking bar chart.
*   **🔄 Habits Consistency Grid & Routines**: Log weekly habits with visual check-grids and manage custom routine sub-checklists.
*   **⚡ Quick Capture Inbox**: A frictionless lightning tray to log quick thoughts, ideas, or sudden reminders on the fly, with options to sort them into formal task categories later.
*   **🎨 Shift Mesh Aesthetic themes**: Choose from Focus Blue, Forest Green, Sunset Orange, Royal Purple, and Sweet Rose. Colors shift dynamically, adjusting neon accent borders and glowing corners.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite) + Tailwind CSS (v4)
*   **Aesthetics**: Glassmorphism backdrop filters + CSS 3D transforms + Spring Keyframes
*   **Desktop Shell**: Electron (CommonJS Controllers)
*   **Mobile Bridge**: Capacitor (Android native Gradle bridge)

---

## 🚀 Getting Started

### 1. Direct Local Open (Zero Dependencies)
For instant portable access without installing node modules or running local web servers:
1. Open the [PRODUCTIVEDUDE_LifeOS.html](file:///Users/wreckerknight/.gemini/antigravity/brain/c21c83a9-b6ce-4cc4-aff1-414dc5a00833/PRODUCTIVEDUDE_LifeOS.html) file.
2. **Double-click the file** to run the complete, styled, and animated application locally in your browser.

### 2. Local Development Server
To start the React environment:
```bash
# Clone the repository
git clone https://github.com/WRECKERKNIGHT/productive-dude-life-os.git
cd productive-dude-life-os

# Install local dependencies
npm install

# Run the local server
npm run dev
```
Open `http://localhost:5173/` in your web browser.

### 3. Compiling Desktop Builds
To package the app as a desktop application:
```bash
# Compile macOS DMG installer package
npm run electron:build -- --mac

# Compile Windows portable binaries
npx electron-builder --win --dir
```

---

## 📂 Standalone Releases

Pre-compiled platform binaries are available for direct execution:
*   **macOS Desktop Installer**: `PRODUCTIVEDUDE-1.0.0.dmg`
*   **Windows Desktop Zip**: `PRODUCTIVEDUDE-win-x64-portable.zip`
*   **Standalone Portable Web App**: `PRODUCTIVEDUDE_LifeOS.html`
