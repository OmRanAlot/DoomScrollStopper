# DoomScrollStopper - Modern Focus App

A React Native mobile application designed to help users reduce screen time and "doom scrolling" by implementing app blocking with customizable delay screens. The app features a modern, minimal UI design that promotes digital wellness and mindful technology use.

## 🎨 Design Features

### Modern UI Design
- **Minimal, clean, and distraction-free** interface
- **Consistent color scheme** with proper contrast and accessibility
- **Smooth animations** and transitions (150ms)
- **Card-based layout** with subtle shadows and rounded corners
- **Responsive design** that works across different screen sizes

### Color Palette
- **Primary**: #4F46E5 (Indigo) - Buttons & highlights
- **Secondary**: #6B7280 (Neutral gray) - Icons & labels
- **Success**: #10B981 (Green) - Progress & achievements
- **Warning**: #F59E0B (Amber) - Alerts & streaks
- **Background**: #FFFFFF (White) - Main background
- **Surface**: #F9FAFB (Light gray) - Cards & containers

### Typography
- **Headings**: 24px, semi-bold
- **Subheadings**: 18px, medium
- **Body text**: 14px, regular
- **Small labels**: 12px, medium
- **System fonts**: Inter/SF Pro Display fallback

## 🏗️ App Structure

### Three Main Tabs

#### 1. Home Tab
- **Daily Overview Card**: Shows today's saved screen time and blocked apps count
- **Blocked Apps List**: Horizontal chips displaying currently blocked applications
- **Delay Settings Preview**: Current delay time and focus mode information
- **Quick Actions**: Start/pause session buttons
- **Adjust Settings Button**: Navigates to Customize tab

#### 2. Customize Tab
- **App Selector**: Toggle switches for selecting which apps to block
- **Delay Time Slider**: Adjustable delay from 5 seconds to 120 seconds
- **Focus Modes**: Pre-configured blocking profiles (Study, Work, Sleep, Custom)
- **Delay Screen Message Editor**: Customizable message for delay screens
- **Save Changes Button**: Full-width button to apply settings

#### 3. Progress Tab
- **Progress Bar**: Visual representation of daily goal progress
- **Streak Counter**: Current and best streak tracking
- **Achievements Grid**: 2-column grid of unlockable badges
- **Weekly Graph**: Bar chart showing screen time saved per day
- **Monthly Summary**: Statistics overview with key metrics

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DoomScrollStopper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies**
   ```bash
   npm install @react-native-community/slider
   ```

4. **iOS specific setup** (if developing for iOS)
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Start Metro
```bash
npm start
```

## 🔧 Technical Implementation

### Core Features
- **App Monitoring**: Real-time detection using Android UsageStatsManager
- **Background Service**: VPN service for persistent monitoring
- **Overlay System**: Custom delay screens with countdown timers
- **Permission Management**: Usage access and overlay permissions
- **Data Persistence**: SharedPreferences for user settings

### Native Modules
- **VPNModule**: Main bridge between React Native and Android
- **AppUsageMonitor**: Core monitoring and overlay logic
- **MyVpnService**: Background service for continuous operation
- **SettingsModule**: Persistent storage management

### React Native Components
- **Modern Navigation**: React Navigation with bottom tabs
- **Vector Icons**: Ionicons for consistent iconography
- **Custom Slider**: React Native Community Slider for delay settings
- **Responsive Layout**: Flexbox-based responsive design

## 📱 User Experience

### Key Interactions
- **Smooth Navigation**: Tab-based navigation with proper state management
- **Visual Feedback**: Clear visual indicators for all interactive elements
- **Consistent Spacing**: 16px padding around edges, 8px increments
- **Touch Targets**: Properly sized buttons and interactive elements
- **Loading States**: Appropriate loading indicators and transitions

### Accessibility
- **High Contrast**: Proper color contrast ratios
- **Touch Friendly**: Adequate touch target sizes
- **Clear Labels**: Descriptive text for all interactive elements
- **Consistent Patterns**: Familiar UI patterns and interactions

## 🎯 Use Cases

This app is designed for users who want to:
- **Reduce screen time** and digital distractions
- **Break habitual app usage** patterns
- **Practice mindful technology use** with intentional delays
- **Monitor their app usage** patterns and progress
- **Build healthy digital habits** through gamification

## 🔒 Security & Privacy

- **No data collection** or external transmission
- **Local storage only** for user preferences
- **Minimal permissions** required for core functionality
- **VPN service** used minimally for background operation
- **User control** over all blocking settings

## 🚧 Development Notes

### Current Status
- ✅ **Android**: Fully implemented with native modules
- ✅ **React Native UI**: Complete modern design implementation
- ⚠️ **iOS**: Basic setup (no native implementation yet)
- ⚠️ **Testing**: Basic test coverage

### Known Issues
- Slider component requires `@react-native-community/slider` dependency
- Vector icons require proper linking in native projects
- Some TypeScript warnings may appear (non-blocking)

### Future Enhancements
- iOS native implementation
- Enhanced testing coverage
- Dark mode support
- Advanced analytics and insights
- Social features and challenges

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ using React Native and modern mobile design principles**
