import {
  type LucideIcon,
  Shield,
  Download,
  Eye,
  Sliders,
  BarChart3,
  ScrollText,
  Calendar,
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
        url: "/dashboard/home",
        icon: BarChart3,
      },
      {
        title: "Visibility",
        url: "/dashboard/visibility",
        icon: Eye,
      },
      {
        title: "Controls",
        url: "/dashboard/page-mixing",
        icon: Sliders,
        subItems: [
          {
            title: "Stop Context Mixing",
            url: "/dashboard/page-mixing",
          },
          {
            title: "Block Actions",
            url: "/dashboard/action-block",
          },
          {
            title: "Block Domains",
            url: "/dashboard/domains",
          },
        ],
      },
      {
        title: "Governance",
        url: "/dashboard/rules",
        icon: ScrollText,
        subItems: [
          {
            title: "Rules",
            url: "/dashboard/rules",
          },
        ],
      },
      {
        title: "Book Demo with Team",
        url: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2-LisBxMgnCRJ-LKKb-R3pFbF841mGLD05pQdMbsBW-4MJvb0Jy2ksFKVYziMHfKcECrF9yIHt",
        icon: Calendar,
        newTab: true,
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
