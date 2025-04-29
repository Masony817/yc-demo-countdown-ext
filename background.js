const target = new Date(2025, 5, 11, 0, 0, 0, 0);

// Set badge background color
chrome.action.setBadgeBackgroundColor({ color: '#FB651E' });

// Define milestone notifications (days before target date)
const milestones = [
  { days: 100, message: "100 days until YC Demo Day! Time to accelerate your progress." },
  { days: 50, message: "50 days until YC Demo Day! Halfway to the big pitch." },
  { days: 30, message: "1 month until YC Demo Day! Start finalizing your presentation." },
  { days: 21, message: "3 weeks until YC Demo Day! Focus on your core message." },
  { days: 14, message: "2 weeks until YC Demo Day! Practice your pitch daily." },
  { days: 7, message: "1 week until YC Demo Day! Final refinements and rehearsals." },
  { days: 6, message: "6 days until YC Demo Day! Almost there." },
  { days: 5, message: "5 days until YC Demo Day! Keep focused." },
  { days: 4, message: "4 days until YC Demo Day! You're nearly ready." },
  { days: 3, message: "3 days until YC Demo Day! Final preparations." },
  { days: 2, message: "2 days until YC Demo Day! Last rehearsals." },
  { days: 1, message: "1 day until YC Demo Day! Get a good night's sleep." },
  { days: 0, message: "It's YC Demo Day! Good luck! 🎊" }
];

// Check remaining days and show a notification if it's a milestone day
function checkMilestones() {
  const now = new Date();
  let diff = target - now;
  
  if (diff < 0) return;
  
  const daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Check if today is a milestone day
  const milestone = milestones.find(m => m.days === daysRemaining);
  if (milestone) {
    chrome.notifications.create(`milestone-${milestone.days}`, {
      type: 'basic',
      iconUrl: 'icons/128/icon.png',
      title: 'YC Demo Day Countdown',
      message: milestone.message,
      priority: 2
    });
  }
}

// Handle the end of countdown
function handleCountdownEnd() {
  chrome.notifications.create('countdown-end', {
    type: 'basic',
    iconUrl: 'icons/128/icon.png',
    title: 'YC Demo Day Is Here!',
    message: 'Today is the big day! Best of luck with your presentation! 🎊🚀',
    priority: 2
  });
}

function updateBadge() {
  const now = new Date();
  let diff = target - now;
  
  if (diff <= 0) {
    chrome.action.setBadgeText({ text: '🎊' });
    // Check if this is the first time we've hit zero
    chrome.storage.local.get(['countdownEnded'], function(result) {
      if (!result.countdownEnded) {
        handleCountdownEnd();
        chrome.storage.local.set({countdownEnded: true});
      }
    });
    return;
  }

  // For the badge, we'll show days remaining or hours if < 1 day
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) {
    chrome.action.setBadgeText({ text: `${days}d` });
  } else {
    // Less than a day left, show hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    chrome.action.setBadgeText({ text: `${hours}h` });
  }
  
  // Calculate and store progress percentage for the popup
  const startDate = new Date(2025, 3, 1); // April 1, 2025 assuming start of the x25 batch
  const totalDuration = target.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const progressPercentage = Math.min(100, Math.max(0, Math.floor((elapsed / totalDuration) * 100)));
  
  chrome.storage.local.set({progressPercentage: progressPercentage});
}

// Check for milestones and update badge when extension is loaded
checkMilestones();
updateBadge();

// Set up daily alarm to check milestones (triggers at midnight)
chrome.alarms.create('dailyMilestoneCheck', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60 // Daily
});

// Set up minute alarm to update badge
chrome.alarms.create('updateBadge', {
  periodInMinutes: 1
});

// Get timestamp for next midnight
function getNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

// Listen for alarms
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'dailyMilestoneCheck') {
    checkMilestones();
  } else if (alarm.name === 'updateBadge') {
    updateBadge();
  }
});

// Check for milestones when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  checkMilestones();
  updateBadge();
}); 