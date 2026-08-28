import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NovaMark } from "@/components/visual/NovaMark";

/**
 * 404 页面（品牌化）。
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <NovaMark className="h-14 w-14" />
      <p className="mt-8 font-mono text-xs uppercase tracking-widest text-nova-cyanSoft">
        404 — Not found
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-mist-100 sm:text-5xl">
        This page drifted into deep space
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-mist-400 text-pretty">
        The page you’re looking for doesn’t exist or has moved. Head back to
        explore the Nova network.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
      <Link
        href="/technology"
        className="mt-4 text-sm text-mist-500 transition-colors hover:text-white"
      >
        or explore the technology
      </Link>
    </Container>
  );
}
