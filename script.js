
let score = 0, xp = 0, level = 1, xpNeeded = 100;
let trees = 0, solar = 0, windTurbines = 0, hydroPlants = 0, researchCenter = 0;
let energy = 0, innovation = 0;

let startValues = {
    score: 0,
    trees: 0,
    solar: 0,
    windTurbines: 0,
    hydroPlants: 0,
    researchCenter: 0
};

let cooldowns = {
    trees: 4000, // 15 sec
    solar: 10000, // 20 sec
    windTurbines: 15000, // 25 sec
    hydroPlants: 30000, // 30 sec
    researchCenter: 35000 // 35 sec
};

// Objet pour suivre les délais d'achat
let lastPurchaseTime = {};

document.getElementById("clicker").addEventListener("click", function() {
    score += 1;
    xp += 5;
    checkLevelUp();
    updateDisplay();
});

document.getElementById("clicker").addEventListener("click", function(event) {
    // 🔊 Joue le son
    document.getElementById("clickSound").play();

    // 💥 Ajoute l'effet de clic
    this.style.animation = "clickEffect 0.2s ease-out";

    // 🔥 Génère des particules autour du clicker
    for (let i = 0; i < 5; i++) {
        createParticle(event.clientX, event.clientY);
    }
});
function resetGame() {
    // 🔄 Remet toutes les valeurs à zéro
    score = 0;
    xp = 0;
    level = 1;
    xpNeeded = 100;
    trees = 0;
    solar = 0;
    windTurbines = 0;
    hydroPlants = 0;
    researchCenter = 0;
    energy = 0;
    innovation = 0;

    // 🔊 Joue un son de reset
    document.getElementById("resetSound").play();

    // 💥 Petit effet sur le bouton
    let resetBtn = document.querySelector(".btn-reset");
    resetBtn.style.animation = "clickEffect 0.3s ease-out";

    // ✅ Mise à jour de l'affichage
    updateDisplay();

    // 🎉 Ajoute un événement "Réinitialisation"
    addEvent("🔄 Jeu réinitialisé !");
}

/* ✅ Effet de particules amélioré pour mobile et desktop */
document.getElementById("clicker").addEventListener("click", (event) => {
    generateParticles(event.clientX, event.clientY);
});

// ✅ Ajout pour mobile (tactile)
document.getElementById("clicker").addEventListener("touchstart", (event) => {
    let touch = event.touches[0]; // Prend le premier toucher
    generateParticles(touch.clientX, touch.clientY);
});

/* 🎇 Fonction pour créer des particules au bon endroit */
function generateParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        createParticle(x, y);
    }
}


/* 🔥 Fonction pour créer des particules lumineuses */
function createParticle(x, y) {
    let particle = document.createElement("div");
    particle.classList.add("click-effect");
    document.body.appendChild(particle);

    // Position aléatoire autour du clicker
    let angle = Math.random() * 2 * Math.PI;
    let radius = Math.random() * 30;
    particle.style.left = `${x + Math.cos(angle) * radius - 5}px`;
    particle.style.top = `${y + Math.sin(angle) * radius - 5}px`;

    // Supprime l'effet après l'animation
    setTimeout(() => {
        particle.remove();
    }, 500);
}


function buyUpgrade(vertCost, innoCost, energyCost, type) {
    let now = Date.now();

    if (score >= vertCost && innovation >= innoCost && energy >= energyCost) {
        // ✅ Déduction des ressources
        score -= vertCost;
        innovation -= innoCost;
        energy -= energyCost;

        // ✅ Ajout de l'élément acheté
        if (type === 'trees') trees++;
        if (type === 'solar') solar++;
        if (type === 'windTurbines') windTurbines++;
        if (type === 'hydroPlants') hydroPlants++;
        if (type === 'researchCenter') researchCenter++;

         // 🔊 Joue le son d'achat
            document.getElementById("buySound").play();
        
        // ✅ Enregistre le temps d'achat
        lastPurchaseTime[type] = now;

        // ✅ Active le cooldown visuel sur le bouton
        startCooldownVisual(type);

        updateDisplay();
    } else {
        showErrorPopup("❌ Pas assez de ressources !");
    }
}
function startCooldownVisual(type) {
    let button = document.querySelector(`.btn-${type}`);
    
    if (!button) return;

    // Vérifie si un overlay est déjà présent et le supprime avant d'en ajouter un nouveau
    let existingOverlay = button.querySelector(".cooldown-overlay");
    if (existingOverlay) {
        button.removeChild(existingOverlay);
    }

    // Crée un nouvel overlay
    let cooldownOverlay = document.createElement("div");
    cooldownOverlay.classList.add("cooldown-overlay");
    button.appendChild(cooldownOverlay);
    
    // Animation de l'overlay (réduction de la hauteur)
    cooldownOverlay.style.animation = `cooldown ${cooldowns[type] / 1000}s linear forwards`;
    
    // Désactive le bouton temporairement
    button.disabled = true;

    // Réactive le bouton après le cooldown
    setTimeout(() => {
        button.removeChild(cooldownOverlay);
        button.disabled = false;
    }, cooldowns[type]);
}

