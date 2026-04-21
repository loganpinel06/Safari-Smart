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
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-[#4B3A46]"
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex min-w-0 items-center gap-2"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="min-w-0 truncate font-medium text-[#592803] hover:underline focus:outline-none focus:ring-2 focus:ring-[#592803]/30 rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="min-w-0 truncate font-medium text-[#4B3A46]"
              aria-current="page"
            >
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="shrink-0 text-[#4B3A46]/60" aria-hidden="true">
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}