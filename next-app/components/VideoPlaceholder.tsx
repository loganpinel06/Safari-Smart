type VideoPlaceholderProps = {
  label?: string;
};

export default function VideoPlaceholder({
  label = "Image / Video Placeholder",
}: VideoPlaceholderProps) {
  return (
    <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#4B3A46]/20 bg-[#F3EFEA] text-sm text-[#4B3A46]">
      {label}
    </div>
  );
}