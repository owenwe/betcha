import { CardSuits } from "./CardSuits.ts"
import { CardTypes } from "./CardTypes.ts"

export class Card {
    public static get backImageSrc(): string {
        return 'https://assets.codepen.io/1693575/back.png?format=auto'
    }

    suit: CardSuits
    value: CardTypes
    rank: number
    #key: string
    #imageId: string

    constructor(suit: CardSuits, value: CardTypes) {
        this.suit = suit
        this.value = value

        const suitValueKeys: {[k: string]: string} = {
            suit: this.suit.charAt(0),
            value: this.suit === CardSuits.JOKER ? 'J' : `${this.value}`
        }

        switch (this.value) {
            case CardTypes.JOKER:
                this.rank = 0
                break
            case CardTypes.ACE:
                this.rank = 14
                break
            case CardTypes.KING:
                suitValueKeys['value'] = 'K'
                this.rank = 13
                break
            case CardTypes.QUEEN:
                suitValueKeys['value'] = 'Q'
                this.rank = 12
                break
            case CardTypes.JACK:
                suitValueKeys['value'] = 'J'
                this.rank = 11
                break
            case CardTypes.TEN:
                this.rank = 10
                break
            case CardTypes.NINE:
                this.rank = 9
                break
            case CardTypes.EIGHT:
                this.rank = 8
                break
            case CardTypes.SEVEN:
                this.rank = 7
                break
            case CardTypes.SIX:
                this.rank = 6
                break
            case CardTypes.FIVE:
                this.rank = 5
                break
            case CardTypes.FOUR:
                this.rank = 4
                break
            case CardTypes.THREE:
                this.rank = 3
                break
            case CardTypes.TWO:
                this.rank = 2
                break
        }

        this.#key = [
            suitValueKeys['value'],
            suitValueKeys['suit'],
            Math.floor(Date.now()),
            Math.floor(Math.random() * 1000)
        ].join('-')
        this.#imageId = `${suitValueKeys['suit']}-${suitValueKeys['value']}`
    }

    public get key(): string {
        return this.#key
    }

    public get imageId(): string {
        return this.#imageId
    }

    public get imageSrc(): string {
        return `https://assets.codepen.io/1693575/${this.imageId}.png?format=auto`
    }

    public isHigherThan(card: Card): boolean {
        if (this.value === card.value) {
            // compare suits (spade, heart, diamond, club)
            if (card.suit === CardSuits.CLUB) {
                return true
            }
            if (this.suit === CardSuits.CLUB) {
                return false
            }
            if (card.suit === CardSuits.SPADE) {
                return false
            }
            if (this.suit === CardSuits.SPADE) {
                return true
            }
            if (card.suit === CardSuits.HEART) {
                return false
            }
            if (this.suit === CardSuits.HEART) {
                return true
            }
            if (card.suit === CardSuits.DIAMOND) {
                return false
            }
            if (this.suit === CardSuits.DIAMOND) {
                return true
            }
        }
        return this.rank > card.rank
    }

    public toString(): string {
        if (this.suit === CardSuits.JOKER) {
            return 'Joker'
        }

        let s = null
        switch (this.suit) {
            case CardSuits.CLUB:
                s = 'Clubs'
                break
            case CardSuits.DIAMOND:
                s = 'Diamonds'
                break
            case CardSuits.HEART:
                s = 'Hearts'
                break
            case CardSuits.SPADE:
                s = 'Spades'
                break
        }

        let v = null
        switch (this.value) {
            case CardTypes.ACE:
                v = 'Ace'
                break
            case CardTypes.KING:
                v = 'King'
                break
            case CardTypes.QUEEN:
                v = 'Queen'
                break
            case CardTypes.JACK:
                v = 'Jack'
                break
            case CardTypes.TEN:
            case CardTypes.NINE:
            case CardTypes.EIGHT:
            case CardTypes.SEVEN:
            case CardTypes.SIX:
            case CardTypes.FIVE:
            case CardTypes.FOUR:
            case CardTypes.THREE:
            case CardTypes.TWO:
                v = this.value
        }

        return `${v} of ${s}`
    }
}