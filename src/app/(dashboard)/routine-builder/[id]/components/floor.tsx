"use client"

import FormationPositionObject from "@/app/(dashboard)/routine-builder/[id]/components/formation-position";
import { FormationPositionItemData } from "@/schemas/formation-position.model";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import React, { useEffect, useRef, useState } from 'react';
import { Layer, Line, Rect, Stage } from 'react-konva';

interface FloorProps {
    formationPositions: FormationPositionItemData[];
    onFormationPositionMove: (formationPositionId: string, x: number, y: number) => void;
}

export default function Floor({ formationPositions, onFormationPositionMove }: FloorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<{ [key: string]: Konva.Node }>({});

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [selectionRect, setSelectionRect] = useState({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const selectedIdsRef = useRef<string[]>([]);

    const updateSelectedIds = (newIds: string[] | ((prev: string[]) => string[])) => {
        if (typeof newIds === 'function') {
            setSelectedIds(prev => {
                const next = newIds(prev);
                selectedIdsRef.current = next;
                return next;
            });
        } else {
            setSelectedIds(newIds);
            selectedIdsRef.current = newIds;
        }
    };

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
                listening={false}
            />,
        );
        gridLines.push(
            <Line
                key={`h-${i}`}
                points={[0, position, floorSize, position]}
                stroke="#ddd"
                strokeWidth={1}
                listening={false}
            />,
        );
    }

    // --- AREA SELECT & DESELECT ---
    const handleStageMouseDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        const isBackgroundClick = e.target === e.target.getStage() || e.target.name() === 'background';

        if (isBackgroundClick) {
            updateSelectedIds([]);

            const pos = e.target.getStage()?.getPointerPosition();
            if (pos) {
                setSelectionRect({
                    visible: true,
                    x1: pos.x - offsetX,
                    y1: pos.y - offsetY,
                    x2: pos.x - offsetX,
                    y2: pos.y - offsetY,
                });
            }
        }
    };

    const handleStageMouseMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!selectionRect.visible) {
            return;
        }

        const pos = e.target.getStage()?.getPointerPosition();
        if (pos) {
            setSelectionRect(prev => ({
                ...prev,
                x2: pos.x - offsetX,
                y2: pos.y - offsetY,
            }));
        }
    };

    const handleStageMouseUp = () => {
        if (!selectionRect.visible) {
            return;
        }

        setSelectionRect(prev => ({ ...prev, visible: false }));

        const box = {
            x: Math.min(selectionRect.x1, selectionRect.x2),
            y: Math.min(selectionRect.y1, selectionRect.y2),
            width: Math.abs(selectionRect.x1 - selectionRect.x2),
            height: Math.abs(selectionRect.y1 - selectionRect.y2),
        };

        if (box.width === 0 || box.height === 0) {
            return;
        }

        const newSelected: string[] = [];
        formationPositions.forEach(pos => {
            const px = pos.posX * cellSize;
            const py = pos.posY * cellSize;

            if (px >= box.x && px <= box.x + box.width && py >= box.y && py <= box.y + box.height) {
                newSelected.push(pos.id);
            }
        });

        if (newSelected.length > 0) {
            updateSelectedIds(newSelected);
        }
    };

    // --- ITEM KLICK & DRAG ---
    const handleItemClick = (e: KonvaEventObject<MouseEvent | TouchEvent>, id: string) => {
        e.cancelBubble = true; // Verhindert, dass der Stage-Klick feuert
        if (e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey) {
            updateSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        } else {
            updateSelectedIds([id]);
        }
    };

    const handleDragStart = (e: KonvaEventObject<DragEvent>, id: string) => {
        let currentSelected = selectedIdsRef.current;

        if (!currentSelected.includes(id)) {
            currentSelected = [id];
            updateSelectedIds(currentSelected);
        }

        currentSelected.forEach(selId => {
            const node = nodesRef.current[selId];
            if (node) {
                node.setAttr('dragStartX', node.x());
                node.setAttr('dragStartY', node.y());
            }
        });
    };

    const handleDragMove = (e: KonvaEventObject<DragEvent>, id: string) => {
        const draggedNode = e.target as Konva.Node;

        const dx = draggedNode.x() - draggedNode.getAttr('dragStartX');
        const dy = draggedNode.y() - draggedNode.getAttr('dragStartY');

        selectedIdsRef.current.forEach(selId => {
            if (selId !== id) {
                const node = nodesRef.current[selId];
                if (node) {
                    node.x(node.getAttr('dragStartX') + dx);
                    node.y(node.getAttr('dragStartY') + dy);
                }
            }
        });
    };

    const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
        const currentSelected = selectedIdsRef.current;
        const idsToProcess = currentSelected.includes(id) ? currentSelected : [id];

        idsToProcess.forEach(selId => {
            const node = nodesRef.current[selId];
            if (!node) {
                return;
            }

            const rawGridX = node.x() / cellSize;
            const rawGridY = node.y() / cellSize;

            let snappedGridX = Math.round(rawGridX * 2) / 2;
            let snappedGridY = Math.round(rawGridY * 2) / 2;

            node.position({
                x: snappedGridX * cellSize,
                y: snappedGridY * cellSize,
            });

            snappedGridX = Math.max(0, Math.min(GRID_SIZE, snappedGridX));
            snappedGridY = Math.max(0, Math.min(GRID_SIZE, snappedGridY));

            onFormationPositionMove(selId, snappedGridX, snappedGridY);
        });
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
                touchAction: 'none'
            }}
        >
            {dimensions.width > 0 && (
                <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                    onMouseDown={handleStageMouseDown}
                    onMouseMove={handleStageMouseMove}
                    onMouseUp={handleStageMouseUp}
                    onTouchStart={handleStageMouseDown}
                    onTouchMove={handleStageMouseMove}
                    onTouchEnd={handleStageMouseUp}
                >
                    <Layer
                        x={offsetX}
                        y={offsetY}
                    >
                        <Rect
                            name="background"
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
                            listening={false}
                        />
                        <Line
                            points={[center, center - crossSize, center, center + crossSize]}
                            stroke="#333"
                            strokeWidth={2}
                            listening={false}
                        />

                        {formationPositions.map(formationPosition => (
                            <FormationPositionObject
                                key={formationPosition.id}
                                formationPosition={formationPosition}
                                cellSize={cellSize}
                                isSelected={selectedIds.includes(formationPosition.id)} // Für das UI Rendering reicht der State
                                registerNode={(node) => {
                                    if (node) {
                                        nodesRef.current[formationPosition.id] = node;
                                    }
                                }}
                                onClick={(e) => handleItemClick(e, formationPosition.id)}
                                onDragStart={(e) => handleDragStart(e, formationPosition.id)}
                                onDragMove={(e) => handleDragMove(e, formationPosition.id)}
                                onDragEnd={(e) => handleDragEnd(e, formationPosition.id)}
                            />
                        ))}

                        {/* Visuelles Area Select Rechteck */}
                        {selectionRect.visible && (
                            <Rect
                                x={Math.min(selectionRect.x1, selectionRect.x2)}
                                y={Math.min(selectionRect.y1, selectionRect.y2)}
                                width={Math.abs(selectionRect.x1 - selectionRect.x2)}
                                height={Math.abs(selectionRect.y1 - selectionRect.y2)}
                                fill="rgba(0, 161, 255, 0.3)"
                                stroke="#00a1ff"
                                strokeWidth={1}
                                listening={false}
                            />
                        )}
                    </Layer>
                </Stage>
            )}
        </div>
    );
};
