import {
  type LucideIcon,
  Shield,
  Download,
  Eye,
  Sliders,
  BarChart3,
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
      {
        title: "Home",
        url: "/dashboard",
        icon: BarChart3,
      },
      {
        title: "Visibility",
        url: "/dashboard/visibility",
        icon: Eye,
      },
      {
        title: "Controls",
        url: "/dashboard/controls",
        icon: Sliders,
        subItems: [
          {
            title: "Page Mixing",
            url: "/dashboard/controls/page-mixing",
          },
          {
            title: "Action Block",
            url: "/dashboard/controls/action-block",
          },
        ],
      },
      // Future features (keep pages for later):
      // {
      //   title: "Blocked Requests",
      //   url: "/dashboard/post-requests",
      //   icon: Shield,
      // },
      // {
      //   title: "Downloads",
      //   url: "/dashboard/downloads",
      //   icon: Download,
      // },
    ],
  },
];
