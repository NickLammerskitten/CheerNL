"use client"

import { FormationPositionItemData } from "@/schemas/formation-position.model";
import { KonvaEventObject } from 'konva/lib/Node';
import { Circle, Group } from 'react-konva';

interface FormationPositionProps {
    formationPosition: FormationPositionItemData;
    cellSize: number;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
}

export default function FormationPositionObject({ formationPosition, cellSize, onDragEnd }: FormationPositionProps) {
    const radius = cellSize * 0.3;

    return (
        <Group
            x={formationPosition.posX * cellSize}
            y={formationPosition.posY * cellSize}
            draggable
            onDragEnd={onDragEnd}
            onMouseEnter={e => {
                const container = e.target.getStage()?.container();
                if (container) {
                    container.style.cursor = 'grab';
                }
            }}
            onMouseLeave={e => {
                const container = e.target.getStage()?.container();
                if (container) {
                    container.style.cursor = 'default';
                }
            }}
            onMouseDown={e => {
                const container = e.target.getStage()?.container();
                if (container) {
                    container.style.cursor = 'grabbing';
                }
            }}
            onMouseUp={e => {
                const container = e.target.getStage()?.container();
                if (container) {
                    container.style.cursor = 'grab';
                }
            }}
        >

            <Circle
                x={0}
                y={0}
                radius={radius}
                fill="#ff0044"
                stroke="#fff"
                strokeWidth={1}
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.3}
            />
        </Group>
    )
}