// script.js

// Preload audio for Yes button
var yesAudio = new Audio('yay.mp3');
yesAudio.preload = 'auto';

// Simple confetti animation: creates a full-screen canvas and animates pieces
function launchConfetti(durationMs = 3000, particleCount = 120) {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var dpi = window.devicePixelRatio || 1;
    function resize() {
        canvas.width = window.innerWidth * dpi;
        canvas.height = window.innerHeight * dpi;
        ctx.scale(dpi, dpi);
    }
    resize();
    window.addEventListener('resize', resize);

    var colors = ['#fff9d6', '#fff3a6', '#fff08a', '#ffe066', '#ffd43b', '#ffcf33', '#f9c600'];
    var particles = [];
    for (var i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * -window.innerHeight * 0.5,
            size: 6 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 6,
            vy: 2 + Math.random() * 6,
            drag: 0.995,
            tilt: Math.random() * 0.5 - 0.25
        });
    }

    var start = performance.now();
    function frame(now) {
        var t = now - start;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.vy += 0.15; // gravity
            p.vx *= p.drag;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.tilt * 0.1;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
            ctx.restore();
        }

        if (t < durationMs) {
            requestAnimationFrame(frame);
        } else {
            // fade out then remove
            var fadeStart = performance.now();
            (function fade() {
                var ft = performance.now() - fadeStart;
                var alpha = Math.max(0, 1 - ft / 500);
                canvas.style.opacity = alpha;
                if (alpha > 0) requestAnimationFrame(fade);
                else {
                    window.removeEventListener('resize', resize);
                    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
                }
            })();
        }
    }
    requestAnimationFrame(frame);
}

// Function to handle button click events
function selectOption(option) {
    // Check which option was clicked
    if (option === 'yes') {
        // Play Yes sound (user gesture; ignore play errors)
        try {
            var playPromise = yesAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(function(){});
            }
        } catch (e) {}

        // Launch confetti and remove the letter box, then flash rainbow colors
        try { launchConfetti(); } catch (e) {}
        try {
            var letterBox = document.getElementById('letter-box');
            if (letterBox && letterBox.parentNode) letterBox.parentNode.removeChild(letterBox);
        } catch (e) {}
        flashRainbowColors(function() {
            document.getElementById('question').style.display = 'none'; // Hide the question
            displayCatHeart(); // Display the sanrio-pom-pom-purin.gif
        });
    } else if (option === 'no') {
        // Change text on the "No" button to "Seb, AreYou sure?"
        document.getElementById('no-button').innerText = 'Seb, Are You sure?'; 
        // Increase font size of "Yes" button
        var yesButton = document.getElementById('yes-button');
        var currentFontSize = window.getComputedStyle(yesButton).getPropertyValue('font-size');
        var newSize = parseFloat(currentFontSize) * 2; // Increase font size by  * 2px
        yesButton.style.fontSize = newSize + 'px';
    } else {
        // If neither "Yes" nor "No" was clicked, show an alert message
        alert('Invalid option!');
    }
}

// Function to flash rainbow colors and then execute a callback function
function flashRainbowColors(callback) {
    var colors = ['#ffff00', '#eed202', '#ffdf00', '#fdfd96', '#fcffa4', '#ffff31', '#f0e130'];
    var i = 0;
    var interval = setInterval(function() {
        document.body.style.backgroundColor = colors[i];
        i = (i + 1) % colors.length;
    }, 200); // Change color every 200 milliseconds
    setTimeout(function() {
        clearInterval(interval);
        document.body.style.backgroundColor = ''; // Reset background color
        if (callback) {
            callback();
        }
    }, 2000); // Flash colors for 2 seconds
}

// Function to display the pom-purin.gif initially
function displayCat() {
    // Get the container where the image will be displayed
    var imageContainer = document.getElementById('image-container');
    // Create a new Image element for the cat
    var catImage = new Image();
    // Set the source (file path) for the cat image
    catImage.src = 'pom-purin.gif'; // Assuming the cat image is named "pom-purin.gif"
    // Set alternative text for the image (for accessibility)
    catImage.alt = 'Pompurin';
    // When the cat image is fully loaded, add it to the image container
    catImage.onload = function() {
        imageContainer.appendChild(catImage);
    };
}

// Function to display the sanrio-pom-pom-purin.gif
function displayCatHeart() {
    // Clear existing content in the image container
    document.getElementById('image-container').innerHTML = '';
    // Get the container where the image will be displayed
    var imageContainer = document.getElementById('image-container');
    // Create a new Image element for the cat-heart
    var catHeartImage = new Image();
    // Set the source (file path) for the cat-heart image
    catHeartImage.src = 'sanrio-pom-pom-purin.gif'; // Assuming the cat-heart image is named "sanrio-pom-pom-purin.gi
    // Set alternative text for the image (for accessibility)
    catHeartImage.alt = 'Sanrio Pom Pom Purin';
    // When the cat-heart image is fully loaded, add it to the image container
    catHeartImage.onload = function() {
        imageContainer.appendChild(catHeartImage);
        // Add the valentine message under the image
        var msg = document.createElement('div');
        msg.id = 'valentine-message';
        msg.innerText = "You're my Valentines in Feb 14 2026 now Seb :3";
        msg.style.fontFamily = "'Sacramento', cursive";
        msg.style.fontSize = '28px';
        msg.style.color = '#b8860b';
        msg.style.marginTop = '12px';
        msg.style.textAlign = 'center';
        imageContainer.appendChild(msg);

        // Hide the options container
        document.getElementById('options').style.display = 'none';
    };
}

// Display the pom-purin.gif initially
displayCat();