type LessonContentCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function LessonContentCard({
  title,
  description,
  children,
}: LessonContentCardProps) {
  return (
    <div className="rounded-2xl border border-[#4B3A46]/10 bg-white/70 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[#592803]">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-[#4B3A46]">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}