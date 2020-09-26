import { AvPanel, AvPrimitive, AvStandardGrabbable, AvTransform, DefaultLanding, PrimitiveType } from '@aardvarkxr/aardvark-react';
import { Av, g_builtinModelBox } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { PlayingCard } from './card';
import { CardValue} from './types';

type DeckProps = {
}
var drawnCards: CardValue[] = new Array();
var remainingCards: CardValue[] = new Array();

class CardDeck extends React.Component<{}, DeckProps>{


    cardComponents = [];

	constructor( props: any )
	{

        super( props );
        for (let i = 0; i < 52; i++) {
            remainingCards.push(i);
            this.shuffle();
            this.cardComponents.push(<PlayingCard index={i} suit={i/13} />)
        }
    }
    public gather(){
        let len = drawnCards.length
        for(let i = 0; i < len; i++){
            remainingCards.push(drawnCards.pop());
        }
        this.shuffle();
    }
    public shuffle(){
        let len = remainingCards.length-1
        for(let i = 0; i< (len); i++){
            let j = Math.floor(Math.random()*(len));
            let tempval = remainingCards[i];
            remainingCards[i] = remainingCards[j];
            remainingCards[j] = tempval;
        }

    }

    public drawCard(){
        let temp = remainingCards.pop();
        drawnCards.push(temp);
        return temp;        
    }

    public render(){
        return(
            <div>
                {this.cardComponents}
            </div>
        );
    }


} 

export default CardDeck;