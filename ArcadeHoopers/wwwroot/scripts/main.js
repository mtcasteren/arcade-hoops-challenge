console.log("🏀 STEP 1: JavaScript file is loading...");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

console.log("🏀 STEP 2: Firebase imports successful!");

const firebaseConfig = {
    apiKey: "AIzaSyB0wvjq16ZFLgYI_3ch5QbHzUX_QA3S7YM",
    authDomain: "basketball-arcade-2024.firebaseapp.com",
    databaseURL: "https://basketball-arcade-2024-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "basketball-arcade-2024",
    storageBucket: "basketball-arcade-2024.firebasestorage.app",
    messagingSenderId: "282226816298",
    appId: "1:282226816298:web:6af47b2f6220127ef31a53",
    measurementId: "G-D4V2DBTTHX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("🏀 STEP 3: Firebase initialized!");
let playerName = "";
let playerId = "";
let score = 0;
let round = 0;
let timeLeft = 0;
let pointsPerShot = 1;
let targetScore = 0;
let timerInterval;
let canShoot = false;

const rounds = [
    { round: 1, duration: 90, points: 1, target: 30 },
    { round: 2, duration: 60, points: 2, target: 50 },
    { round: 3, duration: 30, points: 3, target: 100 },
];


function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn("Storage not available:", e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.warn("Storage not available:", e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.warn("Storage not available:", e);
        return false;
    }
}

function generateID() {
    return "P" + Math.floor(100000 + Math.random() * 900000);
}

function resetGameData() {
    score = 0;
    round = 0;
    timeLeft = 0;
    pointsPerShot = 1;
    targetScore = 0;
    canShoot = false;
    clearInterval(timerInterval);

    document.getElementById("scoreDisplay").textContent = "0";
    document.getElementById("roundDisplay").textContent = "ROUND --";
    document.getElementById("timerDisplay").textContent = "00s";
    document.getElementById("messageDisplay").textContent = "";
    document.getElementById("highScore").textContent = "0";
    document.getElementById("rankTier").textContent = "Bronze";
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("🏀 STEP 4: DOM is ready!");

    // --- DOM Elements ---
    const homepage = document.getElementById("homepage");
    const gameContent = document.getElementById("gameContent");
    const enterGameBtn = document.getElementById("enterGameBtn");
    const loginOverlay = document.getElementById("loginOverlay");

    // Choice section
    const choiceSection = document.getElementById("choiceSection");
    const goToRegisterBtn = document.getElementById("goToRegisterBtn");
    const goToLoginBtn = document.getElementById("goToLoginBtn");
    const choiceBackBtn = document.getElementById("choiceBackBtn");
    const choiceCloseBtn = document.getElementById("choiceCloseBtn");

    // Register section
    const registerSection = document.getElementById("registerSection");
    const regNameInput = document.getElementById("regNameInput");
    const regPasswordInput = document.getElementById("regPasswordInput");
    const regConfirmPasswordInput = document.getElementById("regConfirmPasswordInput");
    const registerSubmitBtn = document.getElementById("registerSubmitBtn");
    const registerBackBtn = document.getElementById("registerBackBtn");
    const registerError = document.getElementById("registerError");
    const registerCloseBtn = document.getElementById("registerCloseBtn");

    // Login section
    const loginSection = document.getElementById("loginSection");
    const loginNameInput = document.getElementById("loginNameInput");
    const loginPasswordInput = document.getElementById("loginPasswordInput");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
    const loginBackBtn = document.getElementById("loginBackBtn");
    const loginError = document.getElementById("loginError");
    const loginCloseBtn = document.getElementById("loginCloseBtn");

    // Forgot password section
    const forgotPasswordSection = document.getElementById("forgotPasswordSection");
    const forgotNameInput = document.getElementById("forgotNameInput");
    const newPasswordInput = document.getElementById("newPasswordInput");
    const confirmNewPasswordInput = document.getElementById("confirmNewPasswordInput");
    const resetPasswordBtn = document.getElementById("resetPasswordBtn");
    const forgotBackBtn = document.getElementById("forgotBackBtn");
    const forgotError = document.getElementById("forgotError");
    const forgotCloseBtn = document.getElementById("forgotCloseBtn");

    const playerNameDisplay = document.getElementById("playerName");
    const playerIdDisplay = document.getElementById("playerId");
    const logoutBtn = document.getElementById("logoutBtn");
    const messageOverlay = document.getElementById("messageOverlay");
    const messageTitle = document.getElementById("messageTitle");
    const messageSubtitle = document.getElementById("messageSubtitle");
    const countdownOverlay = document.getElementById("countdownOverlay");
    const countText = document.getElementById("countText");

    console.log("🏀 STEP 5: All elements found:", {
        enterGameBtn: !!enterGameBtn,
        loginOverlay: !!loginOverlay,
        registerSection: !!registerSection
    });

    // --- FUNCTION TO CLOSE ALL MODALS ---
    function closeAllModals() {
        console.log("✕ Close button clicked - closing all forms");
        choiceSection.classList.remove("show");
        registerSection.classList.remove("show");
        loginSection.classList.remove("show");
        forgotPasswordSection.classList.remove("show");
        loginOverlay.classList.remove("show");

        // Hide all sections properly
        setTimeout(() => {
            choiceSection.style.display = "none";
            registerSection.style.display = "none";
            loginSection.style.display = "none";
            forgotPasswordSection.style.display = "none";
        }, 300);

        // Clear all inputs
        regNameInput.value = "";
        regPasswordInput.value = "";
        regConfirmPasswordInput.value = "";
        loginNameInput.value = "";
        loginPasswordInput.value = "";
        forgotNameInput.value = "";
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";

        // Clear all errors
        registerError.textContent = "";
        loginError.textContent = "";
        forgotError.textContent = "";
    }

    // --- ADD CLOSE BUTTON EVENT LISTENERS ---
    choiceCloseBtn.addEventListener("click", closeAllModals);
    registerCloseBtn.addEventListener("click", closeAllModals);
    loginCloseBtn.addEventListener("click", closeAllModals);
    forgotCloseBtn.addEventListener("click", closeAllModals);

    // --- ANIMATED MESSAGE OVERLAY ---
    function showMessage(title, subtitle, duration = 2000) {
        console.log("📢 Showing message:", title, subtitle);
        messageTitle.textContent = title;
        messageSubtitle.textContent = subtitle;
        messageOverlay.classList.add("show");

        setTimeout(() => {
            messageOverlay.classList.remove("show");
        }, duration);
    }

    // --- COUNTDOWN OVERLAY WITH BOUNCING BASKETBALL ---
    function showCountdown(count) {
        return new Promise((resolve) => {
            if (count === "GO!") {
                countText.innerHTML = `<div style="animation: bounceIn 0.5s ease-out;">🏀</div><div style="margin-top: 20px;">${count}</div>`;
            } else {
                countText.innerHTML = `<div style="animation: basketballBounce 0.8s ease-in-out;">🏀</div><div style="margin-top: 20px; animation: numberPop 0.8s ease-out;">${count}</div>`;
            }
            countdownOverlay.classList.add("show");

            setTimeout(() => {
                countdownOverlay.classList.remove("show");
                resolve();
            }, 900);
        });
    }

    async function runCountdown() {
        canShoot = false;
        await showCountdown("3");
        await showCountdown("2");
        await showCountdown("1");
        await showCountdown("GO!");
        canShoot = true;
    }

    // --- PLAY NOW BUTTON - Shows CHOICE Section ---
    enterGameBtn.addEventListener("click", () => {
        console.log("🎮 PLAY NOW CLICKED!");

        // Check if already logged in
        const savedName = getFromStorage("playerName");
        const savedId = getFromStorage("playerId");

        if (savedName && savedId) {
            // Already logged in - go straight to game
            console.log("✅ Already logged in - entering game");
            playerName = savedName;
            playerId = savedId;
            playerNameDisplay.textContent = savedName;
            playerIdDisplay.textContent = savedId;
            logoutBtn.style.display = "block";

            homepage.classList.add("hidden");
            gameContent.classList.add("active");
        } else {
            // Not logged in - show CHOICE buttons
            console.log("❌ Not logged in - showing choice section");
            loginOverlay.classList.add("show");
            choiceSection.style.display = "block";
            choiceSection.classList.add("show");
        }
    });

    // --- CHOICE SECTION BUTTONS ---
    goToRegisterBtn.addEventListener("click", () => {
        console.log("📝 Go to Create Account clicked");
        choiceSection.classList.remove("show");
        setTimeout(() => {
            choiceSection.style.display = "none";
            registerSection.style.display = "block";
            registerSection.classList.add("show");
            setTimeout(() => {
                regNameInput.focus();
            }, 100);
        }, 300);
    });

    goToLoginBtn.addEventListener("click", () => {
        console.log("🔐 Go to Login clicked");
        choiceSection.classList.remove("show");
        setTimeout(() => {
            choiceSection.style.display = "none";
            loginSection.style.display = "block";
            loginSection.classList.add("show");
            setTimeout(() => {
                loginNameInput.focus();
            }, 100);
        }, 300);
    });

    choiceBackBtn.addEventListener("click", () => {
        console.log("⬅️ Choice back clicked");
        choiceSection.classList.remove("show");
        loginOverlay.classList.remove("show");
        setTimeout(() => {
            choiceSection.style.display = "none";
        }, 300);
    });

    // --- REGISTER BACK BUTTON ---
    registerBackBtn.addEventListener("click", () => {
        console.log("⬅️ Register back clicked");
        registerSection.classList.remove("show");
        setTimeout(() => {
            registerSection.style.display = "none";
            choiceSection.style.display = "block";
            choiceSection.classList.add("show");
        }, 300);
        regNameInput.value = "";
        regPasswordInput.value = "";
        regConfirmPasswordInput.value = "";
        registerError.textContent = "";
    });

    // --- LOGIN BACK BUTTON ---
    loginBackBtn.addEventListener("click", () => {
        console.log("⬅️ Login back clicked");
        loginSection.classList.remove("show");
        setTimeout(() => {
            loginSection.style.display = "none";
            choiceSection.style.display = "block";
            choiceSection.classList.add("show");
        }, 300);
        loginNameInput.value = "";
        loginPasswordInput.value = "";
        loginError.textContent = "";
    });

    // --- FORGOT PASSWORD BACK BUTTON ---
    forgotBackBtn.addEventListener("click", () => {
        console.log("⬅️ Forgot password back clicked");
        forgotPasswordSection.classList.remove("show");
        loginSection.classList.add("show");
        forgotNameInput.value = "";
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";
        forgotError.textContent = "";
    });

    // Click on overlay to close all forms
    loginOverlay.addEventListener("click", closeAllModals);

    // --- CREATE ACCOUNT (REGISTER) ---
    registerSubmitBtn.addEventListener("click", async () => {
        console.log("📝 Create account clicked!");
        const name = regNameInput.value.trim();
        const password = regPasswordInput.value.trim();
        const confirmPassword = regConfirmPasswordInput.value.trim();

        registerError.textContent = "";

        if (!name || !password || !confirmPassword) {
            registerError.textContent = "Please fill in all fields!";
            return;
        }

        if (password.length < 4) {
            registerError.textContent = "Password must be at least 4 characters!";
            return;
        }

        if (password !== confirmPassword) {
            registerError.textContent = "Passwords do not match!";
            return;
        }

        try {
            // Check if username already exists
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const users = snapshot.val();
                const userExists = Object.values(users).some(u => u.name.toLowerCase() === name.toLowerCase());

                if (userExists) {
                    registerError.textContent = "Username already taken! Please choose another.";
                    return;
                }
            }

            // Create new account
            const id = generateID();
            await set(ref(db, "users/" + id), {
                name: name,
                password: password,
                createdAt: Date.now()
            });

            console.log("✅ Account created successfully!");

            // Clear register form password fields only
            regPasswordInput.value = "";
            regConfirmPasswordInput.value = "";
            registerError.textContent = "";

            // Hide register, show login form
            registerSection.classList.remove("show");

            // Keep overlay visible and show login immediately
            setTimeout(() => {
                registerSection.style.display = "none";
                loginSection.style.display = "block";
                loginSection.classList.add("show");
                // Pre-fill username in login form
                loginNameInput.value = name;
                setTimeout(() => {
                    loginPasswordInput.focus();
                }, 100);
            }, 300);

            // Clear register name field after transferring to login
            regNameInput.value = "";

            showMessage(`ACCOUNT CREATED!`, "Now please login to start playing", 2500);

        } catch (error) {
            console.error("❌ Registration error:", error);
            registerError.textContent = "Registration failed. Please try again.";
        }
    });

    // --- LOGIN ---
    loginSubmitBtn.addEventListener("click", async () => {
        console.log("🔐 Login clicked!");
        const name = loginNameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        loginError.textContent = "";

        if (!name || !password) {
            loginError.textContent = "Please enter both username and password!";
            return;
        }

        try {
            // Check credentials in Firebase
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (!snapshot.exists()) {
                loginError.textContent = "No accounts found. Please register first!";
                return;
            }

            const users = snapshot.val();
            let foundUser = null;
            let foundId = null;

            // Find user with matching name and password
            for (const [id, user] of Object.entries(users)) {
                if (user.name.toLowerCase() === name.toLowerCase() && user.password === password) {
                    foundUser = user;
                    foundId = id;
                    break;
                }
            }

            if (!foundUser) {
                loginError.textContent = "Invalid username or password!";
                return;
            }

            // Login successful
            playerName = foundUser.name;
            playerId = foundId;

            resetGameData();

            saveToStorage("playerName", foundUser.name);
            saveToStorage("playerId", foundId);

            playerNameDisplay.textContent = foundUser.name;
            playerIdDisplay.textContent = foundId;

            console.log("✅ Login successful!");

            // Clear inputs
            loginNameInput.value = "";
            loginPasswordInput.value = "";

            // Remove show class first (triggers fade out animation)
            loginSection.classList.remove("show");
            loginOverlay.classList.remove("show");

            // Wait for animation then completely hide
            setTimeout(() => {
                loginSection.style.display = "none";
                loginOverlay.style.display = "none";
                choiceSection.style.display = "none";
                registerSection.style.display = "none";
                forgotPasswordSection.style.display = "none";
            }, 300);

            // Show game content immediately
            homepage.classList.add("hidden");
            gameContent.classList.add("active");
            logoutBtn.style.display = "block";

            showMessage(`WELCOME BACK ${foundUser.name.toUpperCase()}!`, "GET READY FOR 3 ROUND SHOOT!", 3000);

        } catch (error) {
            console.error("❌ Login error:", error);
            loginError.textContent = "Login failed. Please try again.";
        }
    });

    // --- FORGOT PASSWORD BUTTON ---
    forgotPasswordBtn.addEventListener("click", () => {
        console.log("🔑 Forgot password clicked");
        loginSection.classList.remove("show");
        forgotPasswordSection.classList.add("show");
        loginError.textContent = "";
        setTimeout(() => {
            forgotNameInput.focus();
        }, 100);
    });

    // --- RESET PASSWORD ---
    resetPasswordBtn.addEventListener("click", async () => {
        console.log("🔄 Reset password clicked!");
        const name = forgotNameInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmNewPassword = confirmNewPasswordInput.value.trim();

        forgotError.textContent = "";

        if (!name || !newPassword || !confirmNewPassword) {
            forgotError.textContent = "Please fill in all fields!";
            return;
        }

        if (newPassword.length < 4) {
            forgotError.textContent = "Password must be at least 4 characters!";
            return;
        }

        if (newPassword !== confirmNewPassword) {
            forgotError.textContent = "Passwords do not match!";
            return;
        }

        try {
            // Find user by username
            const usersRef = ref(db, "users");
            const snapshot = await get(usersRef);

            if (!snapshot.exists()) {
                forgotError.textContent = "Username not found!";
                return;
            }

            const users = snapshot.val();
            let foundId = null;

            // Find user with matching name
            for (const [id, user] of Object.entries(users)) {
                if (user.name.toLowerCase() === name.toLowerCase()) {
                    foundId = id;
                    break;
                }
            }

            if (!foundId) {
                forgotError.textContent = "Username not found!";
                return;
            }

            // Update password
            await set(ref(db, "users/" + foundId + "/password"), newPassword);

            console.log("✅ Password reset successful!");

            // Clear forgot password form
            forgotNameInput.value = "";
            newPasswordInput.value = "";
            confirmNewPasswordInput.value = "";
            forgotError.textContent = "";

            // Hide forgot password, show login form
            forgotPasswordSection.classList.remove("show");
            loginSection.classList.add("show");

            // Pre-fill username in login form
            loginNameInput.value = name;
            loginPasswordInput.focus();

            showMessage(`PASSWORD RESET!`, "Please login with your new password", 2500);

        } catch (error) {
            console.error("❌ Password reset error:", error);
            forgotError.textContent = "Password reset failed. Please try again.";
        }
    });

    // Enter key handlers for Register/Create Account
    regNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            regPasswordInput.focus();
        }
    });

    regPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            regConfirmPasswordInput.focus();
        }
    });

    regConfirmPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            registerSubmitBtn.click();
        }
    });

    // Enter key handlers for Login
    loginNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            loginPasswordInput.focus();
        }
    });

    loginPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            loginSubmitBtn.click();
        }
    });

    // Enter key handlers for Forgot Password
    forgotNameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            newPasswordInput.focus();
        }
    });

    newPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            confirmNewPasswordInput.focus();
        }
    });

    confirmNewPasswordInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            resetPasswordBtn.click();
        }
    });

    // LOGOUT
    logoutBtn.addEventListener("click", () => {
        console.log("👋 Logout clicked");
        removeFromStorage("playerName");
        removeFromStorage("playerId");

        playerName = "";
        playerId = "";
        playerNameDisplay.textContent = "Guest";
        playerIdDisplay.textContent = "-";

        homepage.classList.remove("hidden");
        gameContent.classList.remove("active");
        logoutBtn.style.display = "none";

        resetGameData();
    });

    // --- GAMEPLAY LOGIC ---
    document.getElementById("startGameBtn").addEventListener("click", async () => {
        console.log("🎮 Start Game clicked");
        if (!playerId) {
            showMessage("⚠️ LOGIN REQUIRED", "Please log in first!", 2000);
            return;
        }

        score = 0;
        round = 0;
        canShoot = false;
        document.getElementById("scoreDisplay").textContent = score;

        showMessage("🏀 GAME STARTING!", "READY FOR 3 ROUNDS TO SHOOT!", 2000);

        // 🔥 SEND START_GAME COMMAND TO ARDUINO VIA ESP32!
        try {
            console.log("📤 Sending START_GAME to Firebase for ESP32...");
            await set(ref(db, "arduino/command"), "START_GAME");
            console.log("✅ START_GAME command sent to Firebase!");
        } catch (error) {
            console.error("❌ Failed to send START_GAME:", error);
        }

        setTimeout(() => {
            startNextRound();
        }, 2000);
    });

    async function startNextRound() {
        round++;

        if (round > rounds.length) {
            canShoot = false;
            showMessage("🏁 GAME OVER!", `Final Score: ${score}`, 3000);

            // 🔥 SEND END_GAME COMMAND TO ARDUINO VIA ESP32!
            try {
                console.log("📤 Sending END_GAME to Firebase for ESP32...");
                await set(ref(db, "arduino/command"), "END_GAME");
                console.log("✅ END_GAME command sent to Firebase!");
            } catch (error) {
                console.error("❌ Failed to send END_GAME:", error);
            }

            try {
                await set(ref(db, "players/" + playerId), {
                    name: playerName,
                    score: score,
                    timestamp: Date.now()
                });
                console.log("✅ Score saved to Firebase");
            } catch (error) {
                console.error("❌ Failed to save score:", error);
            }
            return;
        }

        const current = rounds[round - 1];
        timeLeft = current.duration;
        pointsPerShot = current.points;
        targetScore = current.target;

        document.getElementById("roundDisplay").textContent = `Round ${current.round}`;
        document.getElementById("timerDisplay").textContent = `${timeLeft}s`;

        showMessage(`🎯 ROUND ${round}`, `Target: ${targetScore} points!`, 2000);

        setTimeout(async () => {
            document.getElementById("messageDisplay").textContent = "Get ready...";
            await runCountdown();
            document.getElementById("messageDisplay").textContent = `Round ${round} - SHOOT NOW!`;
            startTimer();
        }, 2000);
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                document.getElementById("timerDisplay").textContent = `${timeLeft}s`;
            } else {
                clearInterval(timerInterval);
                canShoot = false;
                handleRoundEnd();
            }
        }, 1000);
    }

    async function handleRoundEnd() {
        if (score >= targetScore) {
            if (round < rounds.length) {
                showMessage(`🎯 ROUND ${round} COMPLETE!`, "Get ready for the next round!", 2500);
                setTimeout(() => {
                    startNextRound();
                }, 2500);
            } else {
                showMessage("🏁 GAME COMPLETE!", `Final Score: ${score}`, 3000);

                // 🔥 SEND END_GAME COMMAND
                try {
                    await set(ref(db, "arduino/command"), "END_GAME");
                } catch (error) {
                    console.error("Failed to send END_GAME:", error);
                }

                try {
                    await set(ref(db, "players/" + playerId), {
                        name: playerName,
                        score: score,
                        timestamp: Date.now()
                    });
                } catch (error) {
                    console.error("Failed to save score:", error);
                }
            }
        } else if (round < rounds.length) {
            showMessage(`⏰ TIME'S UP!`, `You can continue to Round ${round + 1}`, 2500);
            setTimeout(() => {
                startNextRound();
            }, 2500);
        } else {
            showMessage("🏁 GAME OVER!", `Final Score: ${score}`, 3000);

            // 🔥 SEND END_GAME COMMAND
            try {
                await set(ref(db, "arduino/command"), "END_GAME");
            } catch (error) {
                console.error("Failed to send END_GAME:", error);
            }

            try {
                await set(ref(db, "players/" + playerId), {
                    name: playerName,
                    score: score,
                    timestamp: Date.now()
                });
            } catch (error) {
                console.error("Failed to save score:", error);
            }
        }
    }

    // ========================================
    // LISTEN FOR SHOT DETECTION FROM ESP32
    // ========================================
    const shotDetectionRef = ref(db, "gameState/shotDetected");

    console.log("👂 Setting up shot detection listener...");

    onValue(shotDetectionRef, async (snapshot) => {
        const shotData = snapshot.val();

        // Check if valid shot
        if (shotData &&
            shotData.detected === true &&
            shotData.playerId === playerId &&
            canShoot &&
            round > 0) {

            console.log("🏀 SHOT DETECTED from ESP32!");
            console.log("   Player:", shotData.playerName);
            console.log("   Round:", shotData.round);

            // Add points
            score += pointsPerShot;
            document.getElementById("scoreDisplay").textContent = score;

            // Visual feedback
            const scoreEl = document.getElementById("scoreDisplay");
            scoreEl.style.transform = "scale(1.3)";
            scoreEl.style.color = "green";
            setTimeout(() => {
                scoreEl.style.transform = "scale(1)";
                scoreEl.style.color = "black";
            }, 300);

            // Save score to Firebase
            try {
                await set(ref(db, "players/" + playerId), {
                    name: playerName,
                    score: score,
                    timestamp: Date.now()
                });
                console.log("✅ Score saved:", score);
            } catch (error) {
                console.error("❌ Failed to save score:", error);
            }

            // Clear shot detection (IMPORTANT!)
            try {
                await set(ref(db, "gameState/shotDetected"), null);
                console.log("✅ Shot flag cleared");
            } catch (error) {
                console.error("❌ Failed to clear shot:", error);
            }
        }
    });

    console.log("✅ Shot detection listener active!");

    // --- END GAME BUTTON ---
    document.getElementById("endGameBtn").addEventListener("click", async () => {
        if (round === 0) {
            showMessage("⚠️ NOT STARTED", "No game to end!", 1500);
            return;
        }

        clearInterval(timerInterval);
        canShoot = false;
        showMessage("🏁 GAME ENDED!", `Final Score: ${score}`, 3000);

        // 🔥 SEND END_GAME COMMAND
        try {
            await set(ref(db, "arduino/command"), "END_GAME");
            console.log("✅ END_GAME command sent");
        } catch (error) {
            console.error("Failed to send END_GAME:", error);
        }

        try {
            await set(ref(db, "players/" + playerId), {
                name: playerName,
                score: score,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("Failed to save score:", error);
        }

        round = 0;
        document.getElementById("roundDisplay").textContent = "ROUND --";
        document.getElementById("messageDisplay").textContent = "";
    });

    // --- LEADERBOARD ---
    const leaderboardRef = ref(db, "players");
    onValue(leaderboardRef, (snapshot) => {
        try {
            const data = snapshot.val();
            if (!data) {
                const list = document.getElementById("leaderboardList");
                list.innerHTML = "<li>No players yet!</li>";
                return;
            }

            const sorted = Object.values(data).sort((a, b) => b.score - a.score);
            const list = document.getElementById("leaderboardList");
            list.innerHTML = "";

            sorted.slice(0, 10).forEach((p, i) => {
                const li = document.createElement("li");
                li.textContent = `${i + 1}. ${p.name} — ${p.score}`;
                li.style.marginBottom = "8px";
                list.appendChild(li);
            });
            console.log("✅ Leaderboard updated");
        } catch (error) {
            console.error("❌ Leaderboard error:", error);
        }
    });

    // Check if already logged in on page load
    const savedName = getFromStorage("playerName");
    const savedId = getFromStorage("playerId");

    if (savedName && savedId) {
        playerName = savedName;
        playerId = savedId;
        playerNameDisplay.textContent = savedName;
        playerIdDisplay.textContent = savedId;
        console.log("✅ Auto-loaded saved login");
    }

    console.log("🏀 STEP 6: Basketball Arcade fully loaded and ready!");
    console.log("📡 Firebase listening to:");
    console.log("   - arduino/command (sending commands to ESP32)");
    console.log("   - arduino/shotDetected (receiving shots from Arduino)");
    console.log("========================================");
});