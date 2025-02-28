let spinCount = 0;
let basePrice = 100;
let diamonds = 5000;
let isSpinning = false;
let forceIndex = null;
let isCheatActive = false;
let redeemedCodes = new Set();

let skins = [
    { name: "Blood Moon", rarity: "M1887-Sterling Conqueror", image: "h1.jpg", exchange: 1000 }, //1
    { name: "Cyber Slash", rarity: "M1887-Emerald Power", image: "h2.jpg", exchange: 50 },//4
    { name: "Thunder Strike", rarity: "M1887-Xtreme Adventure", image: "h3.jpg", exchange: 50 },//4
    { name: "Venom Edge", rarity: "M1887-Solaris Burst", image: "h4.jpg", exchange: 400 }, //2
    { name: "Obsidian Dagger", rarity: "M1887-Mata Elang", image: "h5.jpg", exchange: 50 },//4
    { name: "Glacier Fang", rarity: "M1887-Hand of Hope", image: "h6.jpg", exchange: 400 },//2
    { name: "Phantom Blade", rarity: "M1887-Winterlands 2020", image: "h7.jpg", exchange: 200 },//3
    { name: "Shadow Fang", rarity: "M1887-Incendium Burst", image: "h8.jpg", exchange: 50 },//4
    { name: "Inferno Fang", rarity: "M1887-Golden Glare", image: "h9.jpg", exchange: 400 },//2
    { name: "Dragon Claw", rarity: "M1887-Terrano Burst", image: "h10.jpg", exchange: 50 }//4
];



let boxes = skins.map((_, i) => document.getElementById(`h${i + 1}`));
let index = 0;

let diamondDisplay = document.getElementById("diamond-count");
let spinButton = document.getElementById("spin-button");
let cheatMenu = document.getElementById("cheat-menu");

function updateUI() {
    diamondDisplay.textContent = diamonds;
    let price = 100;
    spinButton.innerHTML = `
        <span style="display: flex; align-items: center; justify-content: space-between; width: 20%; padding: 5px 55px;">
            <img src='dm.png' style='width: 20px; margin-right: auto;'>
            <span style="margin-left: auto;">${price}</span>
        </span>
    `;
}

function showPopup(skin) {
    document.getElementById("popup-title").innerText = "Selamat!";
    document.getElementById("popup-rarity").innerText = `${skin.rarity}`;
    document.getElementById("popup-image").src = skin.image;
    document.getElementById("popup-sell").innerText = `Jual ${skin.exchange} DM`;
    document.getElementById("popup-sell").setAttribute("data-exchange", skin.exchange);
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function sellItem() {
    let price = parseInt(document.getElementById("popup-sell").getAttribute("data-exchange"));
    diamonds += price;
    updateUI();
    closePopup();
}

function spin() {
    if (isSpinning) return;
    let price = 100;
    if (diamonds < price) {
        alert("Diamond tidak cukup!");
        return;
    }

    diamonds -= price;
    spinCount++;
    updateUI();
    isSpinning = true;

    let totalSteps = 20 + Math.floor(Math.random() * 10);
    let finalIndex = forceIndex !== null ? forceIndex : getRandomSkinIndex();
    let delay = 50;
    let i = 0;

    function animateSpin() {
        boxes.forEach(box => box.classList.remove("active", "winner"));
        boxes[index].classList.add("active");
        i++;

        if (i < totalSteps || index !== finalIndex) {
            let progress = i / totalSteps;
            delay = 50 + easeOutExpo(progress) * 10;
            index = (index + 1) % boxes.length;
            setTimeout(animateSpin, delay);
        } else {
            setTimeout(() => {
                boxes.forEach(box => box.classList.remove("active"));
                boxes[finalIndex].classList.add("winner");
                isSpinning = false;
                showPopup(skins[finalIndex]);
            }, 300);
        }
    }
    animateSpin();
}

function getRandomSkinIndex() {
    let chance = Math.random() * 100;
    if (chance <= 1) return skins.findIndex(s => s.rarity === "M1887-Sterling Conqueror");
    if (chance <= 10) return skins.findIndex(s => s.rarity === "M1887-Solaris Burst");
    if (chance <= 15) return skins.findIndex(s => s.rarity === "M1887-Hand of Hope");
    if (chance <= 20) return skins.findIndex(s => s.rarity === "M1887-Golden Glare");
    if (chance <= 25) return skins.findIndex(s => s.rarity === "M1887-Winterlands 2020");
    if (chance <= 85) return skins.findIndex(s => s.rarity === "M1887-Emerald Power");
    if (chance <= 90) return skins.findIndex(s => s.rarity === "M1887-Incendium Burst");
    if (chance <= 95) return skins.findIndex(s => s.rarity === "M1887-Mata Elang");
    if (chance <= 100) return skins.findIndex(s => s.rarity === "M1887-Terrano Burst");
    return skins.findIndex(s => s.rarity === "M1887-Xtreme Adventure");
}

function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function processCode() {
    let code = document.getElementById("code-input").value;
    if (code === "404") {
        isCheatActive = true;
        cheatMenu.style.display = "block";
        return;
    }

    let rewards = { "072154": 500, "452180": 1000, "235168": 10000 };
    if (redeemedCodes.has(code)) {
        alert("Kode sudah digunakan!");
        return;
    }

    if (rewards[code]) {
        diamonds += rewards[code];
        redeemedCodes.add(code);
        updateUI();
        alert(`Selamat! Anda mendapatkan ${rewards[code]} DM.`);
    } else {
        alert("Kode tidak valid!");
    }
}

function closeCheatMenu() {
    cheatMenu.style.display = "none";
}

function applyCheat() {
    if (!isCheatActive) {
        alert("Aktifkan cheat dulu dengan kode 404!");
        return;
    }

    let cheatSpin = document.getElementById("cheat-spin").value;
    let cheatDM = document.getElementById("cheat-dm").value;

    if (cheatSpin !== "") forceIndex = parseInt(cheatSpin);
    if (cheatDM !== "") {
        diamonds = parseInt(cheatDM);
        updateUI();
    }

    alert("Cheat diterapkan!");
}

function resetCheat() {
    diamonds = 5000;
    forceIndex = null;
    updateUI();
    document.getElementById("cheat-dm").value = "";
    document.getElementById("cheat-spin").value = "";
    alert("Cheat telah direset!");
}

updateUI();
