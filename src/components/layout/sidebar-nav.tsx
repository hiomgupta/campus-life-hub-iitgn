
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Bus,
  Map,
  Home,
  Clock,
  QrCode,
  Utensils,
  Bell,
  Users,
  LucideIcon
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

interface SidebarNavProps {
  onNavItemClick?: () => void;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Notice Board",
    href: "/notice-board",
    icon: Bell,
  },
  {
    title: "Clubs",
    href: "/clubs",
    icon: Users,
  },
  {
    title: "Bus Schedule",
    href: "/bus-schedule",
    icon: Bus,
  },
  {
    title: "Mess Menu",
    href: "/mess-menu",
    icon: Utensils,
  },
  {
    title: "QR Code",
    href: "/mess-qr",
    icon: QrCode,
  },
  {
    title: "Food Outlets",
    href: "/food-outlets",
    icon: Clock,
  },
  {
    title: "Campus Map",
    href: "/campus-map",
    icon: Map,
  },
];

export function SidebarNav({ onNavItemClick }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onNavItemClick}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            location.pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:text-foreground hover:bg-muted"
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
