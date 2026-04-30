type StatusBadgeProps = {
  status: "Complete" | "In Progress" | "Not Started";
};

const icons = {
  Complete: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="6" fill="#4D6B1F" />
      <polyline
        points="2.5,6 5,8.5 9.5,3.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "In Progress": (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="5.25" stroke="#7A5E00" strokeWidth="1.5" />
      <path
        d="M6 3v3l2 1.5"
        stroke="#7A5E00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "Not Started": (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="6"
        cy="6"
        r="5.25"
        stroke="#4B3A46"
        strokeWidth="1.5"
        strokeDasharray="2.5 2"
      />
    </svg>
  ),
};

const styles = {
  Complete: "bg-[#E8F6D8] text-[#4D6B1F] border-[#B7D78A]",
  "In Progress": "bg-[#FFF6CC] text-[#7A5E00] border-[#E7D37A]",
  "Not Started": "bg-[#F3EFEA] text-[#4B3A46] border-[#D8CEC2]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      aria-label={`Status: ${status}`}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className="shrink-0">{icons[status]}</span>
      <span className="truncate">{status}</span>
    </span>
  );
}