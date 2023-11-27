const input = document.getElementById("input");
const badOrGood = document.querySelector(".badOrGood");


const heroesTable = document.querySelector(".heroesTable");
const heroesLeft = document.getElementById("heroesLeft");
heroesLeft.textContent = heroes.length;
const scoreText = document.getElementById("scoreText");
let totalScore = 0;
scoreText.textContent = totalScore;

const guidelines = document.querySelector(".guidelines");
const infobar = document.querySelector(".infobar");
let totalScoreTxt = "";

const foundHeroes = []; // Tableau pour stocker les héros trouvés

const heroCases = {};
const heroNames = {};
const heroImages = {};
const initialsBtns = {};
const imgRevealedBtns = {};
const usedInitials = {};
const revealedImg= {};
const nameRevealedBtns = {};
let scores = {};

function updateScore(heroName, isCorrect) {
    heroCases[heroName].score = 0;
    if (isCorrect) {
        heroCases[heroName].score++;
        if (!heroCases[heroName].usedInitials) {
            heroCases[heroName].score++;
        }
        if (!heroCases[heroName].revealedImg) {
            heroCases[heroName].score++;
        }
    }
    totalScore = Object.values(heroCases).reduce((total, heroCase)=> total + heroCase.score, 0);
    scoreText.textContent = totalScore;
};

function revealName(hero) {
    const heroName = heroNames[hero.name];
    const heroImg = heroImages[hero.unrevealed];
    const initialsBtn = initialsBtns[hero.name];
    const imgRevealedBtn = imgRevealedBtns[hero.name];
    const nameRevealedBtn = nameRevealedBtns[hero.name];

    heroName.innerHTML = hero.name;
    heroName.style.border = "5px solid #318CE7";
    heroName.style.backgroundColor = "#73C2FB";
    heroImg.src = hero.revealed;
    initialsBtn.style.display = "none";
    imgRevealedBtn.style.display = "none";
    nameRevealedBtn.style.display = "none";
    foundHeroes.push(hero.name);
    heroesLeft.textContent = heroes.length - foundHeroes.length;
    input.value = "";
}

function finishGame() {
    if (heroesLeft.textContent == "0") {
        const maxScore = totalScore / (heroes.length * 3) * 100;

        if (maxScore >= 0 && maxScore < 34) {
            totalScoreTxt = "Une seule solution : retourner en Hyrule ! :)"
        } else if (maxScore > 33 && maxScore < 67) {
            totalScoreTxt = "C'est bien ! Encore quelques noms à retenir :)"
        } else if (maxScore > 66 && maxScore < 100) {
            totalScoreTxt = "Bravo ! Encore un petit effort !"
        } else if (maxScore === 100) {
            totalScoreTxt = "C'est un sans faute ! Félicitations !"
        }

        guidelines.innerHTML = `<p id="finished">Fini !</p>`;
        infobar.innerHTML = "<p>Vous avez gagné " + totalScore + " points ! Vous avez obtenu " + maxScore.toFixed(2) + "% du score maximal ! " + totalScoreTxt + "</p>"
    }
}

for (let hero of heroes) {
    heroCases[hero.name] = {};
    heroCases[hero.name].score = 0;
    heroCases[hero.name].usedInitials = false;
    heroCases[hero.name].revealedImg = false;
    const heroCase = document.createElement("div");
    heroCase.classList.add("heroCase")
    heroesTable.appendChild(heroCase);
    const heroImg = document.createElement("img");
    heroImg.classList.add("heroImg");
    heroCase.appendChild(heroImg);
    heroImages[hero.unrevealed] = heroImg;
    heroImg.src = hero.unrevealed;
    const heroName = document.createElement("p");
    heroName.classList.add(hero.class);
    heroCase.appendChild(heroName);
    heroNames[hero.name] = heroName;
    const initialsBtn = document.createElement("button");
    initialsBtn.classList.add("initialsBtn");
    initialsBtn.textContent = "Initiales";
    usedInitials[hero.name] = false;
    heroCase.appendChild(initialsBtn);
    initialsBtns[hero.name] = initialsBtn;
    initialsBtn.addEventListener('click', () => {
        heroName.innerHTML = hero.initials;
        heroName.classList.add("initialsTxt");
        heroCases[hero.name].usedInitials = true;
        updateScore(hero.name, false);
    })
    const imgRevealedBtn = document.createElement("button");
    imgRevealedBtn.classList.add("imgRevealedBtn");
    imgRevealedBtn.textContent = "Image";
    revealedImg[hero.name] = false;
    heroCase.appendChild(imgRevealedBtn);
    imgRevealedBtns[hero.name] = imgRevealedBtn;
    imgRevealedBtn.addEventListener('click', () => {
        heroImg.src = hero.revealed;
        heroCases[hero.name].revealedImg = true;
        updateScore(hero.name, false);
    })
    const nameRevealedBtn = document.createElement("button");
    nameRevealedBtn.classList.add("nameRevealedBtn");
    nameRevealedBtn.textContent = "Passer";
    heroCase.appendChild(nameRevealedBtn);
    nameRevealedBtns[hero.name] = nameRevealedBtn;
    nameRevealedBtn.addEventListener('click', () => {
        heroName.classList.remove("initialsTxt");
        revealName(hero);
        finishGame();
    })
}

input.addEventListener("keyup", (e) => {
    if(e.keyCode === 13) {
        const userInput = input.value.toLowerCase();

        // Réinitialiser les styles et le texte pour les héros qui n'ont pas été trouvés
        for (let hero of heroes) {
            const heroName = heroNames[hero.name];
            const heroImg = heroImages[hero.unrevealed];
        }

        let heroFound = false;

        // Chercher un héros correspondant
        for (let hero of heroes) {
            const heroName = heroNames[hero.name];

            if (userInput === hero.name.toLowerCase()) {
                if (!foundHeroes.includes(hero.name)) {
                    badOrGood.classList.remove("slideup");
                    badOrGood.classList.remove("slidedown");
                    heroName.classList.remove("initialsTxt");
                    setTimeout(() => {
                        badOrGood.textContent = "Bien joué !";
                        badOrGood.classList.add("slideup");
                    }, 10);
                    revealName(hero);
                    updateScore(hero.name, true);
                }
                heroFound = true;
                break; // Sortez de la boucle puisqu'une correspondance a été trouvée
            }
        }

        if(foundHeroes.includes(userInput)) {
            badOrGood.classList.remove("slideup");
            badOrGood.classList.remove("slidedown");
            setTimeout(() => {
                badOrGood.textContent = "Ce nom a déjà été révélé !";
                badOrGood.classList.add("slideup");
            }, 10);
            input.value = "";
        }

        if (!heroFound) {
            badOrGood.classList.remove("slideup");
            badOrGood.classList.remove("slidedown");
            setTimeout(() => {
                badOrGood.textContent = "Ce nom n'est pas connu en Hyrule...";
                badOrGood.classList.add("slidedown");
            }, 10);
            input.value = "";
        }

        finishGame();
    }
});