/* ✅ Fonction pour afficher et gérer la popup d'erreur */
function showErrorPopup(message) {
    let popup = document.getElementById("popupError");
    let backdrop = document.getElementById("popupBackdrop");

    // ✅ Mise à jour du message
    popup.innerText = message;

    // ✅ Ajoute les classes pour rendre visible
    popup.classList.add("show");
    backdrop.classList.add("show");

    // ✅ Ajoute un event listener pour permettre la fermeture en cliquant sur le backdrop
    backdrop.addEventListener("click", closeErrorPopup);

    // ✅ Auto-fermeture après 3 secondes (si pas cliqué avant)
    setTimeout(closeErrorPopup, 3000);
}

/* ✅ Fonction pour fermer la popup et retirer l'event listener */
function closeErrorPopup() {
    let popup = document.getElementById("popupError");
    let backdrop = document.getElementById("popupBackdrop");

    // ✅ Supprime la classe "show"
    popup.classList.remove("show");
    backdrop.classList.remove("show");

    // ✅ Supprime l'écouteur d'événements pour éviter les accumulations
    backdrop.removeEventListener("click", closeErrorPopup);
}




function checkLevelUp() {
    if (xp >= xpNeeded) {
        level++;
        xp -= xpNeeded;
        xpNeeded = level * 100;
        addEvent(`🎉 Niveau ${level} atteint !`);
    }
    document.getElementById("xpBar").style.width = (xp / xpNeeded) * 100 + "%";
}

let isLeft = true; // ✅ Variable pour alterner les messages

