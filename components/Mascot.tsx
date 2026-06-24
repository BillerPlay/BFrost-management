"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LINES = ["やった！", "Cleared! ✦", "Nice work!", "クリア～", "Let's go!", "One down!"];

export default function Mascot({ cheerKey }: { cheerKey: number }) {
  const [cheering, setCheering] = useState(false);
  const [line, setLine] = useState(LINES[0]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    setLine(LINES[Math.floor(Math.random() * LINES.length)]);
    setCheering(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCheering(false), 1800);
  }, []);

  // cheerKey starts at 0; only fire on real increments
  useEffect(() => {
    if (cheerKey === 0) return;
    trigger();
  }, [cheerKey, trigger]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div
      className={`mascot${cheering ? " cheer" : ""}`}
      onClick={trigger}
      role="button"
      tabIndex={0}
      aria-label="Cheer mascot"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      }}
    >
      <div className="mascot-bubble">{line}</div>
      <div className="mascot-inner">
        <span className="spark spark-1" aria-hidden>✦</span>
        <span className="spark spark-2" aria-hidden>✧</span>
        <span className="spark spark-3" aria-hidden>✦</span>
        {/* both frames preloaded; CSS cross-fades on cheer to avoid a flash */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mascot-img idle" src="/mascot.png" alt="" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mascot-img cheer" src="/mascot_cheer.png" alt="" draggable={false} />
      </div>
    </div>
  );
}
