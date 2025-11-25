# 🌍 Tourism Discovery App - AI Hackathon 2025

A modern, AI-powered mobile application for discovering hidden gems and popular locations in Romania. Built with React Native, Expo, and integrated with OpenRouter API for intelligent recommendations.

## ✨ Features

### 🤖 AI Integration

- **Vibe Generator**: Generates unique, engaging descriptions for locations using Mistral 7B via OpenRouter.
- **AI Assistant**: A dedicated chatbot tab that acts as a local guide, answering questions like "Where can I find good coffee in Cluj?" based on real app data.
- **Smart Context**: The AI is aware of the app's database, ensuring recommendations are relevant and accurate.

### 📱 Core Functionality

- **Interactive Map**: View locations on a map with custom markers.
- **Advanced Filtering**: Filter by County, Minimum Rating, and "Favorites Only".
- **Real-time Search**: Instantly find locations by name or address.
- **User Profiles**: Create accounts, edit profiles, and track your activity.

### ⭐️ Social Features

- **Reviews**: Read and write reviews for locations.
- **Favorites**: Save your favorite spots for quick access.
- **Bookings**: Direct integration with WhatsApp for table reservations.

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 52)
- **Language**: JavaScript
- **Database**: SQLite (via `expo-sqlite`) for local persistence of users, reviews, and favorites.
- **Navigation**: React Navigation (Stack & Bottom Tabs).
- **AI API**: OpenRouter (Mistral 7B Instruct).
- **Styling**: StyleSheet (Custom design system).

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Expo Go app on your phone (or Android Studio/Xcode for emulator)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ai-hackathon-app.git
   cd ai-hackathon-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your OpenRouter API key:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the app**
   ```bash
   npx expo start --clear
   ```

## 📱 Screenshots

|    Home Screen    |   Details & AI   |  Chat Assistant   |      Profile       |
| :---------------: | :--------------: | :---------------: | :----------------: |
| _List & Map View_ | _Vibe Generator_ | _Local Guide Bot_ | _Stats & Settings_ |

## 🔐 Credentials (for testing)

- **Admin Account**: `admin@hackathon.ro` / `admin123`
- **User Account**: `user@test.com` / `test123`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for the AI Hackathon 2025_
