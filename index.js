const createAccountButton = document.querySelector(".create-account-button");
const goBackButton        = document.querySelector(".go-back");
const loginButton         = document.querySelector(".login-button");
const createUserButton    = document.querySelector(".create-user-button");

const deal = document.querySelector(".deal");

let usernameLogin   = document.querySelector(".username-login");
let passwordLogin   = document.querySelector(".password-login");
let usernameCreate  = document.querySelector(".username-create");
let passwordCreate  = document.querySelector(".password-create");

const accountCreate = document.querySelector(".account-create");
const loginScreen   = document.querySelector(".login-screen");
const playGame      = document.querySelector(".play-game");

accountCreate.style.display = "none";
playGame.style.display = "none";
document.querySelector(".end-game-message").style.display = "none";



deactivateLogin();
deactivateCreate();
deactivateDealerCards();
deactivatePlayerCards();

function deactivateDealerCards() {
  document.querySelector(".dealer-card-3").style.display = "none";
  document.querySelector(".dealer-card-4").style.display = "none";
  document.querySelector(".dealer-card-5").style.display = "none";
}

function deactivatePlayerCards() {
  document.querySelector(".hand-one-card-three").style.display = "none";
  document.querySelector(".hand-one-card-four").style.display = "none";
  document.querySelector(".hand-one-card-five").style.display = "none";
  document.querySelector(".hand-two-card-three").style.display = "none";
  document.querySelector(".hand-two-card-four").style.display = "none";
  document.querySelector(".hand-two-card-five").style.display = "none";
}

function loggedInCheck() {
  if(localStorage.getItem("api-key")) {
    letsPlay();
  }
}

function unlockLogin() {
  if ((usernameLogin.value) && (passwordLogin.value)) {
    activateLogin();
  } else {
    deactivateLogin();
  }
}

function unlockCreate() {
  if ((usernameCreate.value) && (passwordCreate.value)) {
    activateCreate();
  } else {
    deactivateCreate();
  }
}

function deactivateLogin() {
  loginButton.className = "landing-button login-button disabled-button"
}

function activateLogin() {
  loginButton.className = "landing-button login-button"
}

function deactivateCreate() {
  createUserButton.className = "landing-button create-user-button disabled-button"
}

function activateCreate() {
  createUserButton.className = "landing-button create-user-button"
}



function createLoginSwitch() {
  if (loginScreen.style.display === "none") {
    loginScreen.style.display   = "block";
    accountCreate.style.display = "none";
  } else {
    loginScreen.style.display   = "none";
    accountCreate.style.display = "block";
  };
};

function showGame() {
  loginScreen.style.display   = "none";
  accountCreate.style.display = "none";
  playGame.style.display      = "block";
}

function letsPlay() {
  showGame();
  preDealButtons();
  loadGame();
};

createAccountButton.addEventListener("click", createLoginSwitch);
goBackButton.addEventListener("click", createLoginSwitch);
loginButton.addEventListener("click", tryToLogin);
loginButton.addEventListener("click", tryToLogin);
createUserButton.addEventListener("click", tryToCreate);

usernameLogin.addEventListener("input", unlockLogin);
passwordLogin.addEventListener("input", unlockLogin);
usernameCreate.addEventListener("input", unlockCreate);
passwordCreate.addEventListener("input", unlockCreate);

deal.addEventListener("click", dealGame);


function tryToCreate() {
  event.preventDefault();
  let data = { username: `${usernameCreate.value}`,
              password: `${passwordCreate.value}`
             }
  const package = { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  }
  fetch('https://bens-blackjack-switch.herokuapp.com/api/v1/users', package)
  .then(res => res.json())
  .then(response => {
    loginHandler(response);
  });
}

function tryToLogin() {
  event.preventDefault();
  let data = { username: `${usernameLogin.value}`,
              password: `${passwordLogin.value}`
             }
  const package = { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                  }
  fetch('https://bens-blackjack-switch.herokuapp.com/api/v1/login', package)
  .then(res => res.json())
  .then(response => {
    loginHandler(response);
  });
};

function loginHandler(response) {
  if(response.status === 202) {
    console.log(response);
    hideBorderCards();
    letsPlay();
    localStorage.removeItem("apiKey");
    localStorage.setItem("apiKey", response.api_key);
  } else {
    console.log(response);
    let alert = document.querySelector(".heads-up");
    alert.innerHTML = "Something went wrong, please try again";
  }
}

function hideBorderCards() {
  document.querySelector(".spade-border").style.display = "none";
  document.querySelector(".club-border").style.display  = "none";
}

function preDealButtons() {
  document.querySelector(".hit").style.display  = "none";
  document.querySelector(".stay").style.display  = "none";
  document.querySelector(".switch").style.display  = "none";
}

