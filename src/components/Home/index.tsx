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
import TopVoucher from "./TopVoucher/index";
import { getTop5Vouchers, VoucherResponse } from "@/api/discountApi";
import { RootState, useAppSelector } from "@/redux/store";


const Home = ({cartKey} : {cartKey: string}) => {
  const [products, setProducts] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const {user} = useAppSelector((state: RootState) => state.auth);

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
  
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await getTop5Vouchers(user?.id);
        setVouchers(data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, []);


  return (
    <main>
      
      <Hero products={products} />
      {vouchers.length > 0 && <TopVoucher vouchers={vouchers}/>}
      <Categories />
      <NewArrival cartKey={cartKey} products={products} />
      <PromoBanner />
      <BestSeller cartKey={cartKey} products={products}/>
      <CounDown />
      <Testimonials reviews={topReviews} />
      <Newsletter />
    </main>
  );
};

export default Home;

