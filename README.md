#Memory Game - Bill Lockhart's submission

###Core files
1. Index.html
2. primary.css
3. animations.css - most animations located here.
4. responsive.css - dependencies on viewport size
5. app.css - sole javascript page.

###Dependencies
Beyond the files above, the sole dependency for this game is Font Awesome. I tried to do this with as much 'pure' CSS and javascript as possible. Given the specific animations I created (see below), I found bootstrap actually caused problems.

### Overview of game mechanics

####Board Positioning
Most of the display structures should be reasonably self-evident.  The "board" for the "cards" is created by the section class "BoardSizer" (which creates a square space 80% the width of the viewport) and div class "cardPositioning" (which creates a flex box sized to BoardSizer that will allow the positioning of the cards).

The board, cards, animations, and (in particular) the vertical positioning of the font-awesome icons are set as functions of viewport width.  The animation for successful matches in particular requires the coordination of card width, margin, and line-height so that the font-awesome icons remains vertically centered as the card is transformed to create the effect.

####Javascript overview
Variables are all set upfront, then the start() function, then the eventListeners, then all the relevant functions.

I had fun with the function that shuffles the cards.  I found online various descriptions of the Fisher-Yates shuffle algorithm, but I wanted to come up with a function that didn't rely on having to make a card array that held duplicates of the same cards.  The randomizeCards function creates randomized positions of the given 8 cards over 16 positions.

I also improved (I think) on the animations for "flipping" cards relative to what is shown as an example on the Udacity site.  For example, if one looks carefully, one can see the 'reverse' of the font-awesome icons when it starts flipping.  In my animation, I first flip the "back" of the card 90 degrees, so that it disappears ("firstHalfFlip"), then from that point rotate in the  "front" of the card with the relevant icon displayed ("secondHalfFlip"). This is managed by the function "flipCard(passedCards)" which is designed to flip either one or two cards, depending on how many are in the passedCards expression, and manage in this single function whether the the card started "opened" or "closed."

###Items of note

* The variable "listenState" helps manage someone clicking on a card before some prior animation had finished.
* The various setTimeouts are designed so that a) animations happen in order and b) listenState might not turn "on" before an animation as finished. I also used one to ensure you have a chance to see the cards that were "wrongly" paired before they turn over on you.
* Instead of a leaderboard, I added a localStorage function that tracks the fastest time you have to achieve three stars, and then only messages this when you've beat it (including in the message the "by how much").



