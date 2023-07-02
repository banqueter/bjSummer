const app = (function () {
  const game = {};
  const suits = [`spades`, `hearts`, `clubs`, `diams`];
  const ranks = [`A`, 2, 3, 4, 5, 6, 7, 8, 9, 10, `J`, `Q`, `K`];
  const organizedCardDeck = [].concat(
    ...suits.map((suit) =>
      ranks.map((rank) => ({
        suit,
        rank,
        value:
          rank === `A`
            ? 11
            : rank === `J` || rank === `Q` || rank === `K`
            ? 10
            : rank,
      }))
    )
  );

  function shuffle(array) {
    return array
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
  }

  function buildDeck() {
    game.cardDeck = shuffle(organizedCardDeck);
    console.log(game.cardDeck);
  }

  function init() {
    console.log(`init ready`);
    buildGameBoard();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    buildDeck();
    addClicker();
  }

  function takeCard(hand, element, hidden) {
    let temp = game.cardDeck.shift();
    console.log(temp);
    hand.push(temp);
    console.log(game);
    showCard(temp, element);
  }

  function deal() {
    game.dealerHand = [];
    game.playerHand = [];
    game.start = true;
    turnOff(game.btnDeal);

    takeCard(game.dealerHand, game.dealerCards, false);

    game.playerCards.innerHTML = `Deal`;
    game.dealerCards.innerHTML = `Deal`;
  }

  function addClicker() {
    game.btnDeal.addEventListener(`click`, deal);
    game.btnStand.addEventListener(`click`, playerStand);
    game.btnHit.addEventListener(`click`, nextCard);
  }

  function turnOff(btn) {
    btn.disabled = true;
    btn.style.backgroundColour = `#ddd`;
  }

  function turnOn(btn) {
    btn.disabled = false;
    btn.style.backgroundColour = `#000`;
  }

  function playerStand() {
    console.log(`Player Stand`);
  }
  function nextCard() {
    console.log(`Next card`);
  }

  function buildGameBoard() {
    game.main = document.querySelector(`#game`);
    console.log(game);

    game.scoreBoard = document.createElement(`div`);
    game.scoreBoard.textContent = `Dealer 0 vs Player 0`;
    game.scoreBoard.style.fonstSize = "2em";
    game.main.append(game.scoreBoard);
    game.table = document.createElement(`div`);
    // Dealer
    game.dealer = document.createElement(`div`);
    game.dealerCards = document.createElement(`div`);
    game.dealerCards.textContent = `Dealer cards`;
    game.dealerScore = document.createElement("div");
    game.dealerScore.textContent = `-`;
    game.dealerScore.classList.add(`score`);
    game.dealer.append(game.dealerScore);
    game.table.append(game.dealer);
    game.dealer.append(game.dealerCards);
    // Player
    game.player = document.createElement(`div`);
    game.playerCards = document.createElement(`div`);
    game.playerCards.textContent = `Player cards`;
    game.playerScore = document.createElement(`div`);
    game.playerScore.textContent = `-`;
    game.playerScore.classList.add(`score`);
    game.player.append(game.playerScore);
    game.table.append(game.player);
    game.player.append(game.playerCards);

    // Dashboard
    game.dashboard = document.createElement(`div`);
    game.status = document.createElement(`div`);
    game.status.classList.add(`message`);
    game.status.textContent = `Message for Player`;

    // Buttons
    game.btnDeal = document.createElement(`button`);
    game.btnDeal.textContent = `DEAL`;
    game.btnDeal.classList.add(`btn`);
    game.btnHit = document.createElement(`button`);
    game.btnHit.textContent = `HIT`;
    game.btnHit.classList.add(`btn`);
    game.btnStand = document.createElement(`button`);
    game.btnStand.textContent = `STAND`;
    game.btnStand.classList.add(`btn`);

    game.playerCash = document.createElement(`div`);
    game.playerCash.classList.add(`message`);
    game.playerCash.textContent = `Player Cash $100`;

    game.inputBet = document.createElement(`input`);
    game.inputBet.setAttribute(`type`, `number`);
    game.inputBet.style.width = `4em`;
    game.inputBet.style.fontSize = `1rem`;
    game.inputBet.style.marginTop = `0.3em`;
    game.inputBet.value = 0;

    game.btnBet = document.createElement(`button`);
    game.btnBet.textContent = `Bet amount`;
    game.btnBet.classList.add(`btn`);

    // Appending created elements
    game.dashboard.append(game.status);
    game.table.append(game.dashboard);
    game.main.append(game.table);
    game.dashboard.append(game.btnDeal);
    game.dashboard.append(game.btnHit);
    game.dashboard.append(game.btnStand);
    game.dashboard.append(game.playerCash);
    game.dashboard.append(game.inputBet);
    game.dashboard.append(game.btnBet);
  }
  return { init: init };
})();
