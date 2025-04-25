# React Native To-Do List App

A modern, minimal, and persistent To-Do List app built with React Native and Expo.  
Features a dark theme with orange accents, custom modals, and persistent storage.  
You can add, edit, mark, share, and delete tasks.

## Features

- **Add tasks** with title and description
- **Mark tasks** as complete/incomplete with a checkbox
- **Edit, share, and delete** tasks
- **Custom delete confirmation modal** (see above)
- **Persistent storage** using AsyncStorage
- **Dark/orange modern UI** matching the provided design

---

## Setup Instructions

1. **Clone the repository**

   ```
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Install required packages**

   ```
   npm install @react-navigation/native @react-navigation/native-stack
   npm install @react-native-async-storage/async-storage
   npm install react-native-vector-icons
   npx expo install react-native-screens react-native-safe-area-context
   ```

4. **(Expo only) If you use Expo, install vector icons**
   ```
   npx expo install react-native-vector-icons
   ```

---

## How to Run the App

### **On Android/iOS (Expo)**

1. **Start the Expo development server:**
   ```
   npx expo start
   ```
2. **On your phone:**

   - Download the **Expo Go** app from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).
   - Scan the QR code shown in your terminal or browser after running `expo start`.
   - The app will open on your device.

3. **On an emulator/simulator:**
   - For Android: Use Android Studio's AVD Manager to launch an emulator, then press `a` in the Expo CLI.
   - For iOS: Use Xcode's simulator, then press `i` in the Expo CLI.

---

## Project Structure

App.js
HomeScreen.js
TaskScreen.js
assets/
└── (optional images or icons)

---

## Notes

- All tasks are stored locally and will persist between app restarts.
- The UI is fully responsive and works on both Android and iOS.
- For custom branding or feature requests, edit the styles or components as needed.

---
