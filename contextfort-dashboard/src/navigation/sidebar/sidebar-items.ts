import {
  Activity,
  AlertTriangle,
  type LucideIcon,
  MousePointerClick,
  Shield,
  LayoutDashboard,
  User,
  Bot,
  Download,
  Eye,
  List,
  ShieldAlert,
  Globe,
  Sliders,
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
    items: [
      // {
      //   title: "Overview",
      //   url: "/dashboard/overview",
      //   icon: LayoutDashboard,
      // },
      // {
      //   title: "Blocked Requests",
      //   url: "/dashboard/post-requests",
      //   icon: Shield,
      // },
      // {
      //   title: "Click Detection",
      //   url: "/dashboard/click-detection",
      //   icon: MousePointerClick,
      // },
      // {
      //   title: "Downloads",
      //   url: "/dashboard/downloads",
      //   icon: Download,
      //   isNew: true,
      // },
      {
        title: "Visibility",
        url: "/dashboard/visibility",
        icon: Eye,
        isNew: true,
      },
      {
        title: "Controls",
        url: "/dashboard/controls",
        icon: Sliders,
        isNew: true,
      },
      // {
      //   title: "Whitelist",
      //   url: "/dashboard/whitelist",
      //   icon: List,
      //   isNew: true,
      // },
      // {
      //   title: "Sensitive Words",
      //   url: "/dashboard/sensitive-words",
      //   icon: ShieldAlert,
      //   isNew: true,
      // },
    ],
  },
  // {
  //   id: 2,
  //   label: "Request Classification",
  //   items: [
  //     {
  //       title: "Human Requests",
  //       url: "/dashboard/human-requests",
  //       icon: User,
  //       isNew: true,
  //     },
  //     {
  //       title: "Bot Requests",
  //       url: "/dashboard/bot-requests",
  //       icon: Bot,
  //       isNew: true,
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   label: "Incidents",
  //   items: [
  //     {
  //       title: "All Incidents",
  //       url: "/dashboard/overview",
  //       icon: AlertTriangle,
  //     },
  //     {
  //       title: "Activity Feed",
  //       url: "/dashboard/click-detection",
  //       icon: Activity,
  //     },
  //   ],
  // },
];
