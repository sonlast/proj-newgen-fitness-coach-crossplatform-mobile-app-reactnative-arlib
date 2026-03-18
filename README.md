# NextGen FitCoach

> 🚧 **Status: Work in Progress** 🚧
> This project is currently under active development. Some features may not be fully implemented or are subject to change as the app evolves.

A cross-platform mobile fitness coaching application featuring real-time AI voice integrations and personalized tracking, built with React Native.

![GitHub license](https://img.shields.io/github/license/sonlast/proj-newgen-fitness-coach-crossplatform-mobile-app-reactnative-arlib)

## Description

**NextGen FitCoach** is an innovative fitness coaching application designed to bring an AI-driven personal trainer experience directly to your mobile device. With features such as voice-to-search for workouts, real-time AI guidance, and comprehensive progress tracking, this app aims to make achieving your fitness goals intuitive and seamless.

**Why these technologies:**
- **React Native & Expo**: Chosen for their ability to deliver a robust, near-native experience across both iOS and Android platforms from a single codebase. Expo enables rapid development, easy testing, and smooth deployment.
- **Supabase**: Serves as our scalable backend-as-a-service, handling secure user authentication and real-time database needs for tracking workouts and user profiles.
- **Speechmatics API**: Integrated to provide high-accuracy, real-time and batch voice transcription. This powers our unique voice-to-search functionality, allowing users to find workouts and interact with the app hands-free.
- **Expo Camera & Audio**: Essential for capturing form, recording voice commands, and ensuring users get the most out of their interactive coaching sessions.

**Challenges & Future Features:**
One of the primary challenges was ensuring low-latency processing of real-time voice inputs during workouts. In the future, we hope to implement more advanced AI computer vision for real-time form correction, deeper integration with wearables (smartwatches), and a social component for community challenges.

## Table of Contents

- [How to Install and Run the Project](#how-to-install-and-run-the-project)
- [How to Use the Project](#how-to-use-the-project)
- [Credits](#credits)
- [License](#license)

## How to Install and Run the Project

To get a local copy up and running, follow these simple steps:

### Prerequisites
- Node.js installed on your machine.
- Expo Go app installed on your physical mobile device, or an iOS Simulator / Android Emulator set up.
- A Supabase project and a Speechmatics API key for environment variables.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sonlast/proj-newgen-fitness-coach-crossplatform-mobile-app-reactnative-arlib.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd proj-newgen-fitness-coach-crossplatform-mobile-app-reactnative-arlib
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add your API keys (e.g., Supabase URL, Supabase Anon Key, Speechmatics Token).

5. **Run the development server:**
   ```bash
   npx expo start
   ```

6. Open the Expo application on your phone and scan the QR code generated in your terminal to view the app in action!


_Note: For developers, we use Maestro for End-to-End testing._

## Credits

- Development by Ijerson Lastimosa

**Third-Party Assets & APIs:**
- UI Components powered by [React Native Paper](https://callstack.github.io/react-native-paper/)
- Voice AI by [Speechmatics](https://www.speechmatics.com/)
- Backend by [Supabase](https://supabase.com/)

## License

This project is licensed under the [Apache License 2.0](LICENSE) - see the `LICENSE` file for details.
