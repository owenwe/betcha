import { Deck } from "../lib"
import { Card } from "../lib"

test('test Deck.cardsTotal', () => {
    const deck: Deck = new Deck()

    expect(deck.cardsTotal).toBe(52)
})

test('test Deck.deal', () => {
    const deck: Deck = new Deck()
    const cards: Card[] = deck.deal(5)

    expect(cards.length).toBe(5)
    expect(deck.cardsTotal).toBe(47)
})