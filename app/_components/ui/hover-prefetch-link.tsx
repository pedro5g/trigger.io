"use client";
import Link from "next/link";
import { useState } from "react";

interface HoverPrefetchLinkProps {
  href: string;
  children: React.ReactNode;
}

export const HoverPrefetchLink = ({
  href,
  children,
}: HoverPrefetchLinkProps) => {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
};
