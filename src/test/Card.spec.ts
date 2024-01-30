import { Card, CardSuits, CardTypes } from "../lib"

const card1: Card = new Card(CardSuits.DIAMOND, CardTypes.QUEEN)
const card2: Card = new Card(CardSuits.SPADE, CardTypes.JACK)

test('test imageId', () => {
    expect(card1.imageId).toBe('D-Q')
    expect(card2.imageId).toBe('S-J')
})

test('test Card.isHigherThan', () => {
    expect(card1.isHigherThan(card2)).toBe(true)
})