import {  AvGadget, AvGrabButton, AvStandardGrabbable, AvTransform, GrabbableStyle  } from '@aardvarkxr/aardvark-react';
import { g_builtinModelBox, g_builtinModelGear, g_builtinModelHook, g_builtinModelPlus, InitialInterfaceLock } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import React, {useState} from 'react';
import { PlayingCard } from './card';
import { CardValue} from './types';

const k_DeckInterface = "CardDeckState@1";

interface DeckNetworkEvent  {
    type: "draw" | "reset" | "gather";
    drawnCards?: CardValue[];
    remainingCards?: CardValue[];
}

type DeckProps = {
}

type DeckState = {
    drawnCards: CardValue[];
    remainingCards: CardValue[];
}


class CardDeck extends React.Component<DeckProps, DeckState>{

    private m_grabbableRef = React.createRef<AvStandardGrabbable>();

	constructor( props: any )
	{
        super( props );

        let fullDeck = []
        for (let i = 0; i < 52; i++) {
            fullDeck.push(i);
        }                        

        this.shuffle(fullDeck);

        this.state = {
            drawnCards: [],
            remainingCards: fullDeck
        }

    }


    public componentDidMount(){
        if( !AvGadget.instance().isRemote )
		{
			//AvGadget.instance().registerForSettings( this.onSettingsReceived );
		}
		else // We are remote!
		{
            let params = AvGadget.instance().findInitialInterface( k_DeckInterface )?.params as DeckState;
            if(params){
                this.setState( params );			
            } 
		}
    }

    public componentDidUpdate()
    {
        if( !AvGadget.instance().isRemote )
		{
		}
    }


    @bind
    public onRemoteEvent(event: DeckNetworkEvent){
        switch(event.type){
            case "reset":
                if(!AvGadget.instance().isRemote){
                    console.log("Received unexpected reset event on non-remote");
                }
                else{
                    this.setState({drawnCards: event.drawnCards, remainingCards: event.remainingCards});
                }
                break;
            case "draw":
                this.drawCard();
                break;
            case "gather":
                this.gatherCards();
                break;
        }
    }

    @bind
    public gatherCards(){
         if( AvGadget.instance().isRemote )
		{
			let e: DeckNetworkEvent = { type: "gather" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else
		{
            let len = this.state.drawnCards.length
            let deck = this.state.remainingCards;
            let drawn = this.state.drawnCards;

            for(let i = 0; i < len; i++){
                deck.push(drawn.pop());
            }
            this.shuffle(deck);

            this.setState({
                remainingCards: deck,
                drawnCards: []
            });

            let e: DeckNetworkEvent = { type: "reset",
                                       remainingCards: deck,
                                       drawnCards: [] };
            this.m_grabbableRef.current?.sendRemoteEvent( e, true );

        }
    }

    public shuffle(cards: CardValue[]){
        let len = cards.length
        for(let i = 0; i < (len); i++){
            let j = Math.floor(Math.random()*(len));
            let tempval = cards[i];
            cards[i] = cards[j];
            cards[j] = tempval;
        }
        return cards;
    }
    
    public drawCard(){
         if( AvGadget.instance().isRemote )
		{
			let e: DeckNetworkEvent = { type: "draw" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else
		{
            if(this.state.remainingCards.length == 0){
                return;
            }
            let deck = this.state.remainingCards;
            let drawn = this.state.drawnCards;

            let temp = deck.pop();
            drawn.push(temp);

            this.setState({
                remainingCards: deck,
                drawnCards: drawn
            });
            let e: DeckNetworkEvent = { type: "reset",
                                       remainingCards: deck,
                                       drawnCards: drawn };
            this.m_grabbableRef.current?.sendRemoteEvent( e, true );
        }
    }

    public render(){
        let remoteInitLocks: InitialInterfaceLock[] = [];

		if( !AvGadget.instance().isRemote )
		{
			remoteInitLocks.push( {
				iface: k_DeckInterface,
				receiver: null,
				params: this.state
			} );
        }


        return(
            <AvStandardGrabbable style={GrabbableStyle.Gadget} modelUri={ "models/caardvark_icon.glb" } 
                modelScale={ 0.25 } remoteInterfaceLocks={remoteInitLocks} ref={this.m_grabbableRef}
                remoteGadgetCallback={this.onRemoteEvent}>
                <AvTransform translateY={ 0.05 } translateX={0.1} rotateX={45} >
                    <AvGrabButton modelUri={ "models/draw_card_icon.glb" } onClick={ this.drawCard.bind(this) } />
                </AvTransform>
                <AvTransform translateZ={ 0.15 } translateX={0.1} rotateX={90}>
                    {this.state.drawnCards.map(cardVal => (
                        <PlayingCard card={cardVal} key={cardVal} />
                    ))}
                </AvTransform>
                <AvTransform translateY={ 0.05 } translateX={-0.10} rotateX={45} rotateY={45}>
                    <AvGrabButton modelUri={ "models/return_card_icon.glb" } onClick={ this.gatherCards.bind(this) } />
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;