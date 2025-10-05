**Mindful** **Blocker** **-** **Product** **Requirements** **Document**
**(UI/UX)**

**Version:** 1.0

**Date:** October 4, 2025

**Platform:** iOS & Android (React Native) **Design** **System:** Calm &
Mindful

**Table** **of** **Contents**

> 1\. <u>Design System Foundation</u> 2. <u>Screen Specifications</u>
>
> 3\. <u>Components Librar</u>y 4. <u>Interaction Patterns</u>
>
> 5\. <u>Accessibility Guidelines</u>
>
> 6\. <u>Technical Implementation Notes</u>

**1.** **Design** **System** **Foundation**

**1.1** **Color** **Palette**

**Primary** **Colors**

> primary-600: \#4F46E5 (Indigo) - CTAs, active states primary-500:
> \#6366F1 (Indigo) - Hover states primary-400: \#818CF8 (Indigo) -
> Accents
>
> primary-300: \#A5B4FC (Indigo) - Light accents primary-100: \#E0E7FF
> (Indigo) - Backgrounds primary-50: \#EEF2FF (Indigo) - Subtle
> backgrounds

**Secondary** **Colors**

> secondary-600: \#9333EA (Purple) - Secondary actions secondary-500:
> \#A855F7 (Purple) - Hover states secondary-400: \#C084FC (Purple) -
> Accents secondary-300: \#D8B4FE (Purple) - Light accents

**Accent** **Colors**

> accent-600: \#EC4899 (Pink) - Highlights accent-500: \#F472B6 (Pink) -
> Hover states accent-400: \#F9A8D4 (Pink) - Light accents

**Neutral** **Colors**

> gray-900: \#111827 - Primary text (dark mode bg) gray-800: \#1F2937 -
> Headings
>
> gray-700: \#374151 - Body text
>
> gray-600: \#4B5563 - Secondary text gray-500: \#6B7280 - Placeholder
> text gray-400: \#9CA3AF - Disabled text gray-300: \#D1D5DB - Borders
>
> gray-200: \#E5E7EB - Dividers
>
> gray-100: \#F3F4F6 - Card backgrounds gray-50: \#F9FAFB - Page
> backgrounds

**Semantic** **Colors**

> success-600: \#059669 (Green) - Completion states success-500:
> \#10B981 (Green) - Hover states
>
> success-100: \#D1FAE5 (Green) - Success backgrounds warning-600:
> \#D97706 (Amber) - Warnings
>
> warning-100: \#FEF3C7 (Amber) - Warning backgrounds error-600:
> \#DC2626 (Red) - Errors
>
> error-100: \#FEE2E2 (Red) - Error backgrounds

**Gradient** **Definitions**

> gradient-primary: Linear 180deg, \#EEF2FF 0% → \#F3E8FF 50% → \#FCE7F3
> 100% gradient-calm: Linear 180deg, \#DBEAFE 0% → \#D1FAE5 100%
>
> gradient-card: Linear 135deg, \#818CF8 20% → \#9333EA 80%
> gradient-breathing: Linear 135deg, \#67E8F9 0% → \#5EEAD4 100%

**1.2** **Typography**

**Font** **Family**

> **iOS:** SF Pro Display (Headlines), SF Pro Text (Body) **Android:**
> Roboto (All text)
>
> **Web** **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI",
> Roboto, sans-serif

**Type** **Scale**

> **Style** **SizeLine** **HeightWeightLetter** **Spacing** **Use**
> **Case**
>
> display h1
>
> h2
>
> h3

48px56px 32px40px 24px32px

20px28px

300 -1% 300 -0.5% 400 -0.25%

500 0%

Large hero text Page titles Section headers

Card headers

> body-large18px28px 400 0% Emphasized body body 16px24px 400 0%
> Standard body body-small14px20px 400 0% Secondary info
>
> caption
>
> overline

12px16px

10px16px

400 0.25%

600 1%

Labels, meta

Section labels (UPPERCASE)

**Typography** **Guidelines**

> Use tabular numbers for countdown timers and statistics Maximum line
> length: 65 characters for readability Paragraph spacing: 16px between
> paragraphs
>
> Headlines should never exceed 2 lines before wrapping
>
> Body text color contrast ratio: minimum 4.5:1 (WCAG AA)