function addEvent(text) {
    let eventLog = document.getElementById("eventLog");
    let newEvent = document.createElement("li");
    newEvent.innerText = text;

    // ✅ Alterne entre gauche et droite à chaque message
    if (isLeft) {
        newEvent.classList.add("message-left");
    } else {
        newEvent.classList.add("message-right");
    }
    isLeft = !isLeft; // ✅ Change le côté pour le prochain message

    eventLog.prepend(newEvent);

    // Jouer le son à chaque nouvel événement 🔊
    document.getElementById("eventSound").play();

    // ✅ Augmente le nombre d'événements visibles (10 au lieu de 6)
    if (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}


// // Liste des objectifs possibles
// const objectivesList = [
//     { text: "Planter 5 arbres", type: "trees", goal: 5 },
//     { text: "Accumuler 500 points verts", type: "score", goal: 500 },
//     { text: "Installer 3 panneaux solaires", type: "solar", goal: 3 },
//     { text: "Installer 2 éoliennes", type: "windTurbines", goal: 2 }
// ];

// let currentObjective = {};
// setNewObjective();

// // Fonction pour définir un nouvel objectif
// function setNewObjective() {
//     currentObjective = objectivesList[Math.floor(Math.random() * objectivesList.length)];
//     document.getElementById("currentObjective").innerText = currentObjective.text;
//     document.getElementById("objectiveGoal").innerText = currentObjective.goal;
//     document.getElementById("objectiveProgress").innerText = 0;
//     updateObjectiveProgress();
// }

// // Vérifie la progression de l'objectif et met à jour la barre
// // function updateObjectiveProgress() {
// //     let progress = eval(currentObjective.type); // Récupère la valeur associée (ex: trees, score...)
// //     document.getElementById("objectiveProgress").innerText = progress;
// //     let percent = Math.min((progress / currentObjective.goal) * 100, 100);
// //     document.getElementById("objectiveBar").style.width = percent + "%";

// //     // Si objectif atteint, on attribue un nouvel objectif
// //     if (progress >= currentObjective.goal) {
// //         addEvent("🎯 Objectif complété : " + currentObjective.text);
// //         setNewObjective();
// //     }
// // }
// function updateObjectiveProgress() {
//     let progress = eval(currentObjective.type);
//     document.getElementById("objectiveProgress").innerText = progress;
//     let percent = Math.min((progress / currentObjective.goal) * 100, 100);
//     document.getElementById("objectiveBar").style.width = percent + "%";

//     // 🎉 Si objectif atteint
//     if (progress >= currentObjective.goal) {
//         let objectiveText = document.getElementById("currentObjective");
//         objectiveText.classList.add("objective-completed");

//         // 🔊 Joue un son de réussite (ajoute un fichier `success.mp3`)
//         document.getElementById("successSound").play();

//         // ✅ Ajoute un événement
//         addEvent("🎯 Objectif complété : " + currentObjective.text);

//         // ⏳ Remet un nouvel objectif après 1 min
//         setTimeout(() => {
//             objectiveText.classList.remove("objective-completed");
//             setNewObjective();
//         }, 60000);
//     }
// }

// 🎯 Liste des objectifs avec leur niveau de difficulté initial
const objectivesList = [
    { text: "Planter des arbres", type: "trees", baseGoal: 5, level: 1 },
    { text: "Accumuler des points verts", type: "score", baseGoal: 500, level: 1 },
    { text: "Installer des panneaux solaires", type: "solar", baseGoal: 3, level: 1 },
    { text: "Installer des éoliennes", type: "windTurbines", baseGoal: 2, level: 1 }
];

let objectifEnCours = true; // indique si un objectif est actif

let currentObjective = {};
// let startValues = {}; // ✅ Stocke les valeurs au moment de l'arrivée d'un objectif

setNewObjective();

// // 🎯 Fonction pour définir un nouvel objectif
// function setNewObjective() {
//     // Sélectionne un objectif au hasard
//     currentObjective = objectivesList[Math.floor(Math.random() * objectivesList.length)];
    
//     // Détermine la difficulté en fonction du niveau
//     let goal = currentObjective.baseGoal * currentObjective.level;

//     // Stocke la valeur actuelle du type de ressource ciblée
//     startValues[currentObjective.type] = eval(currentObjective.type);

//     // ✅ Met à jour l'affichage (Ajoute le niveau directement dans le texte)
//     document.getElementById("currentObjective").innerText = `${currentObjective.text} - Niveau ${currentObjective.level}`;
//     document.getElementById("objectiveGoal").innerText = goal;
//     document.getElementById("objectiveProgress").innerText = 0;

//     updateObjectiveProgress();
// }
function setNewObjective() {
    currentObjective = objectivesList[Math.floor(Math.random() * objectivesList.length)];
    let goal = currentObjective.baseGoal * currentObjective.level;

    // Stocke les valeurs actuelles de toutes les ressources
    startValues = {
        score,
        trees,
        solar,
        windTurbines,
        hydroPlants,
        researchCenter
    };

    document.getElementById("currentObjective").innerText = `${currentObjective.text} - Niveau ${currentObjective.level}`;
    document.getElementById("objectiveGoal").innerText = goal;
    document.getElementById("objectiveProgress").innerText = 0;

    updateObjectiveProgress();
}


// // 🎯 Vérifie la progression et met à jour la barre
// function updateObjectiveProgress() {
//     if (!objectifEnCours) return; // Bloque la progression si objectif terminé
    
//     let progress = eval(currentObjective.type) - startValues[currentObjective.type];
//     let goal = currentObjective.baseGoal * currentObjective.level;
    
//     document.getElementById("objectiveProgress").innerText = progress;
//     let percent = Math.min((progress / goal) * 100, 100);
//     document.getElementById("objectiveBar").style.width = percent + "%";

//     if (progress >= goal) {
        
        
//         addEvent(`🎯 Objectif complété : ${currentObjective.text} - Niveau ${currentObjective.level}`);
        
//         currentObjective.level++;

//         document.getElementById("currentObjective").innerText = "⏳ Un nouvel objectif arrive";
//         document.getElementById("objectiveProgress").innerText = "0";
//         document.getElementById("objectiveGoal").innerText = "-";
//         document.getElementById("objectiveBar").style.width = "0%";

//         objectifEnCours = false; // Bloque l'objectif actuel
     

//         // 🔊 Joue le son de succès
//         document.getElementById("successSound").play();

//         setTimeout(() => {
//             setNewObjective();
//             objectifEnCours = true; // Réactive l'objectif
//         }, 10000); // 10 secondes avant prochain objectif
//     }
// }
function updateObjectiveProgress() {
    if (!objectifEnCours) return;

    // Calcule la progression en soustrayant la valeur initiale
    let progress = eval(currentObjective.type) - startValues[currentObjective.type];
    let goal = currentObjective.baseGoal * currentObjective.level;

    document.getElementById("objectiveProgress").innerText = progress;
    let percent = Math.min((progress / goal) * 100, 100);
    document.getElementById("objectiveBar").style.width = percent + "%";

    if (progress >= goal) {
        addEvent(`🎯 Terminé : ${currentObjective.text} - Niveau ${currentObjective.level}`);

        currentObjective.level++;

        document.getElementById("currentObjective").innerText = "⏳ Un nouvel objectif arrive";
        document.getElementById("objectiveProgress").innerText = "0";
        document.getElementById("objectiveGoal").innerText = "-";
        document.getElementById("objectiveBar").style.width = "0%";

        objectifEnCours = false;

        document.getElementById("successSound").play();

        setTimeout(() => {
            setNewObjective();
            objectifEnCours = true;
        }, 10000);
    }
}

function addEvent(text) {
    let eventLog = document.getElementById("eventLog");
    let newEvent = document.createElement("li");

    // Sécurité maximale : tronque le texte si trop long (au-delà de 100 caractères par exemple)
    const maxLength = 150;
    newEvent.innerText = text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;

    if (isLeft) {
        newEvent.classList.add("message-left");
    } else {
        newEvent.classList.add("message-right");
    }
    isLeft = !isLeft;

    eventLog.prepend(newEvent);

    document.getElementById("eventSound").play();

    if (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.lastChild);
    }
}
function addEventMessage(message) {
    const eventLog = document.getElementById("eventLog");

    // Crée un nouvel élément de liste pour le message
    const newEvent = document.createElement("li");
    newEvent.textContent = message;

    // Ajoute le message en bas de la liste
    eventLog.appendChild(newEvent);

    // Vérifie si plus de 8 événements sont affichés
    while (eventLog.children.length > 8) {
        eventLog.removeChild(eventLog.firstChild); // Supprime le plus ancien événement
    }
}


