const colors = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const hand = [];
const dealerHand = [];

let balance = 100;
let currentBet = 0;

const drawButton = document.getElementById('draw-card');
const standButton = document.getElementById('stand');

const placeBetButton = document.getElementById("place-bet");
const betInput = document.getElementById("bet-amount");

const resetGameButton = document.getElementById("reset-game");

function updateBalanceDisplay() {
    document.getElementById('balance').textContent = balance;
    betInput.max = balance;
}

function processHandValues(hand) {
    let total = 0;
    let acesCount = 0;

    for (const card of hand) {
        if (card.value === 'A') {
            acesCount++;
            total += 11;
        } else if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            total += 10;
        } else {
            total += parseInt(card.value);
        }
    }

    while (total > 21 && acesCount > 0) {
        total -= 10;
        acesCount--;
    }

    return total;
}

function checkPlayerState(value) {
    if (value > 21) {
        endRound();
        document.getElementById("message-container").textContent= "Désolé, vous avez dépassé 21. Vous avez perdu.";
    } else if (value === 21) {
        standOnValue();
        if (hand.length === 2) {
            document.getElementById("message-container").textContent= "Blackjack !";
        } else {
            document.getElementById("message-container").textContent= "Vous avez atteint 21.";
        }
    } else {
        console.log(value);
    }
    document.getElementById("total-value").textContent = value;
}

function standOnValue() {
        document.getElementById("draw-card").disabled = true;
        document.getElementById("stand").disabled = true;
        const dealerCards = document.getElementById('dealer-hand-container').querySelectorAll('.card');
        flipCard(dealerCards[dealerCards.length - 1]);
        const dealerHandValue = processHandValues(dealerHand);
        document.getElementById('dealer-total-value').textContent = dealerHandValue;
        if (dealerHandValue < 17) {
            setTimeout(() => {
                drawCard('dealer-hand-container');
                standOnValue();
            }, 1000);
        }else{
            endRound();
        }
}

function endRound() {
    document.getElementById("draw-card").disabled = true;
    document.getElementById("stand").disabled = true;
    const playerValue = processHandValues(hand);
    const dealerValue = processHandValues(dealerHand);
    if (dealerValue > 21 || playerValue > dealerValue && playerValue <= 21) {
        document.getElementById("message-container").textContent= "Félicitations, vous avez gagné !";
        balance += currentBet * 2;
    } else if (playerValue < dealerValue || playerValue > 21) {
        document.getElementById("message-container").textContent= "Désolé, le croupier a gagné.";
    } else {
        document.getElementById("message-container").textContent= "Égalité !";
        balance += currentBet;
    }
    setTimeout(() => {
        updateBalanceDisplay();
        currentBet = 0;
        document.getElementById("current-bet").textContent = currentBet;
        resetGame();
    }, 3000);
}

function startRound() {
    document.getElementById("draw-card").disabled = true;
    document.getElementById("stand").disabled = true;
    document.getElementById("place-bet").disabled = true;
    drawCard('hand-container', false);
    drawCard('hand-container', false);
    drawCard('dealer-hand-container', false);
    drawCard('dealer-hand-container', false);
    setTimeout(() => {
        flipCard(document.getElementById('dealer-hand-container').querySelector('.card'));
        const dealerHandValue = processHandValues(dealerHand.slice(0, -1));
        document.getElementById('dealer-total-value').textContent = dealerHandValue;
        const playerValue = processHandValues(hand);
        checkPlayerState(playerValue);
        if (playerValue < 21) {
            document.getElementById("draw-card").disabled = false;
            document.getElementById("stand").disabled = false;
        }
    }, 250);
}

