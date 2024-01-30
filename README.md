# Betcha
A poker-based card game written in typescript

This is a simple card game, but the source code contains an excellent starting point for; a standard 52 card deck with 4 suits (jokers are optional), a deck of cards with pre-made graphics, and evaluating a poker hand.

## The game
The goal of the game is to see how many rounds you can go before your points go to zero (or below). It's kind of like Texas hold 'em meets 21. You first bet 5 points to get your 2 cards and 3 community cards are laid down. The house also gets 2 cards face down. You can bet 5 points to show another community card or if you have enough points you can bet 10 to discard your 2 cards and get a fresh 2 from the deck. You do this until there are 5 community cards showing and then you can make the same 2 types of bets to see if your cards, combined with the community cards make a better 5-card hand than the house.

The game uses a standard 52-card deck. Remembering what cards were played would serve you well in later rounds when there are few cards left to play. When the round is over and there are not enough cards left, a new shuffled deck will be used.

### Running/Playing
The game is a react component written in typescript and setup to be ran as a web page. You will need npm/node installed. After cloning the source code, from a shell/terminal run the following in the cloned directory:

`npm run build`

Then run:

`npm run preview`

In a browser go to http://localhost:8080/betcha/

You can also go to https://owenwe.github.io/betcha/

### Cheating
This game was made with React so using the browswer's dev tools along with the React extension will allow you to see what cards the house is holding. Sometimes this helps, sometimes.

### Scoring
At the end of the round your 2 cards combined with the 5 community cards will be evaluated for the best 5-card hand. If your hand is higher than the house's hand, you win and your prize points are given back plus points based on what kind of hand you had (see below). When there is a tie, the highest card between yours and the house's 2-card hand determines the winner. When it comes to 2 cards with the same value, suit order decides the higher of the two same-value cards (Spade, Heart, Diamond, Club).

|Hand|Pair|
|:--:|:--:|
|Pair|5|
|Two Pair|10|
|Three of a Kind|15|
|Straight|20|
|Flush|25|
|Full House|30|
|Four of a Kind|40|
|Straight Flush|50|
|Royal Flush|100|

## The code
The main classes written for this game are; Card, Deck, and Hand. A Card is made up of a suit and a value. A Deck is basically a collection of Cards with `deal()` and `shuffle()` methods/functions. A Hand has a collection of 1 or more Cards and some methods/functions to manipulate or test the collection.

### Card

`static backImageSrc(): string`  
Returns the url to the image for the backside of every card.

`suit: CardSuits`  
The value of the card's suit defined by the `CardSuits` enum.

`value: CardTypes`  
The value of the card's value defined by the `CardTypes` enum.

`rank: number`  
A number value given to each card with a specific `CardTypes` value.

`key: string`  
A string value unique to every card instance.

`imageId: string`  
A 3-character string identifying the card's suit and value.

`imageSrc: string`  
A url to the card's image file.

`isHigherThan(card: Card): boolean`  
Will return `true` if the card is higher in rank, suit and value than the passed card. When passed a card with the same value, the suit's will be compared; Spades over Hearts, Hearts over Diamonds, Diamonds over Clubs.

`toString(): string`  
Returns a simple string representation of the card, e.g. "Jack of Clubs".

### Deck

`cards: Card[]`  
An array of Card instances. 52 cards total if `true` (`addJokers`) was not passed in the constructor. The cards are ordered just as they would be in a fresh real deck; ace to king for every suit. To randomize the cards you have to call the `shuffle()` function and use the `deal()` function to return 1 or more cards from the deck.

`currentIndex: number`  
The current index for the `cards` array. This gets updated when functions like `deal()` are called on the deck instance.

`cardsTotal: number`  
The number of cards remaining in the deck. This value will become less the more cards are returned from the `deal()` function.

`deal(numberOfCards: number): Card[]`  
A function that returns and array of cards from the deck. The number you pass to `deal()` is the number of cards in the array you will get back. Passing a value that is more than `cardsTotal` will return an array of `cardsTotal` length.

`shuffle(): void`  
A function that will randomize the order of cards as they are returned from the `deal()` function.

### SUIT_ORDER
CLUB = 0  
DIAMOND = 1  
HEART = 2  
SPADE = 3

### RANK_ORDER
TWO = 0  
THREE = 1  
FOUR = 2  
FIVE = 3  
SIX = 4  
SEVEN = 5  
EIGHT = 6  
NINE = 7  
TEN = 8  
JACK = 9  
QUEEN 10  
KING = 11  
ACE = 12

### HAND_TYPES
HIGH_CARD = 0  
PAIR = 1  
TWO_PAIR = 2
THREE_OF_A_KIND = 3  
STRAIGHT = 4  
FLUSH = 5  
FULL_HOUSE = 6  
FOUR_OF_A_KIND = 7  
STRAIGHT_FLUSH = 8
ROYAL_FLUSH = 9

### Hand

`static SuitOrder: typeof SUIT_ORDER`  
An enum that defines suit order.

`static RankOrder: typeof RANK_ORDER`  
An enum that defines the order of card values.

`static Types: typeof HAND_TYPES`  
An enum that defines the types of hands possible and their order.

`static highestCard(cards: Card[]): Card`  
A static function that expects an array of cards and will return the card in the passed array that is the highest value/suit/rank.

`cards: Card[]`  
An array of 1 or more cards (usually 5 or 7).

`isPair(): boolean`  
Returns `true` if the cards collection contains at least 2 matching cards.

`isTwoPair(): boolean`  
Returns `true` if the cards collection contains 2 sets of at least 2 matching cards.

`isThreeOfAKind(): boolean`  
Returns `true` if the cards collection contains at least 3 matching cards.

`isStraight(): boolean`  
Returns `true` if the cards collection contains at least 5 cards in sequential value.

`isFlush(): boolean`  
Returns `true` if the cards collection contains at least 5 cards with the same suit.

`isFullHouse(): boolean`  
Returns `true` if the cards collection contains a set of matching cards and a set of 3 different matching cards.

`isFourOfAKind(): boolean`  
Returns `true` if the cards collection contains at least 4 matching cards.

`isStraightFlush(): boolean`  
Returns `true` if the cards collection contains at least 5 cards in sequential order and they all have the same suit.

`isRoyalWithCheeseFlush(): boolean`  
Returns `true` if the cards collection contains meet the same criteria for `isStraightFlush()` and the highest value card is an Ace. So a straight with Ten, Jack, Queen, King, Ace and they all have the same suit. Pretty much impossible to get, and yes it's a Pulp Fiction referrence.

`sort(): void`  
Sorts the cards by descending order of value.

`addCard(card: Card): void`  
Adds a card to the cards collection.

`addCards(cards: Card[]): number`  
Adds the array of cards to the cards collection and returns the total number of cards in the collection.

`delt(cards: Card[]): void`  
Replaces the card collection with the passed array of cards.

`without(card: Card): Card[]`  
Returns the card collection without the passed card (if it exists in the collection). Will match the suit and value of the card.

`withoutValue(card: Card): Card[]`  
Returns the card collection without cards matching the value of the passed card.

`hasCard(card: Card): boolean`  
Returns `true` if the card collection contains a card with the same suit and value.

`evaluate(): HAND_TYPES`  
Returns the type of hand the card collection makes.

`toString(): string`  
Returns a simplified string version of each card in the card collection.