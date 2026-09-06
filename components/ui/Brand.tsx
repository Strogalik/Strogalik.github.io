import Link from "next/link";
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      className={`brand ${light ? "brand-light" : ""}`}
      href="/"
      aria-label="РусГаз — главная"
    >
      <img src="/assets/rusgaz-mark.png" width="40" height="40" alt="" />
      <span>РусГаз</span>
    </Link>
  );
}