**1.3** **Spacing** **System**

Based on 8px grid system:

> **TokenValue** **Use** **Case**
>
> xs 4px sm 8px md 16px lg 24px xl 32px 2xl 48px
>
> 3xl 64px

Tight spacing, icon gaps Small gaps, list items Default spacing, padding
Card padding, section gaps Large sections

Screen sections

Major sections

**Safe** **Area** **Insets**

> **iOS:** Respect notch and home indicator **Android:** Respect status
> bar and navigation bar Minimum padding from screen edges: 16px Bottom
> tab bar height: 72px (with safe area)

**1.4** **Corner** **Radius**

> **Token** **Value** **Use** **Case**
>
> sm 8px md 12px lg 16px xl 24px
>
> 2xl 32px

Small buttons, chips Input fields, small cards Medium cards

Large cards, modals

Bottom sheets, major containers

> full 9999pxPills, circles, avatars

**1.5** **Shadows**

> **Token** **CSS** **Value** **Use** **Case**

sm 0px 1px 2px rgba(0,0,0,0.05) md 0px 4px 6px rgba(0,0,0,0.07)

> lg 0px 10px 15px rgba(0,0,0,0.1)

Subtle elevation Cards, buttons

Raised cards

> xl 0px 20px 25px rgba(0,0,0,0.15)Modals, overlays

**Shadow** **Guidelines**

> Use sparingly for depth hierarchy Never stack multiple shadow levels
>
> Reduce shadow opacity in dark mode by 50%

**1.6Animation** **Timing**

> **Token** **Duration** **Easing** **Use** **Case** instant 0ms none
> Immediate changes

fast 150ms base 250ms

> slow 400ms

ease-in-outMicro-interactions ease-in-outStandard transitions

ease-in-outPage transitions

> breathing4000ms ease-in-outBreathing animations

**Easing** **Function:** cubic-bezier(0.4, 0, 0.2, 1)

**Animation** **Principles**

> Respect reduced motion preferences (prefers-reduced-motion) Use
> transform and opacity for performance
>
> Avoid animating width/height (use scale instead) 60fps target for all
> animations
>
> Pause animations when app is backgrounded

**1.7** **Iconography**

**Icon** **System**

> **Library:** Lucide React (v0.263.1) **Default** **Size:** 20px
>
> **Stroke** **Width:** 2px
>
> **Color:** Inherit from parent text color

**Common** **Icons**

> Target: Goals Moon/Sun: Theme toggle
>
> Clock: Time-related features Edit3: Edit actions
>
> Plus: Add actions X: Close/dismiss
>
> CheckCircle: Completion ChevronRight: Navigation Settings:
> Configuration

**2.** **Screen** **Specifications**

**2.1** **Blocker** **Interstitial** **Screen**

**Purpose**

Interrupt automatic app opening behavior with a mindful pause that gives
users time to reflect on their intentions.

**Trigger** **Conditions**

> User opens blocked app via launcher
>
> Background app becomes foreground (if blocked) VPN detects connection
> attempt from blocked app Immediate full-screen overlay with no
> animation delay<img src="./bk113nx4.png"
> style="width:0.36458in;height:0.46875in" />

**Layout** **Structure**

> ┌─────────────────────────────────────┐ │ \[STATUS BAR - 44px\] │
> System status bar ├─────────────────────────────────────┤ │ │
>
> │ \[SPACER 80px\] │ │ │
>
> │ \[BREATHING ICON 132px\] │ Animated circle │ │
>
> │ \[SPACER 32px\] │ │ │
>
> │ \[PRIMARY MESSAGE\] │ Main headline │ \[SPACER 16px\] │
>
> │ \[SECONDARY MESSAGE\] │ Subtext │ │
>
> │ \[SPACER 32px\] │ │ │
>
> │ \[COUNTDOWN 64px\] │ \[TIMER LABEL 12px\] │ │
>
> │ \[SPACER 40px\] │
>
> │ │
>
> │ Large timer

│ "seconds"

