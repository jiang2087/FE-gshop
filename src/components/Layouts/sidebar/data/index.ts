import { url } from "node:inspector";
import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/admin",
        items: [
        ],
      },
      {
        title: "Calendar",
        url: "/admin/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Tables",
        url: "/admin/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/admin/tables",
          },
        ],
      },
      {
        title: "Products",
        icon: Icons.ProductIcon,
        url: "/admin/products",
        items: [
        ],
      },
      {
        title: "Settings",
        icon: Icons.Alphabet,
        url: "/admin/pages/settings",
        items: [],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/admin/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/admin/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/admin/auth/sign-in",
          },
        ],
      },
    ],
  },
];
