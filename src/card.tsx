import { AvComposedEntity,  AvModel,  AvPrimitive, AvTransform, GadgetSeedContainerComponent, MoveableComponent, PrimitiveType } from '@aardvarkxr/aardvark-react';
import { AvVolume, EVolumeType, g_builtinModelCylinder, g_builtinModelPanel,  } from '@aardvarkxr/aardvark-shared';
import * as React from 'react';
import {CardValue} from './types';

type CardProps = {
    card: CardValue;
}

const cardWidth = 0.057;
const cardHeight = 0.08;
const cardDepth = 0.001;
const cardGrabMargin = 0.01;

export const PlayingCard: React.FC<CardProps> = (props) => {

    const [ moveable, setMoveable ] = React.useState( new MoveableComponent( () => {}, false, true ) );

    const k_cardVolume =
	{
		type: EVolumeType.AABB,
		aabb: 
		{
			xMin: -cardWidth - cardGrabMargin, xMax: cardWidth + cardGrabMargin,
			zMin: -cardDepth - cardGrabMargin, zMax: cardDepth + cardGrabMargin,
			yMin: -cardHeight - cardGrabMargin, yMax: cardHeight + cardGrabMargin,	
		}
    } as AvVolume;

		return (
				<AvComposedEntity components={[moveable]} volume={k_cardVolume}> 
					<AvTransform scaleX={0.056} scaleY={0.001} scaleZ={0.0889} rotateX={90}> 
						<AvModel uri={g_builtinModelPanel} useTextureFromUrl={"card_textures/" + CardValue[props.card] + ".png"} />
					</AvTransform>
					<AvTransform translateZ={-0.001} scaleX={0.056} scaleY={0.001} scaleZ={0.0889} rotateX={90}> 
						<AvModel uri={g_builtinModelPanel} />
					</AvTransform>
				</AvComposedEntity>
		);
}