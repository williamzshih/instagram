export default function GradientRing({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-ig-orange to-ig-red rounded-full bg-linear-to-tr p-1">
      <div className="bg-background rounded-full p-1">{children}</div>
    </div>
  );
}
