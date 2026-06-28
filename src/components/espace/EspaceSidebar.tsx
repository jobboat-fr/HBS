"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GraduationCap, KanbanSquare, UserCog, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";

const links = [
  { href: "/espace-client", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/espace-client/formations", label: "Catalogue", icon: GraduationCap },
  { href: "/espace-client/tableau", label: "Mon tableau", icon: KanbanSquare },
  { href: "/espace-client/profil", label: "Mon profil", icon: UserCog },
  { href: "/espace-client/contact", label: "Contacter le centre", icon: MessageSquare },
];

export function EspaceSidebar() {
  const pathname = usePathname();
  const isActive = (l: (typeof links)[number]) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-mist bg-white p-2 shadow-card lg:flex-col lg:overflow-visible">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              isActive(l) ? "bg-teal-50 text-teal-700" : "text-ink-soft hover:bg-cloud hover:text-ink",
            )}
          >
            <l.icon size={18} className={isActive(l) ? "text-teal-600" : "text-ink-muted"} />
            <span className="whitespace-nowrap">{l.label}</span>
          </Link>
        ))}
        <div className="hidden border-t border-mist pt-3 lg:mt-2 lg:block">
          <div className="px-4">
            <SignOutButton />
          </div>
        </div>
      </nav>
    </aside>
  );
}
