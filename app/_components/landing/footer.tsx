import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import Image from "next/image";

const PRODUCT_CELLS = {
  title: "Product",
  cells: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "API", href: "#" },
  ],
};
const DEVELOPERS_CELLS = {
  title: "Developers",
  cells: [
    { label: "Documentation", href: "#" },
    { label: "SDKs", href: "#" },
    { label: "WebHooks", href: "#" },
    { label: "Status", href: "#" },
  ],
};
const COMPANY_CELLS = {
  title: "Company",
  cells: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-white">
      <div className="container mx-auto py-16">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/icon.png" alt="logo" width={35} height={35} />
              <p className="text-xl leading-relaxed font-bold">
                Trigger<span className="text-blue-400">.io</span>
              </p>
            </Link>
            <p className="max-w-xs text-gray-400">
              The most advanced push notifications platform for developers.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <Column title={PRODUCT_CELLS.title} cells={PRODUCT_CELLS.cells} />
          <Column
            title={DEVELOPERS_CELLS.title}
            cells={DEVELOPERS_CELLS.cells}
          />
          <Column title={COMPANY_CELLS.title} cells={COMPANY_CELLS.cells} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 Trigger.io. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 text-sm text-gray-400 md:mt-0">
            <Link href="#" className="transition-colors hover:text-blue-400">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-400">
              Terms
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-400">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface ColumnProps {
  title: string;
  cells: {
    label: string;
    href: string;
  }[];
}
export const Column = ({ title, cells }: ColumnProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="space-y-2 text-gray-400">
        {cells.map(({ label, href }, i) => (
          <li key={label + href + i}>
            <Link href={href} className="transition-colors hover:text-blue-400">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
