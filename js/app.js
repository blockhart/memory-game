const cardTypes = [
	'anchor',
	'ankh',
	'atom',
	'binoculars',
	'car',
	'cloud-sun',
	'crown',
	'coffee'
];

let firstClick,
	pairsFound,
	moveCount,
	seconds,
	marginBeat = 0;
let starRating = 3;
	
let passedCards = [],
	orderOfCards = [];
let moveDisplay = document.querySelector('#moves'),
	timeDisplay = document.querySelector('#timeDisplay'),
	firstStar = document.querySelector("#star1"),
	secondStar = document.querySelector("#star2"), 
	thirdStar = document.querySelector("#star3"),
	resetBtn = document.querySelector("#resetBtn"),
	playAgainBtn = document.querySelector("#playAgainBtn"),
	winModal = document.querySelector("#winModal"),
	winMoves = document.querySelector("#modalMoves"),
	winStars = document.querySelector("#modalStars"),
	winSeconds = document.querySelector("#modalSeconds"),
	winCheck = document.querySelector("#checkAnimation"),
	winContent = document.querySelector("#winModalContent"),
	winBestMessage = document.querySelector("#bestMessage");
let firstCard, secondCard = document.querySelector(".card");
let filledStar = '<i class="fas fa-star"></i>',
	hollowStar = '<i class="far fa-star"></i>';
let listenState="On";

document.addEventListener("DOMContentLoaded", function() {
	start();
},false)

function start() {
	resetGame();
	establishListeners();
}

function resetGame() {
	randomizeCards();
	assignCardsToBoard();
	initializeVariables();
	startTimer();
};

function establishListeners() {
	//Setup resetBtn and playAgainBtn
	resetBtn.addEventListener("click", function() {
		if(listenState == "On") {
			resetGame();
		}
	});

	playAgainBtn.addEventListener("click", function() {
		if(listenState == "On") {
			winModal.classList.toggle("modalShow");
			resetGame();
		}
	});

	//setup listener for card clicks on board
	document.querySelector(".boardSizer").addEventListener("click", function(evt) {
		//listenState ensures player can't click on board during transitions
		if (listenState == "On") {
			if ((firstClick == 0) && (evt.target.getAttribute("cardType") != null) && (evt.target.getAttribute("status") == "closed")) {
			 	firstCard = evt.target;
			 	firstClick = 1;
				flipCard([firstCard]);
			} else if ((firstClick == 1) && (evt.target.getAttribute("cardType") != null) && (firstCard != evt.target) && (evt.target.getAttribute("status") == "closed")) {
			 	secondCard = evt.target;
			 	firstClick = 0;
				flipCard([secondCard]);
				setTimeout(function(){compareCards(firstCard,evt.target);},500);
			};
		};
	});
};

function randomizeCards() {
	// set initial number of open positions
	let openPositionsLeft = 16;
	//"empty" orderOfCards array
	orderOfCards.length = 0;
	// randomize card order
	for (const cardType of cardTypes) {
		// each card needs to be placed twice
		for (let j = 1; j<=2; j++) {
			// generate one of the remaining open spots to be filled
			let placeOpenPosition = 1 + Math.floor(Math.random() * Math.floor(openPositionsLeft));
			//identify randomized open position and assign card to orderOfCards array
			let positionCount = 1;
			for (let k = 0; k < 16; k++) {
				if (positionCount === placeOpenPosition && orderOfCards[k] == null) {
					orderOfCards[k] = cardType;
					openPositionsLeft--;
					// console.log("Placed " + cardTypes[i] + " at location "+ k);
					break;
				} else if (orderOfCards[k] == null) {
					positionCount++;
				};
			};
		};
	};
};

function initializeVariables() {
	pairsFound = 0;
	firstClick =0;
	moveCount = 0;
	starRating = 3;
	moveDisplay.innerHTML = moveCount;
	firstStar.innerHTML = filledStar;
	secondStar.innerHTML = filledStar;
	thirdStar.innerHTML = filledStar;
	if (seconds>0) {
		clearInterval(timer);
		clearInterval(displayTimer);
		winBestMessage.textContent = "";
	}

};