> │ \[GOALS REMINDER CARD\] │ Translucent card │ │
>
> │ \[FLEX SPACER\] │ Pushes progress down │ │
>
> │ \[PROGRESS INDICATOR 6px\] │ Fixed bottom
> └─────────────────────────────────────┘

**Detailed** **Component** **Specifications**

**Background**

> **Type:** Full screen gradient
>
> **Gradient:** gradient-primary (Indigo 50 → Purple 50 → Pink 50,
> 180deg) **Scroll:** Disabled (fixed viewport)
>
> **Safe** **Areas:** Respected on all
> edges<img src="./tbeqpd3g.png"
> style="width:0.36458in;height:0.46875in" />
>
> **Backdrop:** No blur (performance consideration)

**Breathing** **Icon**

**Position:**

> Horizontal: Center aligned Vertical: 80px from top safe area

**Structure:**

> Outer Circle (Animated)
>
> ├─ Dimensions: 132px × 132px (base)
>
> ├─ Background: Linear gradient \#818CF8 → \#9333EA ├─ Opacity: 20%
>
> ├─ Border-radius: 50% └─ Animation: Scale pulse
>
> Inner Circle
>
> ├─ Dimensions: 132px × 132px
>
> ├─ Background: Linear gradient \#A5B4FC → \#C4B5FD ├─ Border-radius:
> 50%
>
> └─ Contains: Icon overlay
>
> Icon Overlay
>
> ├─ Icon: Moon (lucide-react) ├─ Size: 48px
>
> ├─ Color: \#FFFFFF └─ Position: Centered

**Animations:**

> 1\. **Outer** **Circle** **Pulse:**
>
> Keyframes: scale(1) → scale(1.2) → scale(1) Duration: 3000ms
>
> Timing: ease-in-out Iteration: infinite Delay: 0ms
>
> 2\. **Opacity** **Pulse:**
>
> Keyframes: 0.2 → 0.3 → 0.2 Duration: 3000ms (synced with scale)
> Timing: ease-in-out
>
> Iteration: infinite 3. **Inner** **Circle** **Rotation:**
>
> Keyframes: rotate(0deg) → rotate(360deg) Duration: 20000ms
>
> Timing: linear Iteration: infinite

**Primary** **Message**

**Specifications:**

