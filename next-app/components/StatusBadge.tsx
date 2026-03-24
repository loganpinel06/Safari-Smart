type StatusBadgeProps = {
  status: "Complete" | "In Progress" | "Not Started";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    Complete: "bg-[#E8F6D8] text-[#4D6B1F] border-[#B7D78A]",
    "In Progress": "bg-[#FFF6CC] text-[#7A5E00] border-[#E7D37A]",
    "Not Started": "bg-[#F3EFEA] text-[#4B3A46] border-[#D8CEC2]",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}