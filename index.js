const createAccountButton = document.querySelector(".create-account-button");
const goBackButton        = document.querySelector(".go-back")

const accountCreate = document.querySelector(".account-create");
const loginScreen   = document.querySelector(".login-screen");
const playGame      = document.querySelector(".play-game");

accountCreate.style.display = "none";
playGame.style.display = "none";

function createLoginSwitch() {
  if (loginScreen.style.display === "none") {
    loginScreen.style.display   = "block";
    accountCreate.style.display = "none";
  } else {
    loginScreen.style.display   = "none";
    accountCreate.style.display = "block";
  }
}

function letsPlay() {
  loginScreen.style.display   = "none";
  accountCreate.style.display = "none";
  playGame.style.display      = "block";
}

createAccountButton.addEventListener("click", createLoginSwitch);
goBackButton.addEventListener("click", createLoginSwitch);

let usernameLogin   = document.querySelector(".username-login");
let passwordLogin   = document.querySelector(".password-login");

var request = new XMLHttpRequest();

request.open('POST', 'https://bens-blackjack-switch.herokuapp.com/api/v1/login', true);

//Send the proper header information along with the request
request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

request.onreadystatechange = function() { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      letsPlay
    } else {
      loginScreen.style.display   = "none";
      accountCreate.style.display = "none";
      playGame.style.display      = "none";
    }
}

request.send(`username=${usernameLogin.val}&password=${usernamePassword.val}`);
