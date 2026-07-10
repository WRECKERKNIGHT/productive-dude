# PRODUCTIVEDUDE - App Bundling & Build Guide

This document outlines the step-by-step instructions to compile and build **PRODUCTIVEDUDE** into standalone applications:
- **macOS app (`.dmg`)**
- **Windows app (`.exe`)**
- **Android package (`.apk`)**

---

## 🛠️ Prerequisites

Before compiling, make sure you have the following installed on your host system:

1. **Node.js & npm** (Already installed: Node `v24.17.0`, npm `11.13.0`)
2. **For macOS Bundle (`.dmg`)**:
   - macOS computer (required for dmg packaging)
   - **Xcode Command Line Tools**: Install by running `xcode-select --install` in your terminal
3. **For Windows Bundle (`.exe`)**:
   - Windows machine, OR macOS running **Wine** to cross-compile (e.g., `brew install --cask wine-stable`)
4. **For Android Package (`.apk`)**:
   - **Java Development Kit (JDK) 17** (Verify with `java -version`)
   - **Android Studio & Android SDK**: (Required to run the gradle compiler)

---

## 💻 1. Desktop Executables (macOS `.dmg` / Windows `.exe`)

PRODUCTIVEDUDE uses **Electron** and **electron-builder** to package desktop distributions.

### A. Run and Test Desktop locally (Development Mode)
To launch the desktop application in a live development window:
```bash
npm run electron:dev
```

### B. Compile macOS standalone (`.dmg`)
> [!NOTE]
> This command must be executed on a macOS system.
To generate a DMG installer package:
```bash
npm run electron:build -- --mac
```
The compiled `.dmg` will be saved inside the `dist-electron/` folder.

### C. Compile Windows standalone (`.exe`)
To generate a portable executable installer package:
```bash
# If on Windows:
npm run electron:build -- --win

# If on macOS (requires Wine installed):
npm run electron:build -- --win --x64
```
The compiled installer `.exe` will be saved inside the `dist-electron/` folder.

---

## 📱 2. Android Application Package (`.apk`)

PRODUCTIVEDUDE uses **Capacitor** to bridge the React app to a native Android project environment.

### A. Initialize the Android workspace
Run this command once to register the Capacitor mobile environment and generate the native Android project folder (`android/`):
```bash
npm run mobile:init
```

### B. Compile and Sync web assets
Each time you make changes to the React source files, recompile the web bundle and sync it into the Android assets directory:
```bash
npm run mobile:sync
```

### C. Build the APK inside Android Studio
Once synced, open the project inside Android Studio:
```bash
npm run mobile:open
```
Inside Android Studio:
1. Wait for Gradle to finish indexing.
2. Go to **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. Once completed, a notification bubble will show "APK(s) generated successfully". Click **Locate** to find the `app-debug.apk` file.
4. Install this `.apk` directly onto any Android phone!
