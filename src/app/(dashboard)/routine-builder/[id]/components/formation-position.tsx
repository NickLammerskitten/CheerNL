"use client"

import { FormationPositionItemData } from "@/schemas/formation-position.model";
import Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node';
import { Circle, Group, Text } from 'react-konva';

interface FormationPositionProps {
    formationPosition: FormationPositionItemData;
    cellSize: number;
    isSelected: boolean;
    registerNode: (node: Konva.Group | null) => void;
    onClick: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
    onDragStart: (e: KonvaEventObject<DragEvent>) => void;
    onDragMove: (e: KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
}

export default function FormationPositionObject({
    formationPosition,
    cellSize,
    isSelected,
    registerNode,
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
}: FormationPositionProps) {
    const radius = cellSize * 0.3;

    return (
        <Group
            ref={registerNode}
            x={formationPosition.posX * cellSize}
            y={formationPosition.posY * cellSize}
            draggable
            onClick={onClick}
            onTap={onClick}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
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
                stroke={isSelected ? "#00a1ff" : "#fff"}
                strokeWidth={isSelected ? 3 : 1}
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.3}
            />

            {formationPosition.athlete && (
                <Text
                    text={(formationPosition.athlete.index + 1).toString()}
                    fontSize={Math.max(12, cellSize * 0.25)}
                    fontFamily="sans-serif"
                    fontStyle="bold"
                    fill="#ffffff"
                    x={-radius}
                    y={-radius}
                    width={radius * 2}
                    height={radius * 2}
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                />
            )}
        </Group>
    );
}