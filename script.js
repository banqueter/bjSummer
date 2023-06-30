const app = (function () {
  const game = {};

  function init() {
    console.log(`init ready`);
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
    game.playerScore = document.createElement("div");
    game.playerScore.textContent = `-`;
    game.playerScore.classList.add(`score`);
    game.player.append(game.playerScore);
    game.table.append(game.player);
    game.player.append(game.playerCards);

    game.main.append(game.table);
  }
  return { init: init };
})();
