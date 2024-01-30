import { CardTypes } from "./CardTypes.ts"
import { Card } from "./Card.ts"

export enum SUIT_ORDER {
    CLUB,
    DIAMOND,
    HEART,
    SPADE
}

export enum RANK_ORDER {
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    TEN,
    JACK,
    QUEEN,
    KING,
    ACE
}

export enum HAND_TYPES {
    HIGH_CARD,
    PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    STRAIGHT,
    FLUSH,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    STRAIGHT_FLUSH,
    ROYAL_FLUSH
}

export class Hand {
    public static SuitOrder = SUIT_ORDER
    public static RankOrder = RANK_ORDER
    public static Types = HAND_TYPES

    public static highestCard(cards: Card[]): Card {
        if (cards.length < 2) {
            throw Error('not enough cards to determine highest')
        }

        let currentHighest: Card = cards[0]
        for (let i: number = 1; i < cards.length; i++) {
            const nextCard: Card = cards[i]
            if (nextCard.isHigherThan(currentHighest)) {
                currentHighest = nextCard
            }
        }
        return currentHighest
    }

    #cards: Card[]

    constructor(cards: Card[] = []) {
        if (cards.length >= 0) {
            this.#cards = cards
        } else {
            throw Error('invalid number of cards provided')
        }
    }

