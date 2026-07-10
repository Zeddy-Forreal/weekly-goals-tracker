<div align="center">

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

# ☑️ Weekly Goals Tracker

A personal weekly goal management app built with pure HTML, CSS, and JavaScript. Plan your week, track what you actually complete, carry repeated goals forward automatically, and watch your discipline rate build over time — all saved locally, no account needed.

[Features](#-features) · [Getting Started](#-getting-started) · [File Structure](#-file-structure) · [Customization](#-customization)

</div>

---

## ✨ Features

* 📋 **Current Week Goals** — View and check off this week's goals with a live progress bar and day-of-week tracker
* 🔁 **Repeated Goals** — Set goals that carry over automatically every week without re-entering them
* ➕ **Next Week Planning** — Queue up next week's goals in advance so you start every Monday ready
* 🚨 **Mid-Week Add** — Add emergent or forgotten goals to the current week on the fly
* 🎯 **Priority Levels** — Assign a difficulty/importance level (1–3) to each goal using `#` syntax — affects your discipline rate calculation
* 📅 **History** — Every past week is stored and collapsible, showing which goals were hit and which were missed
* 📊 **Stats Page** — Tracks total weeks recorded, total goals achieved, average goals per week, and a weighted discipline rate
* 📈 **Bar Chart** — Visual weekly performance chart that highlights your best week automatically
* 💾 **localStorage Persistence** — Everything saves to the browser — no backend, no account, no data loss on refresh
* 📱 **Fully Responsive** — Works cleanly from desktop down to small mobile screens

---

## 🚀 Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/Zeddy-Forreal/weekly-goals-tracker.git
cd weekly-goals-tracker
```

**2. Open in browser**

No build step, no installs. Just open `index.html` directly:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

**3. Start tracking**

Add your goals for next week in the "Next Week Goals" section. They'll automatically become your current week goals when the week rolls over. Use `#` followed by a number (1–3) to set a priority level — e.g. `gym#3` or `read a chapter#1`.

---

## 📁 File Structure

```
weekly-goals-tracker/
├── index.html              Markup and structure
├── script/
│   └── main.js               All app logic — goals, history, stats, localStorage
└── style/
    ├── style.css             Global tokens, layout, nav, and shared components
    ├── home.css              Current week, progress bar, and goal input sections
    ├── history.css           Collapsible week history and goal item styles
    └── stats.css             Stats grid and bar chart styles
```

---

## ⚙️ How It Works

Goals are stored as objects with a `key` derived from the week's start and end dates, so the app always knows which goals belong to which week:

```javascript
function getWeekKey(date) {
    return getWeekStartAndEnd(date).join(" | ");
}
```

The discipline rate is calculated using a weighted score based on goal levels — completing a harder goal (level 3) contributes more than an easy one (level 1):

```javascript
let total_checked_levels = getTotalLevels(checked);
let total_levels = getTotalLevels(past_goals);
// discipline rate = (checked levels / total levels) * 100
```

Repeated goals are tagged with `special: true` and automatically injected into next week's goal list when a new week goal is added:

```javascript
if (nextWeekGoals.some(obj => obj.special) == false && constantGoals.length > 0) {
    constantGoals.forEach((goal) => {
        goals.push({ ...goal, key: getWeekKey(next_week) });
    });
}
```

---

## 🎨 Customization

All colors are CSS custom properties at the top of `style.css`:

```css
:root {
  --bg1:        #f7f5f2;   /* Page background          */
  --bg2:        #eeebe8;   /* Card / nav background     */
  --bg3:        #b6b6b6;   /* Borders and shadows       */
  --mutedText:  #8c8c8c;   /* Secondary text            */
  --text:       #1e003d;   /* Primary text              */
  --main:       #821cff;   /* Accent color (purple)     */
  --main_low:   #d8b8ff;   /* Inactive level indicators */
  --max:        #ff20a8;   /* Best week bar highlight   */
}
```

---

<div align="center">

Made with 🖤 by [Zeddy-Forreal](https://github.com/Zeddy-Forreal)

</div>
