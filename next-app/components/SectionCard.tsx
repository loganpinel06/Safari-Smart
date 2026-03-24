import { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`bg-white/60 rounded-2xl border border-[#4B3A46]/10 p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}