> **Position:** 32px below breathing icon **Typography:** h1 (32px,
> weight 300) **Color:** gray-800 (#1F2937) **Alignment:** Center
>
> **Max-width:** 320px (85% screen width, whichever smaller) **Margin:**
> 0 auto (centers element)

**Content** **Options** **(User** **Customizable):**

> 1\. Default: "Take a breath. Do you really need this right now?" 2.
> "Remember why you're here"
>
> 3\. "Your goals are waiting"
>
> 4\. "Is this aligned with your intentions?" 5. "What matters most
> right now?"
>
> 6\. Custom text (60 character limit)

**Animation:**

> Entrance: Fade in from 0 to 1 opacity Duration: 400ms
>
> Delay: 200ms after screen mount Easing: ease-out

**Secondary** **Message**

**Specifications:**

> **Position:** 16px below primary message **Typography:** body-large
> (18px, weight 400) **Color:** gray-600 (#4B5563)
>
> **Alignment:** Center
>
> **Text:** "Taking a moment to pause..."

**Animation:**

> Entrance: Fade in from 0 to 1 opacity Duration: 400ms
>
> Delay: 500ms after screen mount Easing: ease-out

**Countdown** **Timer**

**Specifications:**

> **Position:** 32px below secondary message **Typography:**
>
> Size: 64px
>
> Line-height: 72px Weight: 200 (Ultra-light)
>
> Font-variant: tabular-nums (monospace numbers) **Color:** primary-600
> (#4F46E5)
>
> **Format:** Integer only (15, 14, 13... 1, 0) **Alignment:** Center

**Behavior:**

> Decrements every 1000ms
>
> Updates immediately on screen mount Pauses when app backgrounds
> Resumes when app foregrounds

**Animation** **(Per** **Tick):**

> Scale: 1.0 → 1.05 → 1.0 Duration: 300ms Easing: ease-in-out
>
> Trigger: On each second change

**Accessibility:**

> VoiceOver: Announces each second Format: "\[number\] seconds
> remaining" Update frequency: Every second
>
> Live region: polite (doesn't interrupt)

**Timer** **Label**

**Specifications:**

> **Position:** 8px below countdown **Typography:** caption (12px,
> weight 400) **Color:** gray-500 (#6B7280)
>
> **Text:** "seconds" **Alignment:** Center

**Goals** **Reminder** **Card**

**Container** **Specifications:**

> **Position:** 40px below timer label
>
> **Width:** calc(100% - 48px) \[24px margin each side\] **Max-width:**
> 400px
>
> **Margin:** 0 auto (centers card) **Padding:** 24px
>
> **Background:** rgba(255, 255, 255, 0.6) with backdrop-filter:
> blur(10px) **Border-radius:** 2xl (32px)
>
> **Shadow:** lg (0px 10px 15px rgba(0,0,0,0.1)) **Border:** 1px solid
> rgba(255, 255, 255, 0.8)

**Entrance** **Animation:**

> Transform: translateY(20px) → translateY(0)
>
> Opacity: 0 → 1 Duration: 300ms Delay: 200ms Easing:
> ease-out<img src="./edwvaf51.png"
> style="width:0.36458in;height:0.46875in" />

**Card** **Header:**

> Flex Container (row, centered) ├─ Icon: Target (lucide-react) │ ├─
> Size: 20px
>
> │ ├─ Color: primary-600 │ └─ Stroke-width: 2px ├─ Gap: 8px
>
> └─ Text: "Remember your goals" ├─ Typography: body-small (14px) ├─
> Weight: 500
>
> └─ Color: gray-700

<img src="./m2j5exss.png"
style="width:0.36458in;height:0.46875in" />**Goals** **List:**

> Vertical Stack
>
> ├─ Margin-top: 16px from header ├─ Gap: 8px between items
>
> ├─ Max-height: 120px (approx 3 items) └─ Overflow: scroll (if \>3
> items)
>
> Goal Item
>
> ├─ Flex Container (row, align-center) ├─ Gap: 12px
>
> ├─ Bullet Point │ ├─ Width: 6px
>
> │ ├─ Height: 6px
>
> │ ├─ Border-radius: full
>
> │ ├─ Background: primary-400 │ └─ Flex-shrink: 0
>
> └─ Goal Text
>
> ├─ Typography: body-small (14px) ├─ Color: gray-600
>
> ├─ White-space: nowrap ├─ Overflow: hidden
>
> └─ Text-overflow: ellipsis

**Empty** **State** **(No** **Goals):**

> Text: "Set your goals to see them here" Typography: body-small (14px),
> italic Color: gray-500
>
> Alignment: Center Padding: 16px vertical

**Edge** **Cases:**

> 0 goals: Show empty state
>
> 1-3 goals: Show all without scroll 4+ goals: Show first 3, enable
> scroll
>
> Very long goal text: Truncate with ellipsis

**Progress** **Indicator**

**Specifications:**

> **Position:** Fixed at bottom, 0px from bottom safe area **Width:**
> 100% (full screen width)
>
> **Height:** 6px
>
> **Background** **Track:** rgba(255, 255, 255, 0.4) **Progress**
> **Bar:**
>
> Height: 6px
>
> Background: Linear gradient primary-400 → secondary-600 (90deg)
> Border-radius: 0px (flush edges)
>
> Initial width: 0% Final width: 100%

**Animation:**

> Property: width From: 0%
>
> To: 100%
>
> Duration: Matches countdown (10000ms, 15000ms, etc.) Timing: linear
> (constant speed)
>
> Fill-mode: forwards

**Behavior:**

> Starts immediately on screen mount Pauses when app backgrounds Resumes
> when app foregrounds
>
> Completes at 100% when countdown reaches 0

**Screen** **Behavior** **&** **Edge** **Cases**

**Lifecycle** **States**

> 1\. **Mount:**
>
> Instant overlay (no fade-in) Start countdown immediately Trigger
> entrance animations
>
> 2\. **Active:**
>
> Countdown running Animations playing
>
> User can view but not interact 3. **Backgrounded:**
>
> Pause countdown Pause animations Save current state
>
> 4\. **Foregrounded:**
>
> Resume countdown from saved state Resume animations
>
> No reset
>
> 5\. **Countdown** **Complete:**
>
> Auto-dismiss with 250ms fade-out Log completion event
>
> Return to home screen (not blocked app)

**Edge** **Cases**

> **No** **goals** **set:** Show empty state in goals card
>
> **User** **force-quits** **app:** Log abandonment, reset on next open
>
> **VPN** **connection** **lost:** Show error toast, disable blocking
> temporarily **System** **interruption** **(call,** **notification):**
> Pause countdown, resume after **Device** **rotation:** Lock to
> portrait orientation
>
> **Low** **memory:** Reduce animation complexity (remove blur)

**Analytics** **Events**

> blocker_shown: Timestamp, app_name, blocker_type blocker_completed:
> Duration viewed, goals_shown
>
> blocker_abandoned: Time_remaining, method (force_quit, back_button)

**2.2** **Blocker** **Interstitial** **-** **Breathing** **Variant**

**Purpose**

Alternative blocker experience using a guided breathing exercise to
create mindful pause and reduce anxiety.

**When** **to** **Use**

> User selects "Breathing Exercise" in blocker style settings Randomized
> 30% of the time (if user has "Mixed" setting) User explicitly triggers
> from blocker options

<img src="./ove1oo1e.png"
style="width:0.36458in;height:0.46875in" />**Layout** **Structure**

> ┌─────────────────────────────────────┐ │ \[STATUS BAR - 44px\] │
> ├─────────────────────────────────────┤
>
> │ │ │ \[SPACER 60px\] │ │ │ \[HEADER TEXT\] │ \[SPACER 16px\]
>
> │ \[INSTRUCTION TEXT\] │ │
>
> │ \[SPACER 80px\] │ │
>
> │ \[BREATHING CIRCLE\]

│

│ "Let's breathe together" │

> │ "Follow the circle"

│

> │ Animated, expandable
>
> │ \[132px-192px\] │ │ │
>
> │ \[SPACER 48px\] │ │ │ \[PHASE TEXT\]
>
> │ \[SPACER 24px\]
>
> │ \[BREATH COUNTER\] │ │
>
> │ \[FLEX SPACER\]
>
> │ │

│

│ "Breathe in..." / "out..." │

> │ "X breaths remaining"
>
> │
>
> │ \[PROGRESS INDICATOR\] │ └─────────────────────────────────────┘

**Detailed** **Component** **Specifications**

**Background**

> **Gradient:** Linear 180deg Start: \#DBEAFE (Blue-100) End: \#D1FAE5
> (Teal-100)
>
> **Rationale:** Blue-green spectrum for calming, ocean-like effect
> **Fixed:** No scroll
>
> **Safe** **areas:** Respected

**Header** **Text**

**Specifications:**

> **Position:** 60px from top safe area **Typography:** h1 (32px, weight
> 300) **Text:** "Let's breathe together" **Color:** gray-800
>
> **Alignment:** Center **Max-width:**
> 300px<img src="./otvry31p.png"
> style="width:0.36458in;height:0.46875in" /><img src="./o14bl1hu.png"
> style="width:0.36458in;height:0.46875in" />

**Instruction** **Text**

**Specifications:**

> **Position:** 16px below header **Typography:** body (16px, weight
> 400) **Text:** "Follow the circle"
>
> **Color:** gray-600 **Alignment:** Center

**Breathing** **Circle**

**Base** **Specifications:**

> **Position:** Vertically centered (with slight upward offset)
> **Dimensions:**
>
> Inhale state: 192px × 192px Exhale state: 132px × 132px
>
> **Background:** Linear gradient 135deg Start: \#67E8F9 (Cyan-300)
>
> End: \#5EEAD4 (Teal-300) **Border-radius:** 50% (perfect circle)
>
> **Shadow:** 0px 20px 25px rgba(103, 232, 249, 0.3)

**Animation** **Cycle** **(8** **seconds** **total):**

**Phase** **1:** **Inhale** **(4** **seconds)**

> Transform: scale(0.69) → scale(1.0) Timing: ease-in-out
>
> Duration: 4000ms
>
> Shadow: Expand and intensify

**Phase** **2:** **Exhale** **(4** **seconds)**

> Transform: scale(1.0) → scale(0.69) Timing: ease-in-out
>
> Duration: 4000ms
>
> Shadow: Contract and soften

**Continuous** **Loop:**

> Cycles: 3 complete breaths (24 seconds total) No pause between cycles
>
> Smooth transition at cycle boundaries

**Mathematical** **Scale** **Calculation:**

> Small diameter: 132px Large diameter: 192px
>
> Scale factor: 192/132 = 1.454
>
> Applied to 132px base: scale(1.0) to scale(1.454)

**Phase** **Text**

**Specifications:**

> **Position:** 48px below breathing circle center **Typography:** h2
> (24px, weight 300)
>
> **Color:** gray-700 **Alignment:** Center

**Content** **(Synchronized** **with** **animation):**

> Seconds 0-4: "Breathe in..." Seconds 4-8: "Breathe out..." Repeat for
> 3 cycles

**Transition** **Animation:**

> Opacity: 1 → 0 → 1 (cross-fade) Duration: 400ms
>
> Timing: Triggered at phase change (4s mark)

**Breath** **Counter**

**Specifications:**

> **Position:** 24px below phase text **Typography:** body-small (14px,
> weight 400) **Color:** gray-500
>
> **Alignment:** Center
>
> **Format:** "\[number\] breaths remaining"

**Behavior:**

> Starts at: 3
>
> Decrements: After each complete exhale Updates: At second 8, 16, 24
>
> When 0: Triggers screen dismissal

**Progress** **Indicator**

> Same specifications as standard blocker Duration: 24000ms (24 seconds
> for 3 breaths) Color: gradient-breathing instead of gradient-card

**Interaction** **&** **Behavior**

**Breathing** **Cadence**

> **Inhale:** 4 seconds (slow, controlled) **Exhale:** 4 seconds (slow,
> releasing) **Total** **cycle:** 8 seconds
>
> **Cycles** **required:** 3 (24 seconds total)
>
> **No** **hold** **phase:** Continuous flow for simplicity

**Haptic** **Feedback** **(iOS** **Only)**

> **Trigger** **points:**
>
> Start of inhale: UIImpactFeedbackStyle.light Start of exhale:
> UIImpactFeedbackStyle.light
>
> **Disabled** **if:** User has haptics off in settings **Purpose:**
> Subtle tactile guidance

**Accessibility**

**VoiceOver:**

> On mount: "Breathing exercise. Three breath cycles. Follow the
> expanding and contracting circle." During exercise: Announce phase
> changes ("Breathe in", "Breathe out")
>
> Counter updates: "2 breaths remaining"

**Reduced** **Motion:**

> If enabled: Reduce scale range (132px to 160px instead of 192px)
> Maintain timing (4s inhale/exhale)
>
> Keep all other features

**Edge** **Cases**

> **Backgrounded:** Pause animation, resume on foreground
> **Interrupted:** Save progress, resume from current breath
> **Completed** **early:** User can't skip, must complete 3 breaths
> **System** **interruption:** Pause, show modal to resume or exit

**2.3** **Home** **Dashboard** **Screen**

**Purpose**

Central hub for managing blocked apps, viewing statistics, tracking
goals, and accessing core app functionality.

<img src="./3zitfjm4.png"
style="width:0.36458in;height:0.46875in" />**Layout** **Structure**

┌─────────────────────────────────────┐ │ \[HEADER + THEME TOGGLE -
80px\] │

│ "Mindful" \| Theme toggle │ ├─────────────────────────────────────┤ │
│

│ \[STATS CARD - 120px\] │

│ ┌─────────┬─────────┬─────────┐ │ │ │ Blocks │ Time │ Rate │ │

│ │ 24 │ 1.2h │ 89% │ │

│ └─────────┴─────────┴─────────┘ │ │ │

│ \[YOUR GOALS SECTION\] │

│ ┌─────────────────────────────┐ │ │ │ 🎯Your Goals \[+\] │ │

│ │ □ Read for 30 minutes │ │ │ │ □ Learn React Native │ │ │ │ □ Call
mom │ │

│ └─────────────────────────────┘ │ │ │

│ \[BLOCKED APPS SECTION\] │

│ ┌─────────────────────────────┐ │ │ │ Blocked Apps \[+\] │ │

│ │ 📷 Instagram ◉ │ │ │ │ 🐦 Twitter ◉ │ │ │ │ 🎵 TikTok ○ │ │

│ └─────────────────────────────┘ │ │ │

│ \[INSIGHTS SECTION\] │

│ ┌─────────────────────────────┐ │ │ │ This Week │ │

│ │ \[Line chart visualization\] │ │

│ └─────────────────────────────┘ │ │ │

│ \[BOTTOM PADDING\] │ │ 88px │

├─────────────────────────────────────┤ │ \[BOTTOM TAB BAR - 72px\] │

│ Home \| Stats \| Settings │ └─────────────────────────────────────┘

**Container** **Specifications**<img src="./5k30cdky.png"
style="width:0.36458in;height:0.46875in" />

**Root** **Container**

> **Background:** Linear gradient 180deg Start: \#F8FAFC (Slate-50)
>
> End: \#EEF2FF (Indigo-50)
>
> **Scroll:** Vertical, momentum scrolling enabled **Bounce:** Enabled
> on iOS, disabled on Android **Content** **padding:**
>
> Horizontal: 24px Top: Safe area + 16px
>
> Bottom: 88px (accounts for tab bar) **Max-width:** 600px (centered on
> tablets)

**Header** **Section**

**Layout**

> Flex Container (row, space-between, align-start) ├─ Left: App branding
>
> │ ├─ App title │ └─ Tagline
>
> └─ Right: Theme toggle button

**Specifications:**

> **Height:** 80px **Padding:** 16px 0px **Margin-bottom:** 32px

**App** **Title**

> **Typography:** h1 (32px, weight 300) **Text:** "Mindful"
>
> **Color:** gray-800 **Letter-spacing:** -0.5%

**Tagline**

> **Typography:** body-small (14px, weight 400) **Text:** "Stay present,
> stay focused"
>
> **Color:** gray-600 **Margin-top:** 4px

**Theme** **Toggle** **Button**

<img src="./fm1qytkw.png"
style="width:0.36458in;height:0.46875in" /><img src="./apzgywwp.png"
style="width:0.36458in;height:0.46875in" />

> Button Container
>
> ├─ Dimensions: 48px × 48px ├─ Border-radius: full
>
> ├─ Background: \#FFFFFF ├─ Shadow: sm
>
> ├─ Position: absolute right
>
> └─ Icon: Sun (light mode) or Moon (dark mode) ├─ Size: 20px
>
> ├─ Color: \#F59E0B (sun) or \#6366F1 (moon) └─ Centered

**States:**

> **Default:** Shadow sm
>
> **Hover** **(web):** Shadow md, transition 150ms **Pressed:** Scale
> 0.95, duration 100ms **Active:** Background gray-100

**Behavior:**

> Tap: Toggle between light/dark mode Persist: Save preference to local
> storage Animate: Icon cross-fade, 200ms

**Stats** **Card**

**Container**

> Card Container ├─ Width: 100%
>
> ├─ Background: \#FFFFFF ├─ Border-radius: xl (24px) ├─ Padding: 24px
>
> ├─ Shadow: sm
>
> ├─ Margin-bottom: 24px └─ Min-height: 120px

**Stats** **Grid**

<img src="./rnpestaj.png"
style="width:0.36458in;height:0.46875in" /><img src="./hvqmkeyu.png"
style="width:0.36458in;height:0.46875in" />

> Grid Layout (3 columns, equal width) ├─ Gap: 0px (use dividers
> instead) ├─ Align: stretch
>
> └─ Height: 72px (content height)

**Stat** **Item**

> Stat Container (centered vertically & horizontally) ├─ Stat Value
>
> │ ├─ Typography: 40px / 48px / weight 300 │ ├─ Font-variant:
> tabular-nums
>
> │ ├─ Color: Dynamic per column
>
> │ └─ Animation: Count-up on mount └─ Stat Label
>
> ├─ Typography: caption (12px, weight 400)
