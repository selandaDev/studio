import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("text-2xl font-extrabold tracking-tight text-primary", className)}>
      Doby
    </div>
  );
}
