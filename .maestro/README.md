# Maestro E2E Testing Guide

Complete guide for running end-to-end tests on the NextGen FitCoach mobile app using Maestro.

## 📋 Table of Contents

- [What is Maestro?](#what-is-maestro)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Flows](#test-flows)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🎯 What is Maestro?

Maestro is a mobile UI testing framework that allows you to write simple, declarative tests for iOS and Android apps. It's designed to be:

- **Simple**: Write tests in YAML format
- **Fast**: Tests run quickly and reliably
- **Cross-platform**: Works on both iOS and Android
- **No code changes required**: Tests interact with your app as a user would

## 📦 Installation

### Windows Installation

**Option 1: Using npm (Recommended for Windows)**

```bash
npm install -g @maestro/cli
```

**Option 2: Using PowerShell**

```powershell
# Run as Administrator
iwr "https://get.maestro.mobile.dev" -OutFile maestro-install.ps1
.\maestro-install.ps1
```

### Verify Installation

```bash
maestro --version
```

You should see the Maestro version number if installation was successful.

## 🚀 Running Tests

### Prerequisites

Before running tests, ensure you have:

1. **Android Emulator or iOS Simulator running**
   ```bash
   # For Android
   npm run android
   
   # For iOS (macOS only)
   npm run ios
   ```

2. **App installed on the device/emulator**

### Run All Tests

```bash
# Using npm script
npm run test:e2e

# Or directly with Maestro
maestro test .maestro/flows/
```

### Run Specific Test Flow

```bash
# Home screen test
npm run test:e2e:home

# Search functionality test
npm run test:e2e:search

# Or run directly
maestro test .maestro/flows/01-home-screen.yaml
```

### Run Tests on Specific Platform

```bash
# Android
npm run test:e2e:android

# iOS (macOS only)
npm run test:e2e:ios
```

## 📝 Test Flows

### 1. Home Screen Test (`01-home-screen.yaml`)

**What it tests:**
- App launches successfully
- Home screen UI elements are visible (app name, buttons)
- Microphone button interaction (tap to start/stop recording)
- Navigation to search screen

**Run command:**
```bash
maestro test .maestro/flows/01-home-screen.yaml
```

### 2. Manual Search Test (`02-search-manual.yaml`)

**What it tests:**
- Navigation to search screen
- Search input functionality
- Text input and filtering
- Clear button functionality
- Search results display

**Run command:**
```bash
maestro test .maestro/flows/02-search-manual.yaml
```

### 3. Workout Selection Test (`03-workout-selection.yaml`)

**What it tests:**
- Searching for workouts
- Tapping on workout cards
- Modal display with workout details
- Modal dismissal

**Run command:**
```bash
maestro test .maestro/flows/03-workout-selection.yaml
```

### 4. Voice to Search Navigation (`04-voice-to-search.yaml`)

**What it tests:**
- Voice recording button interaction
- State changes during recording
- Navigation flow from home to search

**Run command:**
```bash
maestro test .maestro/flows/04-voice-to-search.yaml
```

## ✍️ Writing New Tests

### Basic Test Structure

```yaml
appId: com.i_son.lastimosa.newgenfitcoach
---
# Test: Your Test Name
# Description: What this test does

- launchApp

# Your test steps here
- assertVisible: "Some Text"
- tapOn:
    id: "element-testid"
- inputText: "search query"
```

### Common Maestro Commands

```yaml
# Launch the app
- launchApp

# Assert element is visible
- assertVisible: "Text to find"
- assertVisible:
    id: "testID-value"

# Tap on element
- tapOn: "Button Text"
- tapOn:
    id: "button-testid"

# Input text
- inputText: "text to type"

# Navigate back
- back

# Wait for animations
- waitForAnimationToEnd

# Scroll
- scroll

# Take screenshot
- takeScreenshot: screenshot-name
```

### Adding testID to Components

To make elements testable, add `testID` props:

```tsx
// Example
<Pressable
  testID="my-button"
  onPress={handlePress}
>
  <Text>Click Me</Text>
</Pressable>
```

## 🔧 Troubleshooting

### Common Issues

**1. "App not found" error**

```bash
# Make sure your app is running
npm run android
# or
npm run ios

# Then run tests
maestro test .maestro/flows/
```

**2. "Element not found" error**

- Verify the element exists in your app
- Check if the `testID` is correct
- Ensure the element is visible on screen
- Add a wait before the assertion:
  ```yaml
  - waitForAnimationToEnd
  - assertVisible:
      id: "element-testid"
  ```

**3. Tests are flaky**

- Add appropriate waits between actions
- Increase timeout in `config.yaml`
- Use `testID` instead of text matching when possible

**4. Maestro command not found**

```bash
# Reinstall Maestro
npm install -g @maestro/cli

# Or add to PATH (Windows)
# Add C:\Users\YourUsername\.maestro\bin to system PATH
```

### Debug Mode

Run tests with verbose output:

```bash
maestro test --debug .maestro/flows/01-home-screen.yaml
```

## 🎯 Best Practices

### 1. Use testID Props

✅ **Good:**
```yaml
- tapOn:
    id: "search-input"
```

❌ **Avoid:**
```yaml
- tapOn: "Search workout..."  # Text can change
```

### 2. Add Descriptive Comments

```yaml
# Test: User Login Flow
# Description: Validates user can log in with valid credentials

- launchApp
# Navigate to login screen
- tapOn:
    id: "login-button"
```

### 3. Keep Tests Focused

Each test should verify one specific feature or user flow.

### 4. Use Waits Appropriately

```yaml
# Wait for animations to complete
- waitForAnimationToEnd

# Wait for element to appear
- assertVisible:
    id: "loading-indicator"
```

### 5. Organize Test Flows

- Number your test files (01-, 02-, etc.)
- Group related tests in subdirectories
- Use descriptive filenames

### 6. Test on Both Platforms

```bash
# Test on Android
maestro test --platform android .maestro/flows/

# Test on iOS
maestro test --platform ios .maestro/flows/
```

## 📚 Additional Resources

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Maestro GitHub](https://github.com/mobile-dev-inc/maestro)
- [Maestro Discord Community](https://discord.gg/maestro)

## 🤝 Contributing

When adding new features to the app:

1. Add `testID` props to new interactive elements
2. Create corresponding test flows
3. Update this documentation
4. Run all tests before committing

## 📄 Test Coverage

Current test coverage:

- ✅ Home screen navigation
- ✅ Voice recording interface
- ✅ Manual search functionality
- ✅ Workout selection
- ✅ Modal interactions
- ⏳ User authentication (TODO)
- ⏳ Workout tracking (TODO)
- ⏳ Settings screen (TODO)

---

**Happy Testing! 🎉**
