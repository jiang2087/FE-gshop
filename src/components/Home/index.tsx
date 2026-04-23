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
import { getReviewStats, getTopReviews } from "@/api/reviewApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [productsData, reviewsData] = await Promise.all([
          getAllProducts({ page: 0, size: 20 }),
          getTopReviews(0, 6)
        ]);
        
        const reviewStats = await getReviewStats(productsData.content.map((p) => p.id));

        const statsMap = new Map(reviewStats.map((s) => [s.productId, s]));

        const mergedProducts = productsData.content.map((p) => {
          const stat = statsMap.get(p.id) as any;
          return {
            ...p,
            reviewCount: stat?.count ?? 0,
            avgRating: stat?.avg ?? 5,
          };
        });

        if (isMounted) {
          setProducts(mergedProducts);
          setTopReviews(reviewsData.content || reviewsData);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

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
      <Testimonials reviews={topReviews} />
      <Newsletter />
    </main>
  );
};

export default Home;
