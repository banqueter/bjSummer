const app = (function () {
  const game = {};
  const suits = [`spades`, `hearts`, `clubs`, `diams`];
  // const ranks = [`A`, 2, 3, 4, 5, 6, 7, 8, 9, 10, `J`, `Q`, `K`];
  const ranks = [2, 3, 4, 5, 6];
  // const ranks = [`A`, `A`, `A`, `A`, `A`, 2, `J`, `Q`, `K`];

  const score = [0, 0];

  function scoreBoard() {
    game.scoreBoard.textContent = `Dealer ${score[0]} vs Player ${score[1]}`;
  }

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
    // console.log(organizedCardDeck);
    // console.log(game.cardDeck);
  }

  function init() {
    // console.log(`init ready`);
    game.cash = 100;
    game.bet = 0;
    buildGameBoard();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    turnOff(game.btnDeal);
    buildDeck();
    addClicker();
    scoreBoard();
    updateCash();
  }

  function updateCash() {
    // console.log(isNaN(game.inputBet.value));
    // if (isNaN(game.inputBet.value) || game.inputBet.value.lenght < 1) {
    //   game.inputBet.value = 0;
    // }
    if (game.inputBet.value > game.cash) {
      game.inputBet.value = game.cash;
    }
    game.bet = Number(game.inputBet.value);
    game.playerCash.textContent = `Player cash $ ${game.cash - game.bet}`;
  }

  function lockWager(toggle) {
    game.inputBet.disabled = toggle;
    game.btnBet.disabled = toggle;
    if (toggle) {
      game.btnBet.style.backgroundColour = `#ddd`;
      game.inputBet.style.backgroundColour = `#ddd`;
    } else {
      game.btnBet.style.backgroundColour = `#000`;
      game.inputBet.style.backgroundColour = `#fff`;
    }
  }

  function setBet() {
    if (game.bet < 5) {
      game.status.textContent = `To be able to play you need to bet at least $5.00`;
    } else {
      game.status.textContent = `You bet $ ${game.bet}`;
      game.cash = game.cash - game.bet;
      game.playerCash.textContent = `Player cash $ ${game.cash}`;
      buildDeck();
      lockWager(true);
      turnOn(game.btnDeal);
    }
  }

  function takeCard(hand, element, hidden) {
    let temp = game.cardDeck.shift();
    hand.push(temp);
    showCard(temp, element);
    if (hidden) {
      game.cardBack = document.createElement(`div`);
    }
    game.cardBack.classList.add(`cardB`);
    element.append(game.cardBack);
  }

  function showCard(card, element) {
    if (card != undefined) {
      element.style.backgroundColour = `white`;
      let div = document.createElement(`div`);
      div.classList.add(`card`);
      if (card.suit === `hearts` || card.suit === `diams`) {
        div.classList.add(`red`);
      } else div.classList.add(`black`);
      let span1 = document.createElement(`div`);
      span1.innerHTML = card.rank + `&` + card.suit + `;`;
      span1.classList.add(`tiny`);
      div.appendChild(span1);

      let span2 = document.createElement(`div`);
      span2.innerHTML = card.rank;
      span2.classList.add(`big`);
      div.appendChild(span2);

      let span3 = document.createElement(`div`);
      span3.innerHTML = `&` + card.suit + `;`;
      span3.classList.add(`big`);
      div.appendChild(span3);

      element.appendChild(div);
    }
  }

  function deal() {
    game.dealerHand = [];
    game.playerHand = [];
    game.start = true;
    lockWager(true);
    turnOff(game.btnDeal);
    game.dealerScore.textContent = `-`;
    game.playerScore.textContent = `-`;

    game.playerCards.innerHTML = ``;
    game.dealerCards.innerHTML = ``;

    takeCard(game.dealerHand, game.dealerCards, true);
    takeCard(game.dealerHand, game.dealerCards, false);
    takeCard(game.playerHand, game.playerCards, false);
    takeCard(game.playerHand, game.playerCards, false);
    updateCount();
  }

  function playerStand() {
    dealerPlay();
    turnOff(game.btnHit);
    turnOff(game.btnStand);
  }

  function nextCard() {
    takeCard(game.playerHand, game.playerCards, false);
    updateCount();
  }

  function findWinner() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    console.log(`Player: ${player}; Dealer: ${dealer}`);
    if (player === dealer) {
      game.status.textContent = `Draw! No winners; player: ${player} and dealer: ${dealer}`;
      game.cash = game.cash + game.bet;
      console.log(`game.cash ${game.cash} + game.bet ${game.bet}`);
    } else if (
      (player <= 21 && player >= 17 && player > dealer) ||
      (dealer > 21 && player <= 21)
    ) {
      game.status.textContent = `Congratulations! You are the winner; you scored ${player}`;
      score[1]++;
      game.cash = game.cash + 2 * game.bet;
      console.log(`game.cash ${game.cash} + 2* game.bet ${game.bet}`);
    } else if (
      (dealer <= 21 && dealer >= 17 && dealer > player) ||
      (player > 21 && dealer <= 21)
    ) {
      game.status.textContent = `The house wins with ${dealer}`;
      score[0]++;
    }
    if (game.cash < 1) {
      game.cash = 0;
      game.bet = 0;
    }
    scoreBoard();
    game.playerCash.textContent = "Player Cash $" + game.cash;
    lockWager(false);
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    turnOn(game.btnDeal);
  }

  function dealerPlay() {
    let dealer = scorer(game.dealerHand);
    game.cardBack.style.display = `none`;
    game.status.textContent = `Dealer score ` + dealer + ` `;
    if (dealer >= 17) {
      game.dealerScore.textContent = dealer;
      findWinner();
    } else {
      takeCard(game.dealerHand, game.dealerCards, false);
      game.dealerScore.textContent = dealer;
      dealerPlay();
    }
  }

  function updateCount() {
    let player = scorer(game.playerHand);
    let dealer = scorer(game.dealerHand);
    game.playerScore.textContent = player;
    if (player < 21) {
      turnOn(game.btnHit);
      turnOn(game.btnStand);
      game.status.textContent = `Stand or take another card`;
    } else if (player > 21) {
      findWinner();
    } else {
      game.status.textContent = `Dealer in play to 17 minimum.`;
      dealerPlay(dealer);
    }
    if (dealer === 21 && game.dealerHand.lenght === 2) {
      // BUG
      game.status.textContent = `Dealer got Backjack`; // BUG
      gameEnd(); // BUG
      findWinner(); // BUG
    } // BUG
  }

  function scoreAce(val, aces) {
    if (val < 21) {
      // console.log(`val>21`);
      return val;
    } else if (aces > 0) {
      // console.log(`elif ace>0`);
      aces--;
      val -= 10;
      return scoreAce(val, aces);
    } else {
      // console.log(`else return value`);
      return val;
    }
  }

  function scorer(hand) {
    let total = 0;
    let ace = 0;
    hand.forEach(function (card) {
      if (card.rank === `A`) {
        ace++;
      }
      total += Number(card.value);
    });
    if (ace > 0 && total > 21) {
      total = scoreAce(total, ace);
    }
    if (total > 21) {
      gameEnd();
      return Number(total);
    }
    return Number(total);
  }

  function gameEnd() {
    turnOff(game.btnHit);
    turnOff(game.btnStand);
    console.log(`ended`);
  }

  function addClicker() {
    game.btnDeal.addEventListener(`click`, deal);
    game.btnStand.addEventListener(`click`, playerStand);
    game.btnHit.addEventListener(`click`, nextCard);
    game.btnBet.addEventListener(`click`, setBet);
    game.inputBet.addEventListener(`change`, updateCash);
  }

  function turnOff(btn) {
    btn.disabled = true;
    btn.style.backgroundColour = `#ddd`;
  }

  function turnOn(btn) {
    btn.disabled = false;
    btn.style.backgroundColour = `#000`;
  }

  function buildGameBoard() {
    game.main = document.querySelector(`#game`);

    game.scoreBoard = document.createElement(`div`);
    game.scoreBoard.textContent = `Dealer ${score[0]} vs Player ${score[1]}`;
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
    game.status.textContent = ``;

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
    game.inputBet.style.marginRight = `0.5em`;
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