function assignCardsToBoard() {
	var allCards = document.getElementsByClassName("card");
	for (i =0; i<16; i++) {
		allCards[i].setAttribute("iText", "<i class=\"fas fa-" + orderOfCards[i] + "\"></i>");
		allCards[i].setAttribute("cardType", orderOfCards[i]);
		allCards[i].innerHTML="";
		allCards[i].classList.remove("front","paired","matched");
		allCards[i].classList.add("back");
		allCards[i].setAttribute("status","closed");
	}
};

function startTimer() {
	seconds = 0;
	timeDisplay.innerText = seconds;
	timer = setInterval(function(){seconds++;},1000);
	displayTimer = setInterval(function(){timeDisplay.innerText = seconds;},1000);
};

function flipCard(passedCards) {
	listenState = "Off";
	for (const passedCard of passedCards) {
		// clear any previously assigned secondHalfFlip or incorrect classes
		passedCard.classList.remove("secondHalfFlip","incorrect");
		if (passedCard.getAttribute("status")=="closed") {
			//prepare for open flip
			passedCard.setAttribute("status","open");
			//execute timed steps for open flip
			passedCard.classList.add("firstHalfFlip");
			setTimeout(function(){passedCard.classList.add("front");},300);
			setTimeout(function(){passedCard.classList.remove("back");},300);
			setTimeout(function(){passedCard.innerHTML = passedCard.getAttribute("iText");},300);
			setTimeout(function(){passedCard.classList.remove("firstHalfFlip");},300);
			setTimeout(function(){passedCard.classList.add("secondHalfFlip");},300);
		} else {
			//close card(s)
			passedCard.innerHTML = "";
			passedCard.setAttribute("status","closed");
			passedCard.classList.remove("front");
			passedCard.classList.add("back");
		};
	};
	//restore ability to click on cards after animations
	listenState = "On";
};

function compareCards(card1,card2) {
	listenState = "Off";
	//If two cards are same
	if (card1.innerHTML == card2.innerHTML) {
		pairsFound++;
		card1.classList.remove("secondHalfFlip","front");
		card1.classList.add("paired","matched");
		card2.classList.remove("secondHalfFlip","front");
		card2.classList.add("paired","matched");
		changeMovesStars();
		if (pairsFound === 8) {
			setTimeout(win,2000);
		}
	} else {
		card1.classList.add("incorrect");
		card2.classList.add("incorrect");
		//allow some time to see your error
		delayedFlips = setTimeout(function(){flipCard([card1,card2]);}, 1600);
		//setTimeout disables clickability for a bit
		delayedMoveStars = setTimeout(function(){changeMovesStars();}, 1400);
	};
};

function changeMovesStars() {
	//Change move count
	moveCount++;
	moveDisplay.innerHTML = moveCount;
	//Alter Stars displayed
	if (moveCount == 15) {
		thirdStar.innerHTML = hollowStar;
		starRating = 2;
	} else if (moveCount == 21) {
		secondStar.innerHTML = hollowStar;
		starRating = 1;
	};
	//turn listening state back on
	listenState = "On";
};

function win() {
	// Stop timers
	clearInterval(timer);
	clearInterval(displayTimer);
	// Update modal information
	winMoves.textContent = moveCount;
	winStars.textContent = starRating;
	winSeconds.textContent = seconds;
	if (starRating = 3) {
		if(!localStorage.getItem('fastestTime')) {
			localStorage.setItem('fastestTime', seconds);
		} else {
			let fastestTime = localStorage.getItem('fastestTime');
			if (seconds < fastestTime) {
				marginBeat = fastestTime - seconds;
				localStorage.setItem('fastestTime', seconds);
				winBestMessage.textContent = "You beat your previous record to 3 stars by " + marginBeat + " seconds!"
			}
		}
	
	}
	// Show modal information
	winModal.classList.toggle("modalShow");

}