function postDealButtons() {
  document.querySelector(".deal").style.display  = "none";
  const hitMe    = document.querySelector(".hit")
  const illStay  = document.querySelector(".stay")
  const switchEm = document.querySelector(".switch")
  hitMe.style.display     = "inline";
  illStay.style.display   = "inline";
  switchEm.style.display  = "inline";
  hitMe.addEventListener("click", make_a_move);
  illStay.addEventListener("click", make_a_move);
  switchEm.addEventListener("click", make_a_move);
}

function loadGame() {
  const package = { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({api_key: localStorage.getItem("apiKey")})
                  }
  fetch('https://bens-blackjack-switch.herokuapp.com/api/v1/games', package)
  .then(res => res.json())
  .then(response => {
    localStorage.removeItem("gameId");
    localStorage.setItem("gameId", response.game_id);
    document.querySelector(".player-name").innerHTML = `${response.players[0].username}: ${response.players[0].chip_count} chips`
  });
}

function dealGame() {
  document.querySelector(".end-game-message").style.display = "none";
  const placeBet  = document.querySelector(".place-bet");
  const params    = {api_key: localStorage.getItem("apiKey"), bet: placeBet.value}
  const package   = { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                    }
  const gameId  = localStorage.getItem("gameId")
  fetch(`https://bens-blackjack-switch.herokuapp.com/api/v1/games/${gameId}/deal`, package)
  .then(res => res.json())
  .then(response => {
    placeBet.className = "place-bet-disabled form-fill";
    placeBet.value     = `Bet: ${placeBet.value}`;
    deactivatePlayerCards()
    postDealButtons();
    showCards(response)
  });
}

