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
        title: "Users",
        url: "/admin/users",
        icon: Icons.User,
        items: [],
      },
      // {
      //   title: "Profile",
      //   url: "/admin/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      {
        title: "Sales",
        icon: Icons.Table,
        url: "/admin/sales",
        items: [
          {
            title: "Discount",
            icon: Icons.DiscountIcon,
            url: "/admin/sales/discounts",
          },
          {
            title: "Voucher",
            icon: Icons.VoucherIcon,
            url: "/admin/sales/vouchers"
          }
        ],
      },
      {
        title: "Orders",
        url: "/admin/orders",
        icon: Icons.OrderIcon,
        items: [],
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
        url: "/admin/settings",
        items: [],
      },
      {
        title: "Data Ingestion",
        url: "/admin/data-ingestion",
        icon: Icons.OrderIcon,
        items: [],
      },
    ],
  },
  // {
  //   label: "OTHERS",
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/admin/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/admin/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/admin/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
