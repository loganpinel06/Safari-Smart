type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-extrabold tracking-tight text-[#592803]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base text-[#4B3A46]">
          {subtitle}
        </p>
      )}
    </div>
  );
}