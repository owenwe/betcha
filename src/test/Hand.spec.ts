import { CardSuits } from "../lib"
import { CardTypes } from "../lib"
import { Card } from "../lib"
import { Deck } from "../lib"
import { Hand } from "../lib"

test('test royal/straight flush, flush, and straight', () => {
    const deck: Deck = new Deck()
    const cards: Card[] = deck.deal(5)
    const hand: Hand = new Hand(cards)

    expect(hand.cards.length).toBe(cards.length)
    expect(hand.isRoyalWithCheeseFlush()).toBeTruthy()
    expect(hand.isStraightFlush()).toBeTruthy()
    expect(hand.isFlush()).toBeTruthy()
    expect(hand.isStraight()).toBeTruthy()
    expect(hand.evaluate()).toBe(Hand.Types.ROYAL_FLUSH)
})

test('test full house', () => {
    const hand1 = new Hand([
        new Card(CardSuits.DIAMOND, CardTypes.TWO),
        new Card(CardSuits.CLUB, CardTypes.TWO),
        new Card(CardSuits.DIAMOND, CardTypes.THREE),
        new Card(CardSuits.CLUB, CardTypes.THREE),
        new Card(CardSuits.SPADE, CardTypes.THREE)
    ])
    const hand2 = new Hand([
        new Card(CardSuits.SPADE, CardTypes.TEN),
        new Card(CardSuits.HEART, CardTypes.FOUR),
        new Card(CardSuits.DIAMOND, CardTypes.JACK),
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.SPADE, CardTypes.EIGHT)
    ])

    expect(hand1.isFullHouse()).toBeTruthy()
    expect(hand2.isFullHouse()).toBeFalsy()
    expect(hand1.evaluate()).toBe(Hand.Types.FULL_HOUSE)
})

test('test pair, 3, and 4 of a kind', () => {
    const hand = new Hand([
        new Card(CardSuits.DIAMOND, CardTypes.ACE),
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.HEART, CardTypes.ACE),
        new Card(CardSuits.SPADE, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.QUEEN)
    ])

    expect(hand.isFourOfAKind()).toBeTruthy()
    expect(hand.isThreeOfAKind()).toBeTruthy()
    expect(hand.isPair()).toBeTruthy()
    expect(hand.evaluate()).toBe(Hand.Types.FOUR_OF_A_KIND)
})

test('test two pair', () => {
    const hand = new Hand([
        new Card(CardSuits.DIAMOND, CardTypes.ACE),
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.HEART, CardTypes.TEN),
        new Card(CardSuits.SPADE, CardTypes.QUEEN),
        new Card(CardSuits.DIAMOND, CardTypes.QUEEN)
    ])

    expect(hand.isTwoPair()).toBeTruthy()
    expect(hand.evaluate()).toBe(Hand.Types.TWO_PAIR)
})

test('test isStraight', () => {
    const hand = new Hand([
        new Card(CardSuits.CLUB, CardTypes.KING),
        new Card(CardSuits.HEART, CardTypes.NINE),
        new Card(CardSuits.CLUB, CardTypes.FIVE),
        new Card(CardSuits.SPADE, CardTypes.FOUR),
        new Card(CardSuits.DIAMOND, CardTypes.FOUR),
        new Card(CardSuits.CLUB, CardTypes.THREE),
        new Card(CardSuits.SPADE, CardTypes.TWO)
    ])

    expect(hand.isStraight()).toBeFalsy()

    hand.delt([
        new Card(CardSuits.CLUB, CardTypes.KING),
        new Card(CardSuits.HEART, CardTypes.TEN),
        new Card(CardSuits.CLUB, CardTypes.FIVE),
        new Card(CardSuits.SPADE, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.FIVE),
        new Card(CardSuits.CLUB, CardTypes.JACK),
        new Card(CardSuits.SPADE, CardTypes.QUEEN)
    ])

    expect(hand.evaluate()).toBe(Hand.Types.STRAIGHT)

    hand.delt([
        new Card(CardSuits.CLUB, CardTypes.TWO),
        new Card(CardSuits.HEART, CardTypes.TEN),
        new Card(CardSuits.CLUB, CardTypes.FIVE),
        new Card(CardSuits.SPADE, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.FOUR),
        new Card(CardSuits.CLUB, CardTypes.TEN),
        new Card(CardSuits.SPADE, CardTypes.THREE)
    ])

    expect(hand.evaluate()).toBe(Hand.Types.STRAIGHT)
})

test('test adding/removing cards from Hand and evaluate', () => {
    const deck: Deck = new Deck()
    deck.shuffle()
    const cards: Card[] = deck.deal(3)
    const hand: Hand = new Hand(cards)
    hand.addCards(deck.deal(3))
    hand.addCard(deck.deal(1)[0])

    expect(hand.cards.length).toBe(7)

    const result = hand.evaluate()
    console.log(`result from hand: ${result}, hand = ${hand.toString()}`)

    expect(result).toBeLessThanOrEqual(9)
    expect(result).toBeGreaterThanOrEqual(0)
})

test('test Hand.highestCard', () => {
    const hand = new Hand([
        new Card(CardSuits.CLUB, CardTypes.TWO),
        new Card(CardSuits.HEART, CardTypes.FOUR),
        new Card(CardSuits.DIAMOND, CardTypes.SIX),
        new Card(CardSuits.SPADE, CardTypes.NINE),
        new Card(CardSuits.CLUB, CardTypes.TWO)
    ])

    const highestCard: Card = Hand.highestCard(hand.cards)

    expect(highestCard.suit).toBe(CardSuits.SPADE)
    expect(highestCard.value).toBe(CardTypes.NINE)

    let result: Card = Hand.highestCard([
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.SPADE, CardTypes.ACE),
        new Card(CardSuits.HEART, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.ACE)
    ])

    expect(result.suit).toBe(CardSuits.SPADE)
    expect(result.value).toBe(CardTypes.ACE)

    result = Hand.highestCard([
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.HEART, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.ACE)
    ])

    expect(result.suit).toBe(CardSuits.HEART)

    result = Hand.highestCard([
        new Card(CardSuits.CLUB, CardTypes.ACE),
        new Card(CardSuits.DIAMOND, CardTypes.ACE)
    ])

    expect(result.suit).toBe(CardSuits.DIAMOND)
})