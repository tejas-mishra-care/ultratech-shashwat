# Welcome to your Lovable project

## UltraCertify - Android App

A professional certification management mobile application built with React, TypeScript, and Capacitor.

## Android Development Setup

### Prerequisites
- Node.js & npm installed
- Android Studio installed
- Java Development Kit (JDK) 11 or higher
- Android SDK (API level 22 or higher)

### Building for Android

1. **Install dependencies:**
```sh
npm install
```

2. **Build and open in Android Studio:**
```sh
npm run android
```

3. **For development build:**
```sh
npm run android:dev
```

4. **Sync native files only:**
```sh
npm run sync:android
```

### Android Studio Setup

1. Open Android Studio
2. Open the `android` folder as an Android project
3. Let Gradle sync complete
4. Connect an Android device or start an emulator
5. Click "Run" to install and launch the app

### Features

- **Native Camera Integration**: Take photos with location data
- **File System Access**: Save and manage certification documents
- **Geolocation**: Automatic location tagging for photos
- **Offline Support**: Works without internet connection
- **Professional UI**: Mobile-first design optimized for Android

### App Permissions

The app requests the following permissions:
- **Camera**: For taking certification photos
- **Location**: For geotagging photos and location-based features
- **Storage**: For saving documents and photos
- **Internet**: For syncing data when available

### Development

For web development and testing:
```sh
npm run dev
```

For building web version:
```sh
npm run build
```

### Troubleshooting

1. **Gradle sync issues**: Clean and rebuild in Android Studio
2. **Permission errors**: Check AndroidManifest.xml permissions
3. **Camera not working**: Ensure device has camera and permissions are granted
4. **Build errors**: Make sure Android SDK and build tools are up to date

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Capacitor (for native Android features)
- Supabase (for backend services)
- Zustand (for state management)
- Framer Motion (for animations)
