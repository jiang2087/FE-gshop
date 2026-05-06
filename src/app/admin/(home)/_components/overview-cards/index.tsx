"use client"

import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { useEffect, useState } from "react";
import * as adminApi from "@/api/adminApi";

export function OverviewCardsGroup() {
  const [infor, setInfor] = useState({
    profit: 0,
    totalProduct: 0,
    totalUser: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const profit = await adminApi.getProfitThisMonth();
      const totalProduct = await adminApi.countProductVariants();
      const totalUser = await adminApi.getTotalUsers();

      setInfor({
        profit,
        totalProduct,
        totalUser,
      });
    };

    fetchData();
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 2xl:gap-7.5">
      <OverviewCard
        label="Total profit this month"
        data={{
          growthRate: -1.2,
          value: "$" + infor.profit,
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Products"
        data={{
          growthRate: 1.5,
          value: infor.totalProduct,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Users"
        data={{
          growthRate: 4.3,
          value: infor.totalUser,
        }}
        Icon={icons.Users}
      />
    </div>
  );
}
