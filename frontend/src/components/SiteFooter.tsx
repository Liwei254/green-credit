import { Instagram, Twitter, Github, BookOpen, Link as LinkIcon } from "lucide-react";

const FooterLink = ({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 hover:text-white transition"
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{children}</span>
  </a>
);

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0D1117]/60">
      <div className="mx-auto max-w-7xl px-4">
        <div className="py-8 text-center text-sm text-slate-400">
          <div className="mb-3">
            © {new Date().getFullYear()}{" "}
            <span className="text-green-400">Green Credits</span> — Building a
            sustainable, transparent future on Moonbeam.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-slate-300">
            <FooterLink href="https://moonbeam.network/" icon={LinkIcon}>
              Moonbeam
            </FooterLink>

            <FooterLink href="https://github.com/Liwei254/green-credits" icon={Github}>
              GitHub
            </FooterLink>

            <FooterLink
              href="https://github.com/Liwei254/green-credits#readme"
              icon={BookOpen}
            >
              Docs
            </FooterLink>

            <FooterLink href="https://www.instagram.com/greencredit.xyz/" icon={Instagram}>
              Instagram
            </FooterLink>

            <FooterLink href="https://polkadot.network" icon={LinkIcon}>
              Polkadot
            </FooterLink>

            <FooterLink href="https://x.com/greencreditxyz" icon={Twitter}>
              X
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
