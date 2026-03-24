import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-[#4B3A46]">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium hover:underline text-[#592803]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[#4B3A46]">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className="text-[#4B3A46]/60">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}