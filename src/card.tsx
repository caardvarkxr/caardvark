import { AvComposedEntity, AvPanel, AvPrimitive, AvStandardGrabbable, AvTransform, DefaultLanding, MoveableComponent, PrimitiveType } from '@aardvarkxr/aardvark-react';
import { Av, AvVolume, EVolumeType, g_builtinModelBox } from '@aardvarkxr/aardvark-shared';
import bind from 'bind-decorator';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

type CardProps = {
    suit: number;
    index: number;
}

const cardWidth = 0.057;
const cardHeight = 0.08;
const cardDepth = 0.001;
const cardGrabMargin = 0.01;

export const PlayingCard: React.FC<CardProps> = (props) => {

    const [ moveable, setMoveable ] = React.useState( new MoveableComponent( () => {}, true, false ) );

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
                <div>
                    <AvComposedEntity components={[moveable]} volume={k_cardVolume}> 
                        <AvPrimitive type={PrimitiveType.Cube} width={0.057} height={0.08} depth={0.001} />
                    </AvComposedEntity>
				</div>
		);
}