// Intégrer la mise à jour des objectifs dans updateDisplay()
function updateDisplay() {
    document.getElementById("score").innerText = score;
    document.getElementById("xp").innerText = xp;
    document.getElementById("xpNeeded").innerText = xpNeeded;
    document.getElementById("level").innerText = level;
    document.getElementById("energy").innerText = energy;
    document.getElementById("innovation").innerText = innovation;
    document.getElementById("trees").innerText = trees;
    document.getElementById("solar").innerText = solar;
    document.getElementById("windTurbines").innerText = windTurbines;
    document.getElementById("hydroPlants").innerText = hydroPlants;
    document.getElementById("researchCenter").innerText = researchCenter;
    
    // Mise à jour des objectifs
    updateObjectiveProgress();
}


setInterval(() => { score += trees * 1; score += solar * 3; updateDisplay(); }, 1000);
setInterval(() => { innovation += windTurbines * 2; updateDisplay(); }, 5000);
setInterval(() => { energy += hydroPlants * 5; updateDisplay(); }, 10000);
// setInterval(() => { xp += researchCenter * 5; updateDisplay(); }, 1000);
setInterval(() => {
                    xp += researchCenter * 5;
                    checkLevelUp(); // Vérifie si l'XP dépasse le seuil et ajuste le niveau
                    updateDisplay();
                    }, 1000);

                    function resetGame() {
                        // 🔄 Remet toutes les valeurs à zéro
                        score = 0;
                        xp = 0;
                        level = 1;
                        xpNeeded = 100;
                        trees = 0;
                        solar = 0;
                        windTurbines = 0;
                        hydroPlants = 0;
                        researchCenter = 0;
                        energy = 0; // ✅ Réinitialisation correcte
                        innovation = 0; // ✅ Réinitialisation correcte
                    
                        // 🔊 Joue un son de reset
                        let resetSound = document.getElementById("resetSound");
                        if (resetSound) {
                            resetSound.play();
                        }
                    
                        // 💥 Petit effet sur le bouton
                        let resetBtn = document.querySelector(".btn-reset");
                        if (resetBtn) {
                            resetBtn.style.animation = "clickEffect 0.3s ease-out";
                            setTimeout(() => resetBtn.style.animation = "", 300);
                        }
                    
                        // ✅ Mise à jour de l'affichage
                        updateDisplay();
                    
                        // 🎉 Ajoute un événement "Réinitialisation"
                        addEvent("🔄 Jeu réinitialisé !");
                    }
                    
