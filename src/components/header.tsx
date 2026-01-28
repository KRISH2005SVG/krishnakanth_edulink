"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { capitalize } from "lodash";

const getTitle = (pathname: string): string => {
  if (pathname.startsWith("/tutors/")) return "Tutor Profile";
  if (pathname === "/dashboard") return "Tutor Dashboard";
  if (pathname === "/smart-matching") return "Smart Matching";
  return "EduLink";
};

export function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
    </header>
  );
}
