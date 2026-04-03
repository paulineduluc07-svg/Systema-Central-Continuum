"use client";

import { useRoomStore } from "@/stores/roomStore";
import { FurnitureItem } from "./FurnitureItem";

export function RoomDecoration() {
  const furniture = useRoomStore((s) => s.furniture);
  return (
    <>
      {furniture.map((piece) => (
        <FurnitureItem key={piece.id} piece={piece} />
      ))}
    </>
  );
}