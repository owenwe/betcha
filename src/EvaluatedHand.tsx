import { Hand, HAND_TYPES } from "./lib"

type EvaluateHandProps = {
    hand: HAND_TYPES
}

function EvaluatedHand( props: EvaluateHandProps ) {
    switch (props.hand) {
        case Hand.Types.ROYAL_FLUSH:
            return <strong>Royal Flush</strong>
        case Hand.Types.STRAIGHT_FLUSH:
            return <strong>Straight Flush</strong>
        case Hand.Types.FOUR_OF_A_KIND:
            return <strong>Four of a Kind</strong>
        case Hand.Types.FULL_HOUSE:
            return <strong>Full House</strong>
        case Hand.Types.FLUSH:
            return <strong>Flush</strong>
        case Hand.Types.STRAIGHT:
            return <strong>Straight</strong>
        case Hand.Types.THREE_OF_A_KIND:
            return <strong>Three of a Kind</strong>
        case Hand.Types.TWO_PAIR:
            return <strong>Two Pair</strong>
        case Hand.Types.PAIR:
            return <strong>Pair</strong>
        default:
            return <strong>High Card</strong>
    }
}

export default EvaluatedHand