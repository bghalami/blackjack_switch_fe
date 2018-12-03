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


deactivateLogin();
deactivateCreate();

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
  document.querySelector(".hit").style.display  = "inline";
  document.querySelector(".stay").style.display  = "inline";
  document.querySelector(".switch").style.display  = "inline";
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
  });
}

function dealGame() {
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
    postDealButtons();
    showCards(response)
  });
}

function showCards(response) {
  document.querySelector('.hand-one-card-one').src=`cards/${response.players[0].hand_one[0]}.png`
  document.querySelector('.hand-one-card-one').className=`hand-one-card-one hand-one-cards-flipped`

  document.querySelector('.hand-one-card-two').src=`cards/${response.players[0].hand_one[1]}.png`
  document.querySelector('.hand-one-card-two').className=`hand-one-card-two hand-one-cards-flipped`

  document.querySelector('.hand-two-card-one').src=`cards/${response.players[0].hand_two[0]}.png`
  document.querySelector('.hand-two-card-one').className=`hand-two-card-one hand-two-cards-flipped`

  document.querySelector('.hand-two-card-two').src=`cards/${response.players[0].hand_two[1]}.png`
  document.querySelector('.hand-two-card-two').className=`hand-two-card-two hand-two-cards-flipped`

  document.querySelector('.dealer-card-two').src=`cards/${response.dealer_hand[1]}.png`
  document.querySelector('.dealer-card-two').className=`dealer-card-two-flipped dealer-cards`
}
