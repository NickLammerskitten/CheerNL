"use client"

import AthleteObject from "@/app/(dashboard)/routine-builder/[id]/components/athlete";
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';

interface FloorProps {
    athletes: any[];
    setAthletes: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Floor({ athletes, setAthletes }: FloorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const GRID_SIZE = 14;

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const floorSize = Math.min(dimensions.width, dimensions.height) * 0.95;
    const cellSize = floorSize / GRID_SIZE;

    const center = floorSize / 2;
    const crossSize = cellSize * 0.4;

    const offsetX = (dimensions.width - floorSize) / 2;
    const offsetY = (dimensions.height - floorSize) / 2;

    const gridLines = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
        const position = i * cellSize;
        const isMatBorder = i % 2 === 0;
        gridLines.push(
            <Line
                key={`v-${i}`}
                points={[position, 0, position, floorSize]}
                stroke={isMatBorder ? "#bbb" : "#ddd"}
                strokeWidth={isMatBorder ? 3 : 1}
            />,
        );

        gridLines.push(
            <Line
                key={`h-${i}`}
                points={[0, position, floorSize, position]}
                stroke="#ddd"
                strokeWidth={1}
            />,
        );
    }

    const handleDragEnd = (e: any, dancerId: string) => {
        const node = e.target;
        const dropX = node.x();
        const dropY = node.y();

        const rawGridX = dropX / cellSize;
        const rawGridY = dropY / cellSize;

        let snappedGridX = Math.round(rawGridX * 2) / 2;
        let snappedGridY = Math.round(rawGridY * 2) / 2;

        snappedGridX = Math.max(0, Math.min(GRID_SIZE, snappedGridX));
        snappedGridY = Math.max(0, Math.min(GRID_SIZE, snappedGridY));

        setAthletes(prevDancers =>
            prevDancers.map(dancer =>
                dancer.id === dancerId
                    ? { ...dancer, x: snappedGridX, y: snappedGridY }
                    : dancer,
            ),
        );
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {dimensions.width > 0 && (
                <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                >
                    <Layer
                        x={offsetX}
                        y={offsetY}
                    >
                        <Rect
                            width={floorSize}
                            height={floorSize}
                            fill="#ffffff"
                            stroke="#666"
                            strokeWidth={2}
                        />

                        {gridLines}

                        <Line
                            points={[center - crossSize, center, center + crossSize, center]}
                            stroke="#333"
                            strokeWidth={2}
                        />
                        <Line
                            points={[center, center - crossSize, center, center + crossSize]}
                            stroke="#333"
                            strokeWidth={2}
                        />

                        {athletes.map(athlete => (
                            <AthleteObject
                                key={athlete.id}
                                athlete={athlete}
                                cellSize={cellSize}
                                onDragEnd={(e) => handleDragEnd(e, athlete.id)}
                            />
                        ))}
                    </Layer>
                </Stage>
            )}
        </div>
    );
};