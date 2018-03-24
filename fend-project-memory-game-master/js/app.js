// Add a New player later...

// Cards Array
const defaultCards = [
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-bolt",
    "fa-cube",
    "fa-leaf",
    "fa-bicycle",
    "fa-bomb",
];
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


// Create a list that holds all of your cards 
const deck = $('.deck');
const mixedCards = shuffle(defaultCards);
generateDeck(); 

// Generates the HTML code for the cards and open each element to the deck
function generateDeck() {
    for (let a = 0; a < 16; a += 1) {
        $(deck).append('<li class="card"><i class="fa ' + mixedCards[a] + '"></i></li>');
    }
}

// After the first card is clicked, the timer starts
function startTimer() {
    if (firstClickedCard == 1) {
        $('#time-panel').timer({
            format: '%H:%M:%S'
        });
    }
}

// Seconds to minutes and seconds
function fancyTimeFormat(time) {
    //H, M and S
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) /60);
    let secs = time % 60;
    // Output like "1:01" or "1:01:01" or "10:01:01"
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" +(mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" +(secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

//Prevent Click function
function preventClick() {
    $('.card').each(function(index) {
        $('.card').addClass('preventclick');
    });
}

//Clicked card function
function checkClickedCard(clickedCard) {
    if ($(clickedCard).hasClass('clicked') || $('.card').hasClass('preventclick')) {
        return true;
    } else {
        return false;
    }
}


// function to add open show class
function showCard(clickedCard) {
    $(clickedCard).addClass('open show')
}

//remove the star function
let starCountResult = 3;
function removeStar(index) {
    let star = $('.stars').find('i').get(index);
    $(star).animateCss('bounceOut', function() {
        $(star).addClass('remove-star');
        starIndex += 1;
        starCountResult -= 1;
    });
}

// animations
$.fn.extend({
    animateCss: function(animationName, callBack) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callBack) {
            callBack();
        }
      });
      return this;  
    }
});


// star rating and count the move
let starIndex = 0;
function starRating() {
    if (moveCount == 15) {
        removeStar(starIndex);
    } else if (moveCount == 20) {
        removeStar(starIndex);
    }
}
// movecounter function
let moveCount = 0;
function moveCounter() {
    moveCount += 1;
    $('.moves').text(moveCount);
    starRating();
}

// remove prevent click function
function removePreventClick() {
    $('.card').each(function(index) {
        $('.card').removeClass('preventclick');
    });
}

// Open card + CSS animation
let openCards = [];
function correctCards() {
    $(openCards[0]).animateCss('flip');
    $(openCards[1]).animateCss('flip');
}

// Hide cards function
function hideCard() {
    $(openCards[0]).removeClass('clicked open show');
    $(openCards[1]).removeClass('clicked open show');
}

// compare cards function
function compareCards() {
    let card1Class = $(openCards[0]).children('i').attr('class').split(' ')[1];
    let card2Class = $(openCards[1]).children('i').attr('class').split(' ')[1];
    if (card1Class == card2Class) {
        setTimeout(function() {
            correctCards();
            moveCounter();
            matchedCards();
            setTimeout(function() {
                openCards = [];
                removePreventClick();
            }, 500);
        }, 1000);
    } else {
        moveCounter();
        setTimeout(function() {
            hideCard();
            setTimeout(function () {
                openCards = [];
                removePreventClick();
            }, 500);
        }, 1000);
    }
}

// store open card
function storeOpenCard(clickedCard) {
    if (openCards.length < 1) {
        openCards[0] = clickedCard;
    } else if (openCards.length < 2) {
        openCards[1] = clickedCard;
        preventClick();
        compareCards();
    }
}

// Card click and timer setup
let firstClickedCard = 0;
$('.card').on('click', function() {
    firstClickedCard += 1;
    startTimer();
    let clickedCard = this;
    if (checkClickedCard(clickedCard) === true) {
        console.log('try another card');
    } else {
        $(clickedCard).addClass('clicked');
        showCard(clickedCard);
        storeOpenCard(clickedCard);
    }
});


// Stop timer
function stopTimer() {
    $('#time-panel').timer('pause');
}

// Function Matched Cards
let matchedPairCount = 0;

function matchedCards() {
    $(openCards[0]).addClass('match');
    $(openCards[1]).addClass('match');
    matchedPairCount += 1;
    if (matchedPairCount ===8) {
        stopTimer();
        let elapsedTime = $('time-panel').data('seconds');
        let gameDuration = fancyTimeFormat(elapsedTime);
        setTimeout(function() {
            endModal(gameDuration);
        }, 1000);
    }
}

// function sets variable moveCount and HTML back to 0
function moveCountReset() {
    moveCount = 0;
    $('.moves').text(moveCount);
}

// fn starReset removes the class with stars and put it back to 3
function starsReset() {
    starIndex = 0;
    $('.stars').find('i').each(function(index) {
        $('i').removeClass('remove-star');
    });
}

// game result and  modal
function endModal(gameDuration) {
    $('.container').empty();
    $('.container').html(
        `<header>
            <h1>Well Done, You Won!</h1>
         </header>
         <p><strong>` + moveCount + `</strong> moves have been made</p>
         <p>Your game duration time is: <strong>` + gameDuration + `</strong></p>
         <p>Your star rating is: <strong>` + starCountResult + `</strong></p>
         <br>
         <h2>I hope that You liked the game</h2>
         <h2>To restart the game and play again, please click on the button provided below</h2>
         <button class="restart restart-button" type="button">Restart The Game</button>`
    );
}









/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
