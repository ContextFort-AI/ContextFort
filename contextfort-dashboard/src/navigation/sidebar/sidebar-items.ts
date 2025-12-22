import {
  Activity,
  AlertTriangle,
  type LucideIcon,
  MousePointerClick,
  Shield,
  LayoutDashboard,
  User,
  Bot,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Security Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        title: "POST Requests",
        url: "/dashboard/post-requests",
        icon: Shield,
      },
      {
        title: "Click Detection",
        url: "/dashboard/click-detection",
        icon: MousePointerClick,
      },
    ],
  },
  {
    id: 2,
    label: "Request Classification",
    items: [
      {
        title: "Human Requests",
        url: "/dashboard/human-requests",
        icon: User,
        isNew: true,
      },
      {
        title: "Bot Requests",
        url: "/dashboard/bot-requests",
        icon: Bot,
        isNew: true,
      },
    ],
  },
  {
    id: 3,
    label: "Incidents",
    items: [
      {
        title: "All Incidents",
        url: "/dashboard/overview",
        icon: AlertTriangle,
      },
      {
        title: "Activity Feed",
        url: "/dashboard/click-detection",
        icon: Activity,
      },
    ],
  },
];