    public get cards(): Card[] { return this.#cards }

    private getCardAt(index: number): Card {
        if (index < this.#cards.length) {
            return this.#cards[index]
        } else {
            throw Error(`invalid index (${index}) for ${this.#cards.length} cards`)
        }
    }

    private matches(card: Card, pile: Card[]): number {
        return pile.filter((c: Card): boolean => c.value === card.value).length
    }

    private sortByValue(): void {
        this.#cards.sort((a: Card, b: Card) => {
            return b.value - a.value
        })
    }

    private uniqueValues(): number[] {
        return this.#cards
            .map((c: Card) => c.value)
            .filter((v: CardTypes, i: number, a: CardTypes[]) => a.indexOf(v) === i)
    }

    private uniqueRanks(): number[] {
        return this.#cards
            .map((c: Card) => c.rank)
            .filter((v: number, i: number, a: number[]) => a.indexOf(v) === i)
    }

    private removeCardsByValue(cards: Card[], value: CardTypes): Card[] {
        return cards.filter((c: Card): boolean => c.value !== value)
    }

    private hasPair(cards: Card[]): boolean {
        let foundPair: boolean = false

        for (let i: number = 0; i < cards.length; i++) {
            const checkCard: Card = cards[i]
            const checkHand: Card[] = cards.filter((c: Card): boolean => c.imageId !== checkCard.imageId)
            const matches: number = this.matches(checkCard, checkHand)
            if (matches > 0) {
                foundPair = true
                break
            }
        }

        return foundPair
    }

    private hasThreeOfAKind(cards: Card[]): boolean {
        let foundPair: boolean = false

        for (let i: number = 0; i < cards.length; i++) {
            const checkCard: Card = cards[i]
            const checkHand: Card[] = cards.filter((c: Card): boolean => c.imageId !== checkCard.imageId)
            const matches: number = this.matches(checkCard, checkHand)
            if (matches > 1) {
                foundPair = true
                break
            }
        }

        return foundPair
    }

    private hasStraight(cards: number[]): boolean {
        if (cards.length < 5) {
            return false
        }

        const results: boolean[] = []

        cards.reduce((accumulator: number, currentValue: number): number => {
            const v: number = accumulator - currentValue
            results.push(v === 1)
            return currentValue
        })

        return results.every((v: boolean) => v)
    }

    public isPair(): boolean {
        let foundPair: boolean = false

        for (let i: number = 0; i < this.#cards.length; i++) {
            const checkCard: Card = this.#cards[i]
            const checkHand: Card[] = this.without(checkCard)
            const pairs: number = this.matches(checkCard, checkHand)
            if (pairs > 0) {
                foundPair = true
                break
            }
        }

        return foundPair
    }

    public isThreeOfAKind(): boolean {
        let foundPair: boolean = false

        for (let i: number = 0; i < this.#cards.length; i++) {
            const checkCard: Card = this.#cards[i]
            const checkHand: Card[] = this.without(checkCard)
            const pairs: number = this.matches(checkCard, checkHand)
            if (pairs > 1) {
                foundPair = true
                break
            }
        }

        return foundPair
    }

    public isTwoPair(): boolean {
        let foundTwoPair: boolean = false
        if (this.hasPair(this.#cards)) {
            for (let i: number = 0; i < this.#cards.length; i++) {
                const checkCard: Card = this.#cards[i]
                const checkHand: Card[] = this.without(checkCard)
                const matches: number = this.matches(checkCard, checkHand)
                if (matches > 0) {
                    const remaining: Card[] = this.removeCardsByValue(this.#cards, checkCard.value)
                    if (this.hasPair(remaining)) {
                        foundTwoPair = true
                    }
                    break
                }
            }
        }
        return foundTwoPair
    }

    public isFourOfAKind(): boolean {
        let foundPair: boolean = false

        for (let i: number = 0; i < this.#cards.length; i++) {
            const checkCard: Card = this.#cards[i]
            const checkHand: Card[] = this.without(checkCard)
            const pairs: number = this.matches(checkCard, checkHand)
            if (pairs === 3) {
                foundPair = true
                break
            }
        }

        return foundPair
    }

    public isFlush(): boolean {
        let foundFlush: boolean = false

        for (let i: number = 0; i < this.#cards.length; i++) {
            const checkCard: Card = this.#cards[i]
            const checkHand: Card[] = this.without(checkCard)
            const matches: number = checkHand.filter((c: Card): boolean => c.suit === checkCard.suit).length
            if (matches >= 4) {
                foundFlush = true
                break
            }
        }

        return foundFlush
    }

    public isFullHouse(): boolean {
        let foundFullHouse: boolean = false
        if (this.hasThreeOfAKind(this.#cards)) {
            for (let i: number = 0; i < this.#cards.length; i++) {
                const checkCard: Card = this.#cards[i]
                const checkHand: Card[] = this.without(checkCard)
                const matches: number = this.matches(checkCard, checkHand)
                if (matches === 2) {
                    const remaining: Card[] = this.removeCardsByValue(this.#cards, checkCard.value)
                    if (this.hasPair(remaining)) {
                        foundFullHouse = true
                    }
                    break
                }
            }
        }
        return foundFullHouse
    }

    public isStraight(): boolean {
        if (this.#cards.length < 5) {
            return false
        }

        let foundStraight: boolean = false

        // ace-low
        this.sortByValue()
        const cardValues: number[] = this.uniqueValues()
        for (let i: number = 0; i < cardValues.length; i++) {
            if ((i + 5) > cardValues.length) {
                break
            }

            // get the unique values
            const cards: number[] = cardValues.slice(i, i+5)

            if (this.hasStraight(cards)) {
                foundStraight = true
                break
            }
        }

        if (foundStraight) {
            return true
        }

        // ace-high
        this.sort()
        const cardRanks: number[] = this.uniqueRanks()
        for (let i: number = 0; i < cardRanks.length; i++) {
            if ((i + 5) > cardRanks.length) {
                break
            }

            const cards: number[] = cardRanks.slice(i, i+5)

            if (this.hasStraight([...new Set(cards)])) {
                foundStraight = true
                break
            }
        }

        return foundStraight
    }

    public isStraightFlush(): boolean {
        return this.isStraight() && this.isFlush()
    }

    public isRoyalWithCheeseFlush(): boolean {
        if (this.isStraightFlush()) {
            this.sort()
            return (this.getCardAt(0).value === CardTypes.ACE)
        }
        return false
    }

    public sort(): void {
        this.#cards.sort((a: Card, b: Card): number => {
            return a.isHigherThan(b) ? -1 : 1
        })
    }

    public addCard(card: Card): void {
        this.#cards.push(card)
    }

    public addCards(cards: Card[]): number {
        this.#cards = this.#cards.concat(cards)
        return this.#cards.length
    }

    public delt(cards: Card[]): void {
        this.#cards = cards
    }

    public without(card: Card): Card[] {
        return this.#cards.filter((c: Card): boolean => c.imageId !== card.imageId)
    }

    public withoutValue(card: Card): Card[] {
        return this.#cards.filter((c: Card): boolean => c.value !== card.value)
    }

    public hasCard(card: Card): boolean {
        return this.#cards.some((c: Card): boolean => c.imageId === card.imageId)
    }

    public evaluate(): HAND_TYPES {
        if (this.isRoyalWithCheeseFlush()) {
            return Hand.Types.ROYAL_FLUSH
        } else if (this.isStraightFlush()) {
            return Hand.Types.STRAIGHT_FLUSH
        } else if (this.isFourOfAKind()) {
            return Hand.Types.FOUR_OF_A_KIND
        } else if (this.isFullHouse()) {
            return Hand.Types.FULL_HOUSE
        } else if (this.isFlush()) {
            return Hand.Types.FLUSH
        } else if (this.isStraight()) {
            return Hand.Types.STRAIGHT
        } else if (this.isThreeOfAKind()) {
            return Hand.Types.THREE_OF_A_KIND
        } else if (this.isTwoPair()) {
            return Hand.Types.TWO_PAIR
        } else if (this.isPair()) {
            return Hand.Types.PAIR
        } else {
            return Hand.Types.HIGH_CARD
        }
    }

    public toString(): string {
        const hand: string[] = []
        this.#cards.forEach((c: Card) => {
            hand.push(`${c.imageId}`)
        })
        return hand.join(', ')
    }
}