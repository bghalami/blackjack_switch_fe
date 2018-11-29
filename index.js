const createAccountButton = document.querySelector(".create-account-button");
const goBackButton        = document.querySelector(".go-back");
const loginButton        = document.querySelector(".login-button");

let usernameLogin   = document.querySelector(".username-login");
let passwordLogin   = document.querySelector(".password-login");

const accountCreate = document.querySelector(".account-create");
const loginScreen   = document.querySelector(".login-screen");
const playGame      = document.querySelector(".play-game");

accountCreate.style.display = "none";
playGame.style.display = "none";

deactivateLogin();

function unlockLogin() {
  if ((usernameLogin.value) && (passwordLogin.value)) {
    activateLogin();
  } else {
    deactivateLogin();
  }
}

function deactivateLogin() {
  loginButton.className = "landing-button login-button disabled-button"
}

function activateLogin() {
  loginButton.className = "landing-button login-button"
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

function letsPlay() {
  loginScreen.style.display   = "none";
  accountCreate.style.display = "none";
  playGame.style.display      = "block";
};

createAccountButton.addEventListener("click", createLoginSwitch);
goBackButton.addEventListener("click", createLoginSwitch);
loginButton.addEventListener("click", tryToLogin);

usernameLogin.addEventListener("input", unlockLogin);
passwordLogin.addEventListener("input", unlockLogin);

function tryToLogin() {
  var request = new XMLHttpRequest();
  request.open('POST', 'https://bens-blackjack-switch.herokuapp.com/api/v1/login', true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  request.onreadystatechange = function() {
    if (this.status === 202) {
      letsPlay();
    } else {
      let alert = document.querySelector(".heads-up");
      alert.innerHTML = "Something went wrong, please try again";
    }
    console.log("oo");
  }

  request.send(`username=${usernameLogin.value}&password=${passwordLogin.value}`);
  console.log("yo");
}
