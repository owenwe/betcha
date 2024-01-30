import { CardSuits } from "./CardSuits.ts"
import { CardTypes } from "./CardTypes.ts"
import { Card } from "./Card.ts"

export class Deck {
    cards: Card[] = []
    #cardOrder: number[] = []
    #currentCardIndex: number = 0

    constructor(addJokers: boolean = false) {
        for (let i: number = 0; i < 52; i++) {
            this.#cardOrder.push(i)
        }

        Object.values(CardSuits).forEach((suit: string) => {
            if (suit !== CardSuits.JOKER) {
                let cardSuit: CardSuits
                let cardType: CardTypes
                switch (suit) {
                    case CardSuits.CLUB:
                        cardSuit = CardSuits.CLUB
                        break
                    case CardSuits.DIAMOND:
                        cardSuit = CardSuits.DIAMOND
                        break
                    case CardSuits.HEART:
                        cardSuit = CardSuits.HEART
                        break
                    case CardSuits.SPADE:
                        cardSuit = CardSuits.SPADE
                        break
                }
                Object
                    .values(CardTypes)
                    .filter((t: string | CardTypes) => !isNaN(Number(t)) && t !== CardTypes.JOKER)
                    .forEach((t: string | CardTypes) => {
                        switch (t) {
                            case CardTypes.ACE:
                                cardType = CardTypes.ACE
                                break
                            case CardTypes.TWO:
                                cardType = CardTypes.TWO
                                break
                            case CardTypes.THREE:
                                cardType = CardTypes.THREE
                                break
                            case CardTypes.FOUR:
                                cardType = CardTypes.FOUR
                                break
                            case CardTypes.FIVE:
                                cardType = CardTypes.FIVE
                                break
                            case CardTypes.SIX:
                                cardType = CardTypes.SIX
                                break
                            case CardTypes.SEVEN:
                                cardType = CardTypes.SEVEN
                                break
                            case CardTypes.EIGHT:
                                cardType = CardTypes.EIGHT
                                break
                            case CardTypes.NINE:
                                cardType = CardTypes.NINE
                                break
                            case CardTypes.TEN:
                                cardType = CardTypes.TEN
                                break
                            case CardTypes.JACK:
                                cardType = CardTypes.JACK
                                break
                            case CardTypes.QUEEN:
                                cardType = CardTypes.QUEEN
                                break
                            case CardTypes.KING:
                                cardType = CardTypes.KING
                                break
                        }
                    this.cards.push(new Card(cardSuit, cardType))
                })
            }
        })

        /* this adds jokers to the deck */
        if (addJokers) {
            this.cards.push(new Card(CardSuits.JOKER, CardTypes.JOKER))
            this.#cardOrder.push(52)
            this.cards.push(new Card(CardSuits.JOKER, CardTypes.JOKER))
            this.#cardOrder.push(53)
        }
    }

    get currentIndex(): number { return this.#currentCardIndex }

    get cardsTotal(): number {
        return this.cards.length - this.#currentCardIndex
    }

    deal(numberOfCards: number): Card[] {
        if (numberOfCards < 1) {
            return []
        }

        const clonedDeck: Card[] = []
        for (let i: number = 0; i < numberOfCards; i++) {}
        this.#cardOrder
            .slice(this.#currentCardIndex, this.#currentCardIndex + numberOfCards)
            .forEach((i: number) => {
                clonedDeck.push(this.cards[i])
        })

        if (numberOfCards + this.#currentCardIndex >= this.cards.length) {
            this.#currentCardIndex = this.cards.length
            return clonedDeck
        }
        this.#currentCardIndex += numberOfCards

        return clonedDeck
    }

    shuffle(): void {
        this.#currentCardIndex = 0
        for (let i: number = 0; i <= 7; i++) {
            for (let j: number = 0; j < this.cards.length; j++) {
                let r: number = j + (Math.floor(Math.random() * (this.cards.length - j)))
                let tmp: number = this.#cardOrder[j]
                this.#cardOrder[j] = this.#cardOrder[r]
                this.#cardOrder[r] = tmp
            }
        }
    }
}