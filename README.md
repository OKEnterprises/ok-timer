# OK Timer

An OK timer in your browser. Simple timers, done well.

## What It Does

OK Timer helps you track time with countdown and countup timers. Give it a title and optionally a date:

- **Future date**: Countdown timer (e.g., "20 days, 5 hours, 30 minutes")
- **Past date**: Countup timer (e.g., "3 days, 2 hours ago")
- **No date**: Defaults to today (starts counting up immediately)

## Features

- Clean, minimal interface
- Multiple simultaneous timers
- Live updates every second
- Persistent storage (survives browser refresh)
- Mobile-friendly design
- Zero dependencies

## How to Use

1. Open `index.html` in your browser
2. Enter a title for your timer
3. Optionally pick a date/time (defaults to now)
4. Click "Add Timer"
5. Watch it count!

Delete timers when you're done with them.

## Technical Details

- **Stack**: Vanilla HTML, CSS, JavaScript (ES6+)
- **Storage**: localStorage
- **No build tools**: Just open the HTML file

## Local Development

```bash
# Clone the repo
git clone <your-repo-url>
cd ok-timer

# Open in browser (any method works)
open index.html                    # macOS
start index.html                   # Windows
xdg-open index.html               # Linux

# Or use a simple server
python -m http.server 8000        # Python 3
# Then visit: http://localhost:8000
```

## Browser Compatibility

Works in all modern browsers that support:
- localStorage
- ES6 JavaScript
- CSS Grid/Flexbox

## Built By

OK Enterprises - Building simple tools that work well.