function make_a_move() {
  localStorage.removeItem("action");
  const theMove = (this.value);
  localStorage.setItem("action", theMove);
  const gameId  = localStorage.getItem("gameId");
  const params  = {api_key: localStorage.getItem("apiKey"), move: `${this.value}`};
  const package = { method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                    }
  fetch(`https://bens-blackjack-switch.herokuapp.com/api/v1/games/${gameId}/current_hand/moves`, package)
  .then(res => res.json())
  .then(response => {
    if (response.winner === "player" || response.winner === "dealer" || response.winner === "draw") {
      if(response.dealer_hand[4] != undefined) {
        document.querySelector('.dealer-card-1').src=`cards/${response.dealer_hand[0]}.png`;
        document.querySelector('.dealer-card-2').src=`cards/${response.dealer_hand[1]}.png`;
        document.querySelector(".dealer-card-3").style.display = "inline";
        document.querySelector(".dealer-card-3").src=`cards/${response.dealer_hand[2]}.png`;
        document.querySelector(".dealer-card-4").style.display = "inline";
        document.querySelector(".dealer-card-4").src=`cards/${response.dealer_hand[3]}.png`;
        document.querySelector(".dealer-card-5").style.display = "inline";
        document.querySelector(".dealer-card-5").src=`cards/${response.dealer_hand[4]}.png`;
      } else if (response.dealer_hand[3] != undefined) {
        document.querySelector('.dealer-card-1').src=`cards/${response.dealer_hand[0]}.png`;
        document.querySelector('.dealer-card-2').src=`cards/${response.dealer_hand[1]}.png`;
        document.querySelector(".dealer-card-3").style.display = "inline";
        document.querySelector(".dealer-card-3").src=`cards/${response.dealer_hand[2]}.png`;
        document.querySelector(".dealer-card-4").style.display = "inline";
        document.querySelector(".dealer-card-4").src=`cards/${response.dealer_hand[3]}.png`;
      } else if (response.dealer_hand[2] != undefined) {
        document.querySelector('.dealer-card-1').src=`cards/${response.dealer_hand[0]}.png`;
        document.querySelector('.dealer-card-2').src=`cards/${response.dealer_hand[1]}.png`;
        document.querySelector(".dealer-card-3").style.display = "inline";
        document.querySelector(".dealer-card-3").src=`cards/${response.dealer_hand[2]}.png`;
      } else {
        document.querySelector('.dealer-card-1').src=`cards/${response.dealer_hand[0]}.png`;
        document.querySelector('.dealer-card-2').src=`cards/${response.dealer_hand[1]}.png`;
      }
      if(response.winner === "player") {
        document.querySelector(".end-game-message").style.display = "block";
        document.querySelector(".the-mess").innerHTML = "PLAYER WINS! Make another bet to play again!";
      } else if (response.winner === "dealer") {
        document.querySelector(".end-game-message").style.display = "block";
        document.querySelector(".the-mess").innerHTML = "DEALER WINS! Make another bet to play again!";
      } else {
        document.querySelector(".end-game-message").style.display = "block";
        document.querySelector(".the-mess").innerHTML = "IT'S A DRAW! Make another bet to play again!";
      }
      resetGame();
    } else if (localStorage.getItem("action") === "Stay") {
      wereStaying();
    } else if (localStorage.getItem("action") === "Hit") {
      debugger
      if(response.players[0].hand_one[4] != undefined) {
        document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`;
        document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`;
        document.querySelector(".hand-one-card-three").style.display = "inline";
        document.querySelector(".hand-one-card-three").src=`cards/${response.players[0].hand_one[2]}.png`;
        document.querySelector(".hand-one-card-four").style.display = "inline";
        document.querySelector(".hand-one-card-four").src=`cards/${response.players[0].hand_one[3]}.png`;
        document.querySelector(".hand-one-card-five").style.display = "inline";
        document.querySelector(".hand-one-card-five").src=`cards/${response.players[0].hand_one[4]}.png`;
      } else if (response.players[0].hand_one[3] != undefined) {
        document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`;
        document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`;
        document.querySelector(".hand-one-card-three").style.display = "inline";
        document.querySelector(".hand-one-card-three").src=`cards/${response.players[0].hand_one[2]}.png`;
        document.querySelector(".hand-one-card-four").style.display = "inline";
        document.querySelector(".hand-one-card-four").src=`cards/${response.players[0].hand_one[3]}.png`;
      } else if (response.players[0].hand_one[2] != undefined) {
        document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`;
        document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`;
        document.querySelector(".hand-one-card-three").style.display = "inline";
        document.querySelector(".hand-one-card-three").src=`cards/${response.players[0].hand_one[2]}.png`;
      } else {
        document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`;
        document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`;
      }
      if(response.one_stay === true) {
        wereStaying();
      }
      if(response.players[0].hand_two[4] != undefined) {
        document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`;
        document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`;
        document.querySelector(".hand-two-card-three").style.display = "inline";
        document.querySelector(".hand-two-card-three").src=`cards/${response.players[0].hand_two[2]}.png`;
        document.querySelector(".hand-two-card-four").style.display = "inline";
        document.querySelector(".hand-two-card-four").src=`cards/${response.players[0].hand_two[3]}.png`;
        document.querySelector(".hand-two-card-five").style.display = "inline";
        document.querySelector(".hand-two-card-five").src=`cards/${response.players[0].hand_two[4]}.png`;
      } else if (response.players[0].hand_two[3] != undefined) {
        document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`;
        document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`;
        document.querySelector(".hand-two-card-three").style.display = "inline";
        document.querySelector(".hand-two-card-three").src=`cards/${response.players[0].hand_two[2]}.png`;
        document.querySelector(".hand-two-card-four").style.display = "inline";
        document.querySelector(".hand-two-card-four").src=`cards/${response.players[0].hand_two[3]}.png`;
      } else if (response.players[0].hand_two[2] != undefined) {
        document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`;
        document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`;
        document.querySelector(".hand-two-card-three").style.display = "inline";
        document.querySelector(".hand-two-card-three").src=`cards/${response.players[0].hand_two[2]}.png`;
      } else {
        document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`;
        document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`;
      }
    } else if (action === "Switch") {
      
    }
    console.log("yo");
  });
}

function wereStaying() {
  document.querySelector('.hand-one-card-one').className='hand-one-card-one hand-one-cards';
  document.querySelector('.hand-one-card-two').className='hand-one-card-two hand-one-cards';
  document.querySelector('.hand-two-card-one').className='hand-two-card-one hand-two-cards hand-selectors';
  document.querySelector('.hand-two-card-two').className='hand-two-card-two hand-two-cards hand-selectors';
}

function resetGame() {
  document.querySelector('.hand-two-card-one').className='hand-two-card-one hand-two-cards';
  document.querySelector('.hand-two-card-two').className='hand-two-card-two hand-two-cards';
  const placeBet  = document.querySelector(".place-bet-disabled");
  preDealButtons();
  placeBet.value     = "";
  placeBet.className = "place-bet form-fill";
  document.querySelector(".deal").style.display  = "inline";
}

function showCards(response) {
  document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`;
  document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`;
  document.querySelector('.hand-one-card-one').className='hand-one-card-one hand-one-cards hand-selectors';
  document.querySelector('.hand-one-card-two').className='hand-one-card-two hand-one-cards hand-selectors';

  document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`;
  document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`;

  deactivateDealerCards();
  document.querySelector('.dealer-card-2').src=`cards/black-ghost-back.png`;
  document.querySelector('.dealer-card-1').src=`cards/${response.dealer_hand[0]}.png`;
}