function createCardElement(card, side) {
    const template = document.getElementById(side === 'dealer' ? 'dealer-card-template' : 'card-template');
    const clone = template.content.cloneNode(true);
    const cardDiv = clone.querySelector(".card");
    const topLeft = clone.querySelector(".top-left");
    const bottomRight = clone.querySelector(".bottom-right");
    const centerSymbol = clone.querySelector(".center");

    topLeft.textContent = `${card.value}${card.color}`;
    bottomRight.textContent = `${card.value}${card.color}`;
    centerSymbol.textContent = (card.value === 'A' ? `${card.color}` : card.value === 'J' ? 'J' : card.value === 'Q' ? 'Q' : card.value === 'K' ? 'K' : `${card.value}${card.color}`);

    cardDiv.classList.add(card.color === '♥' || card.color === '♦' ? 'red-card' : 'black-card');
    centerSymbol.classList.add(card.value === 'A' || card.value === 'J' || card.value === 'Q' || card.value === 'K' ? 'big-symbol' : 'small-symbol');

    return clone;
}


function renderCardInHand(card, containerId) {
    const side = containerId === 'dealer-hand-container' ? 'dealer' : 'player';
    const cardElement = createCardElement(card, side);
    document.getElementById(containerId).appendChild(cardElement);
}

function isCardAvailable(color, value) {
    return !(hand.some(card => card.color === color && card.value === value)|| dealerHand.some(card => card.color === color && card.value === value));
}

function drawCard(containerId, checkState = true) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    if(!isCardAvailable(color, value)) {
        drawCard(containerId);
    }else {
        if(containerId === 'dealer-hand-container') {
            dealerHand.push({ color, value });
        }else {
            hand.push({ color, value });
        }
        renderCardInHand({ color, value }, containerId);
        if (containerId !== 'dealer-hand-container' && checkState) {
            checkPlayerState(processHandValues(hand));
        }
    }
}

function flipCard(cardElement) {
    cardElement.classList.add('is-flipping');
    setTimeout(() => {
        cardElement.classList.remove('card-back');
        cardElement.classList.add('card-front');
        cardElement.classList.remove('is-flipping');
    }, 250);
}

function resetGame() {
    hand.length = 0;
    dealerHand.length = 0;
    document.getElementById('hand-container').innerHTML = '<template id="card-template"><div class="card card-front"><div class="top-left"></div><div class="center"></div><div class="bottom-right"></div></div></template>';
    document.getElementById('dealer-hand-container').innerHTML = '<template id="dealer-card-template"><div class="card card-back"><div class="top-left"></div><div class="center"></div><div class="bottom-right"></div></div></template>';
    document.getElementById('total-value').textContent = '';
    document.getElementById('dealer-total-value').textContent = '';
    document.getElementById("message-container").textContent= '';
    if (balance > 0) {
        document.getElementById("place-bet").disabled = false;
    } else {
        document.getElementById("message-container").textContent= "Vous n'avez plus de solde. Rechargez pour continuer à jouer.";
    }
}

drawButton.addEventListener('click', () => drawCard('hand-container'));
standButton.addEventListener('click', standOnValue);

betInput.addEventListener('input', (e) => {
    let enteredValue = parseInt(e.target.value);

    if (enteredValue > balance) {
        e.target.value = balance;
    }
});

betInput.addEventListener('blur', (e) => {
    let enteredValue = parseInt(e.target.value);
    
    if (isNaN(enteredValue) || enteredValue < 1) {
        e.target.value = 1;
    }
});

placeBetButton.addEventListener('click', () => {
    const betAmount = parseInt(betInput.value);

    if (betAmount > balance) {
        alert("Tu ne peux pas parier plus que ton solde !");
        return; 
    }
    
    if (betAmount <= 0 || isNaN(betAmount)) {
        alert("Mise invalide.");
        return;
    }

    balance -= betAmount;
    updateBalanceDisplay();

    document.getElementById("current-bet").textContent = betAmount;
    currentBet = betAmount;
    startRound();
});

resetGameButton.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('DOMContentLoaded', () => {
  updateBalanceDisplay();
  drawButton.disabled = true;
  standButton.disabled = true;
});