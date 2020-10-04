import { AvComposedEntity,  AvGadget,  AvGadgetList,  AvModel,  AvPrimitive, AvStandardGrabbable, AvTransform, GadgetSeedContainerComponent, GrabbableStyle, MoveableComponent, MoveableComponentState, NetworkedGadgetComponent, PrimitiveType, RemoteGadgetComponent } from '@aardvarkxr/aardvark-react';
import { AvVolume, EVolumeType, g_builtinModelBox, g_builtinModelCylinder, g_builtinModelPanel, infiniteVolume, InitialInterfaceLock,  } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import {CardValue} from './types';

type CardProps = {
	card: CardValue;
}

type CardState = {
	highlight: CardHighlightType;
}

export enum CardHighlightType
{
	/** Nothing interesting is going on with the grabbable. */
	None = 0,

	/** There is a grabber within grabbing range of the grabbable. */
	InRange = 1,

	/** There is a grabber actively grabbing the grabbable, and it isn't attached to anything. */
	Grabbed = 2,

	/** The grabbed grabbable is within drop range of a hook. */
	InHookRange = 3,
}

const cardWidth = 0.057;
const cardHeight = 0.08;
const cardDepth = 0.001;
const cardGrabMargin = 0.00;

export class PlayingCard extends React.Component<CardProps, CardState>{

	private moveableComponent: MoveableComponent;

    private k_cardHitbox =
	{
		type: EVolumeType.AABB,
		aabb: 
		{
			xMin: -cardWidth - cardGrabMargin, xMax: cardWidth + cardGrabMargin,
			zMin: -cardDepth - cardGrabMargin, zMax: cardDepth + cardGrabMargin,
			yMin: -cardHeight - cardGrabMargin, yMax: cardHeight + cardGrabMargin,	
		}
	} as AvVolume;

	constructor( props: any )
	{
		super( props );

		this.moveableComponent =  new MoveableComponent( this.onMoveableUpdate, false, true );

		this.state = {
			highlight: CardHighlightType.None,
		}
	}

	@bind
	private async onMoveableUpdate()
	{
		let highlight;
		switch( this.moveableComponent.state )
		{
			default:
			case MoveableComponentState.Idle:
			case MoveableComponentState.InContainer:
				highlight = CardHighlightType.None;
				break;

			case MoveableComponentState.GrabberNearby:
			case MoveableComponentState.Menu:
				highlight = CardHighlightType.InRange;
				break;

			case MoveableComponentState.Grabbed:
				highlight = CardHighlightType.Grabbed;
				break;
		}

		this.setState( ( oldState: CardState ) =>
		{
			return { ...oldState, highlight };
		} );

	}

	public render(){

		let scale = 1.4;
		scale *= this.state.highlight == CardHighlightType.InRange ? 1.1 : 1.0;


		return (
			<AvStandardGrabbable 
				style={GrabbableStyle.NetworkedItem} 
				itemId={"card"+this.props.card} 
				volume={this.k_cardHitbox} 
				canDropIntoContainers={ true }
				appearance={
				<>
					<AvTransform scaleX={0.056 * scale} scaleY={0.001} scaleZ={0.0889 * scale} rotateX={90}> 
						<AvModel uri={"models/panel.glb"} useTextureFromUrl={"card_textures/" + CardValue[this.props.card] + ".png"} />
					</AvTransform>
					<AvTransform translateZ={-0.001} scaleX={0.056 * scale} scaleY={0.001} scaleZ={0.0889 * scale} rotateX={90}> 
						<AvModel uri={"models/panel.glb"} useTextureFromUrl={"card_textures/cardback.png"} />
					</AvTransform>
				</>
			} />
		);
	}
}