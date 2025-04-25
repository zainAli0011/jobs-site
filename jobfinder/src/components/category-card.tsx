import Link from "next/link";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/jobs?category=${category.name.toLowerCase()}`}
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center rounded-lg border bg-card hover:shadow-md transition-shadow",
        className
      )}
    >
      <span className="text-4xl mb-3">{category.icon}</span>
      <h3 className="text-lg font-medium mb-1">{category.name}</h3>
      <p className="text-sm text-muted-foreground">{category.count} jobs</p>
    </Link>
  );
} 