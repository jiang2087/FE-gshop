"use client";
import Hero from "./Hero";

import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/api/productApi";
import Newsletter from "../Common/Newsletter";
import { getReviewStats } from "@/api/reviewApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts({ page: 0, size: 20 });
        const reviewStats = await getReviewStats(data.content.map((p) => p.id));

        const statsMap = new Map(reviewStats.map((s) => [s.productId, s]));

        const mergedProducts = data.content.map((p) => {
          const stat = statsMap.get(p.id) as any;
          return {
            ...p,
            reviewCount: stat?.count ?? 0,
            avgRating: stat?.avg ?? 5,
          };
        });

        if (isMounted) {
          setProducts(mergedProducts);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main>
      <Hero products={products} />
      <Categories />
      <NewArrival products={products} />
      <PromoBanner />
      <BestSeller products={products}/>
      <CounDown />
      <Testimonials />
      <Newsletter />
    </main>
  );
};

export default Home;
