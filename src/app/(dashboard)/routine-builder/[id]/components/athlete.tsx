"use client"

import { Circle, Group, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';

interface AthleteProps {
    athlete: { id: string; x: number; y: number; color: string; name?: string };
    cellSize: number;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
}

export default function AthleteObject({ athlete, cellSize, onDragEnd }: AthleteProps) {
    const radius = cellSize * 0.3;

    return (
        // Wir machen die gesamte Gruppe draggable. Dadurch wandert der Text automatisch mit!
        <Group
            x={athlete.x * cellSize}
            y={athlete.y * cellSize}
            draggable
            onDragEnd={onDragEnd}
            onMouseEnter={e => {
                const container = e.target.getStage()?.container();
                if(container) container.style.cursor = 'grab';
            }}
            onMouseLeave={e => {
                const container = e.target.getStage()?.container();
                if(container) container.style.cursor = 'default';
            }}
            onMouseDown={e => {
                const container = e.target.getStage()?.container();
                if(container) container.style.cursor = 'grabbing';
            }}
            onMouseUp={e => {
                const container = e.target.getStage()?.container();
                if(container) container.style.cursor = 'grab';
            }}
        >
            {/* Der Athleten-Kreis (Zentriert bei 0,0 innerhalb der Gruppe) */}
            <Circle
                x={0}
                y={0}
                radius={radius}
                fill={athlete.color}
                stroke="#fff"
                strokeWidth={1}
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 1, y: 1 }}
                shadowOpacity={0.3}
            />

            {/* Der Name (Nur rendern, wenn vorhanden) */}
            {athlete.name && (
                <Text
                    text={athlete.name}
                    fontSize={Math.max(10, cellSize * 0.25)} // Schickes mitskalieren der Schrift
                    fontFamily="sans-serif"
                    fill="#333"
                    align="center"
                    y={-radius - 16}
                    x={0}
                    offsetX={50}
                    width={100}
                />
            )}
        </Group>
    )
}