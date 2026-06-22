"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Person,
  Gear,
  Droplet,
  CirclePlus,
  ListCheck,
  Persons,
} from "@gravity-ui/icons";

const ICONS = {
  House,
  Person,
  Gear,
  Droplet,
  CirclePlus,
  ListCheck,
  Persons,
};

export default function SidebarNav({ items }) {
  const pathname = usePathname();

  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(item.href);
        const color = item.color || "var(--pl-primary)";
        const Icon = ICONS[item.icon];

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            style={
              active
                ? {
                    backgroundColor:
                      "color-mix(in srgb, " + color + " 12%, transparent)",
                    color: color,
                  }
                : undefined
            }
            className={
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors " +
              (active ? "" : "text-[var(--pl-ink)] hover:bg-[var(--pl-surface)]")
            }
          >
            {active ? (
              <span
                style={{ backgroundColor: color }}
                className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full"
              />
            ) : null}
            {Icon ? (
              <Icon
                className="size-5 shrink-0"
                style={{ color: active ? color : "var(--pl-ink-soft)" }}
              />
            ) : null}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}