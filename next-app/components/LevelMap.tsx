"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LevelType = "lesson" | "quiz" | "exam";
type LevelStatus = "completed" | "current" | "available";

export interface Level {
  id: string;
  label: string;
  type: LevelType;
  status: LevelStatus;
  href?: string;
}

interface LevelMapProps {
  levels?: Level[];
  subjectTitle?: string;
}

// Layout Constants for Nodes
const COLS = 4;
const COL_GAP = 130;
const ROW_GAP = 140;
const LEFT_MARGIN = 80;
const TOP_MARGIN = 70;
const NODE_R = 30;
const LABEL_H = 44;

// Colors for Level Types and States
const TYPE_COLOR: Record<LevelType, { fill: string; ring: string }> = {
  lesson: { fill: "#6AC700", ring: "#4e9600" },
  quiz: { fill: "#E57E25", ring: "#b85f10" },
  exam: { fill: "#D4A017", ring: "#a07a00" },
};

function getPos(i: number) {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const evenRow = row % 2 === 0;
  return {
    x: LEFT_MARGIN + (evenRow ? col : COLS - 1 - col) * COL_GAP,
    y: TOP_MARGIN + row * ROW_GAP,
  };
}

// Icons
// Lessons
function BookPath() {
  return (
    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      transform="translate(-9,-9)">
      <path d="M2 16.5A2 2 0 014 15h12" />
      <path d="M4 1h12v16H4A2 2 0 012 15V3a2 2 0 012-2z" />
    </g>
  );
}
// Quizzes
function QuizPath() {
  return (
    <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      transform="translate(-9,-9)">
      <circle cx="9" cy="9" r="8" />
      <path d="M6.5 6.5a3 3 0 014 2.5c0 1.5-2 2.5-2 2.5" />
      <circle cx="9" cy="13.5" r="0.8" fill="white" />
    </g>
  );
}
// Exams
function StarPath() {
  return (
    <polygon
      points="0,-10 2.94,-4.05 9.51,-3.09 4.76,1.55 5.88,8.09 0,5 -5.88,8.09 -4.76,1.55 -9.51,-3.09 -2.94,-4.05"
      fill="gold" stroke="#a07a00" strokeWidth="0.8"
    />
  );
}
// Completed Status
function CheckPath() {
  return (
    <polyline points="-7,0 -2,5 7,-6"
      fill="none" stroke="white" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    />
  );
}

export default function LevelMap({
  levels = [],
  subjectTitle = "Lesson Map",
}: LevelMapProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const n = levels.length;
  const rows = Math.ceil(n / COLS) || 1;
  const svgW = LEFT_MARGIN * 2 + (COLS - 1) * COL_GAP;
  const svgH = TOP_MARGIN + (rows - 1) * ROW_GAP + NODE_R * 2 + LABEL_H + 24;

  const completed = levels.filter(l => l.status === "completed").length;
  const pct = n ? Math.round((completed / n) * 100) : 0;

  return (
    <div className="w-full rounded-3xl overflow-hidden border-2 border-[#F0DCC8] bg-[#FFF8F0]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 px-6 pt-5 pb-4 border-b border-dashed border-[#E0C9B3]">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#E57E25] m-0">
            Progress Map
          </p>
          <p className="text-xl font-black text-[#592803] m-0">
            {subjectTitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {([
            { color: "bg-[#6AC700]", label: "Lesson" },
            { color: "bg-[#E57E25]", label: "Quiz" },
            { color: "bg-[#D4A017]", label: "Exam" },
          ] as { color: string; label: string }[]).map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
              <span className="text-[11px] font-bold text-[#7a4f2c]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="flex items-center gap-3 px-6 py-3">
        <div className="flex-1 h-2.5 rounded-full bg-[#E8D5C4] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6AC700] to-[#A8E040] transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-black text-[#592803] min-w-[56px] text-right">
          {completed}/{n} done
        </span>
      </div>

      {/* ── SVG map */}
      <div className="overflow-x-auto pb-4">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block mx-auto"
        >
          {/* Connector lines */}
          {levels.map((lv, i) => {
            if (i === 0) return null;
            const a = getPos(i - 1);
            const b = getPos(i);
            const done = levels[i - 1]?.status === "completed";
            return (
              <line
                key={`ln-${i}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={done ? "#6AC700" : "#D4C4BA"}
                strokeWidth={6} strokeDasharray="10 6" strokeLinecap="round"
              />
            );
          })}

          {/* Nodes */}
          {levels.map((lv, i) => {
            const { x, y } = getPos(i);
            const current = lv.status === "current";
            const done = lv.status === "completed";
            const colors = TYPE_COLOR[lv.type] ?? TYPE_COLOR.lesson;
            const fill = colors.fill;
            const ring = done ? colors.ring : "rgba(255,255,255,0.5)";
            const isHov = hovered === lv.id;
            const sc = visible ? (isHov ? 1.12 : 1) : 0.3;
            const op = visible ? 1 : 0;
            const typeLabel = lv.type.charAt(0).toUpperCase() + lv.type.slice(1);
            const nameLabel = lv.label.length > 13 ? lv.label.slice(0, 12) + "…" : lv.label;

            return (
              <g
                key={lv.type + '-' + lv.id}
                transform={`translate(${x},${y})`}
                className="cursor-pointer"
                style={{ opacity: op, transition: `opacity 0.4s ${i * 55}ms` }}
                onClick={() => { if (lv.href) router.push(lv.href); }}
                onMouseEnter={() => setHovered(lv.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring for current node */}
                {current && (
                  <circle cx={0} cy={0} r={NODE_R + 8} fill={`${fill}30`}>
                    <animate attributeName="r" values={`${NODE_R + 8};${NODE_R + 22}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".5;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Ring border */}
                <circle cx={0} cy={0} r={NODE_R + 4} fill={ring}
                  style={{ transform: `scale(${sc})`, transformOrigin: "0 0", transition: "transform 0.18s" }}
                />

                {/* Main circle */}
                <circle cx={0} cy={0} r={NODE_R} fill={fill}
                  style={{ transform: `scale(${sc})`, transformOrigin: "0 0", transition: "transform 0.18s" }}
                />

                {/* Icon */}
                <g style={{ transform: `scale(${sc})`, transformOrigin: "0 0", transition: "transform 0.18s" }}>
                  {done ? <CheckPath /> :
                    lv.type === "lesson" ? <BookPath /> :
                      lv.type === "quiz" ? <QuizPath /> :
                        <StarPath />}
                </g>

                {/* Number badge */}
                <g style={{ transform: `scale(${sc})`, transformOrigin: "0 0", transition: "transform 0.18s" }}>
                  <circle cx={NODE_R - 2} cy={-(NODE_R - 2)} r={10} fill="#592803" />
                  <text
                    x={NODE_R - 2} y={-(NODE_R - 2)}
                    textAnchor="middle" dominantBaseline="central"
                    fill="white" fontSize={9} fontWeight="900"
                    fontFamily="sans-serif"
                  >{i + 1}</text>
                </g>

                {/* Type label */}
                <text
                  x={0} y={NODE_R + 16}
                  textAnchor="middle"
                  fill="#592803"
                  fontSize={10} fontWeight="800"
                  fontFamily="sans-serif"
                >{typeLabel}</text>

                {/* Name label */}
                <text
                  x={0} y={NODE_R + 30}
                  textAnchor="middle"
                  fill="#7a4f2c"
                  fontSize={10} fontWeight="600"
                  fontFamily="sans-serif"
                >{nameLabel}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}