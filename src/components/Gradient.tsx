export default function Gradient({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-1 rounded-full bg-linear-to-tr from-ig-orange to-ig-red">
      <div className="p-1 rounded-full bg-background">{children}</div>
    </div>
  );
}
