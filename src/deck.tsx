import {  AvGadget, AvGrabButton, AvStandardGrabbable, AvTransform  } from '@aardvarkxr/aardvark-react';
import { EAction, EHand, g_builtinModelBox, g_builtinModelGear, g_builtinModelHook, g_builtinModelPlus, InitialInterfaceLock, MinimalPose, minimalPoseFromTransform } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import React, {useState} from 'react';
import { PlayingCard } from './card';
import { CardValue} from './types';


const k_DeckInterface = "CardDeckState@1";

type DeckProps = {
}

type DeckState = {
    drawnCards: CardValue[];
    remainingCards: CardValue[];
    cardTransforms: MinimalPose[];
}

interface DeckNetworkEvent  {
    type: "draw" | "reset" | "gather"
    drawnCards?: CardValue[];
    remainingCards?: CardValue[];
}

class CardDeck extends React.Component<DeckProps, DeckState>{
    private m_grabbableRef = React.createRef<AvStandardGrabbable>();

	constructor( props: any )
	{

        super( props );

        let fullDeck = []
        let transforms = []
        for (let i = 0; i < 13; i++) {
            fullDeck.push(i);
            transforms.push(new Array(7).fill(0));
        }                        
        this.shuffle(fullDeck);

        this.state = {
            drawnCards: [],
            remainingCards: fullDeck,
            cardTransforms: transforms
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
			this.onStateReceived( params );			
		}
    }

    public componentDidUpdate()
    {
        if( !AvGadget.instance().isRemote )
		{
            let e: DeckNetworkEvent = { type: "reset",
                                       drawnCards: this.state.drawnCards,
                                       remainingCards: this.state.remainingCards };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
    }

    @bind
    public onStateReceived(state: DeckState){
        if(state){
            this.setState(state);
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
                    this.setState({drawnCards: event.drawnCards, remainingCards: event.remainingCards, 
                                   cardTransforms: this.state.cardTransforms}); // Don't update the card transforms here
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
    
    @bind
    public drawCard(){
        if( AvGadget.instance().isRemote )
		{
			let e: DeckNetworkEvent = { type: "draw" };
			this.m_grabbableRef.current?.sendRemoteEvent( e, true );
		}
		else{
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
        }
    }

    @bind
    public onCardMoved(card: CardValue, pose: MinimalPose){
        console.log("onCardMooo");
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
            <AvStandardGrabbable modelUri={ g_builtinModelBox } modelScale={ 0.04 } remoteGadgetCallback={this.onRemoteEvent}
              useInitialParent={true} remoteInterfaceLocks={remoteInitLocks} ref={this.m_grabbableRef} >

                <AvTransform translateY={ 0.05 } rotateX={45}>
                    <AvGrabButton modelUri={ "models/card_draw_icon.glb" } onClick={ this.drawCard } />
                </AvTransform>
                <AvTransform translateY={ 0.2 } >
                    {this.state.drawnCards.map(cardVal => (
                        <AvTransform transform={this.state.cardTransforms[cardVal]} key={cardVal}>
                            <PlayingCard card={cardVal} key={cardVal} moveCallback={this.onCardMoved }
                            />
                        </AvTransform>
                    ))}
                </AvTransform>
                <AvTransform translateY={ 0.00 } translateX={0.06} rotateX={45} rotateY={45}>
                    <AvGrabButton modelUri={ "models/card_return_icon.glb" } onClick={ this.gatherCards } />
                </AvTransform>
            </AvStandardGrabbable>
        );
    }
} 

export default CardDeck;