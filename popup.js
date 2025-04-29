const target = new Date(2025, 5, 11, 0, 0, 0, 0);

function update() {
    const now = new Date();
    let diff = target - now;
    
    if (diff <= 0) {
        document.getElementById("timer").style.display = "none";
        document.getElementById("confetti").style.display = "block";
        document.getElementById("title").textContent = "The grind actually starts now";
        document.getElementById("batch-container").style.display = "none";
        clearInterval(interval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Update each timer element separately
    document.getElementById("days").textContent = days.toString().padStart(2, "0");
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0");
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0");
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0");

    // Update progress bar if available
    updateProgressBar();
}

function updateProgressBar() {
    // Get the progress percentage from storage
    chrome.storage.local.get(['progressPercentage'], function(result) {
        if (result.progressPercentage !== undefined) {
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            
            progressBar.style.width = `${result.progressPercentage}%`;
            progressText.textContent = `${result.progressPercentage}%`;
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    update();
    updateProgressBar();
});

const interval = setInterval(update, 1000); // update every second

