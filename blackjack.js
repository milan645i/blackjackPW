const colors = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const hand = [];

const drawButton = document.getElementById('draw-card');
const standButton = document.getElementById('stand');

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
        document.getElementById("draw-card").disabled = true;
        document.getElementById("stand").disabled = true;
        document.getElementById("message-container").textContent= "Désolé, vous avez dépassé 21. Vous avez perdu.";
    } else if (value === 21) {
        document.getElementById("draw-card").disabled = true;
        document.getElementById("stand").disabled = true;
        if (hand.length === 2) {
            document.getElementById("message-container").textContent= "Blackjack ! Vous avez gagné !";
        } else {
            document.getElementById("message-container").textContent= "Vous avez atteint 21. Vous avez gagné !";
        }
    } else {
        console.log(value);
    }
    document.getElementById("total-value").textContent = value;
}

function standOnValue() {
        document.getElementById("draw-card").disabled = true;
        document.getElementById("stand").disabled = true;
}

function createCardElement(card) {
    const template = document.getElementById("card-template");
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
    const cardElement = createCardElement(card);
    document.getElementById(containerId).appendChild(cardElement);
}

function isCardAvailable(color, value) {
    return !hand.some(card => card.color === color && card.value === value);
}

function drawCard() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    if(!isCardAvailable(color, value)) {
        drawCard();
    }else {
        hand.push({ color, value });
        renderCardInHand({ color, value }, 'hand-container');
        checkPlayerState(processHandValues(hand));
    }
}



drawButton.addEventListener('click', drawCard);
standButton.addEventListener('click', standOnValue);

document.addEventListener('DOMContentLoaded', () => {
  drawCard();
  drawCard();
});