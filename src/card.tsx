import { AvComposedEntity,  AvGadget,  AvGadgetList,  AvModel,  AvPrimitive, AvStandardGrabbable, AvTransform, GadgetSeedContainerComponent, MoveableComponent, NetworkedGadgetComponent, PrimitiveType, RemoteGadgetComponent } from '@aardvarkxr/aardvark-react';
import { AvVolume, EVolumeType, g_builtinModelBox, g_builtinModelCylinder, g_builtinModelPanel, infiniteVolume, InitialInterfaceLock,  } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import {CardValue} from './types';

type CardProps = {
	card: CardValue;
}

type CardState = {
}

const cardWidth = 0.057;
const cardHeight = 0.08;
const cardDepth = 0.001;
const cardGrabMargin = 0.01;

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

		this.moveableComponent =  new MoveableComponent( () => {}, false, false );
	}

	public onTransformUpdated() {			
	}

	public render(){

		return (
			<AvComposedEntity components={[this.moveableComponent]} volume={this.k_cardHitbox}> 
				<AvTransform scaleX={0.056 * 1.4} scaleY={0.001} scaleZ={0.0889 * 1.4} rotateX={90}> 
					<AvModel uri={g_builtinModelPanel} useTextureFromUrl={"card_textures/" + CardValue[this.props.card] + ".png"} />
				</AvTransform>
				<AvTransform translateZ={-0.001} scaleX={0.056 * 1.4} scaleY={0.001} scaleZ={0.0889 * 1.4} rotateX={90}> 
					<AvModel uri={g_builtinModelPanel} useTextureFromUrl={"card_textures/cardback.png"} />
				</AvTransform>
			</AvComposedEntity>
		);
	}
}