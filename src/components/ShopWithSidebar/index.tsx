"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";
import shopData from "../Shop/shopData";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { useSearchParams } from "next/navigation";
import {
  getProductByType,
  getAllProducts,
  getProductsByPriceRange,
} from "@/api/productApi";
import { getReviewStats } from "@/api/reviewApi";

const ShopWithSidebar = ({ cartKey }: { cartKey: string }) => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryType, setCategoryType] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [priceFilteredProducts, setPriceFilteredProducts] = useState(null);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Latest Products", value: "0" },
    { label: "Best Selling", value: "1" },
    { label: "Old Products", value: "2" },
  ];

  const categories = ["LAPTOP", "MOBILE", "TELEVISION", "WATCHES"];

  const genders = [
    {
      name: "Men",
      products: 10,
    },
    {
      name: "Women",
      products: 23,
    },
    {
      name: "Unisex",
      products: 8,
    },
  ];

  const searchParams = useSearchParams();
  let category = searchParams.get("type");
  const [pageIndex, setPageIndex] = useState(1);
  const [page, setPage] = useState(null);
  const showing = Math.min(pageIndex * page?.size, page?.totalElements);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pageIndex]);
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        let data;
        const pageRequest = {
          page: pageIndex - 1,
          size: 9,
        };

        const hasCustomPrice = minPrice !== 0 || maxPrice !== 2000;
        const hasCategory = !!category;
        const hasCategoryType = categoryType.length > 0;
        
        const categoryParam = hasCategoryType ? categoryType.join(",") : null;

        if (hasCustomPrice) {
          data = await getProductsByPriceRange(
            categoryParam,
            minPrice,
            maxPrice,
            pageRequest,
          );
        } else if (hasCategoryType) {
          data = await getProductByType(categoryParam, pageRequest);
        } else if (hasCategory) {
          data = await getProductByType(category, pageRequest);
        } else {
          data = await getAllProducts(pageRequest);
        }
        setProducts(data.content || data || []);
        setPage(data.page);

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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [pageIndex, category, categoryType, minPrice, maxPrice]);

  const renderPagination = () => {
    if (!page) return null;

    const current = pageIndex; // trang hiện tại (0-based hoặc 1-based tùy bạn)
    const total = page.totalPages;

    const pages = [];

    for (let i = 1; i <= total; i++) {
      // chỉ hiển thị:
      // - trang đầu
      // - trang cuối
      // - trang hiện tại ±1
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        pages.push(i);
      } else if (i === current - 2 || i === current + 2) {
        pages.push("...");
      }
    }
    const handlePageChange = (page) => {
      setPageIndex(page);
    };
    return pages.map((p, index) => (
      <li key={index}>
        {p === "..." ? (
          <span className="px-3 py-1.5">...</span>
        ) : (
          <button
            onClick={() => handlePageChange(p)}
            className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
              p === current
                ? "bg-blue text-white"
                : "hover:text-white hover:bg-blue"
            }`}
          >
            {p}
          </button>
        )}
      </li>
    ));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleReceiveData = (value) => {
    setCategoryType(value);
  };

  const handlePriceData = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <>
      <Breadcrumb
        title={"Explore All Products"}
        pages={["shop", "/", "shop with sidebar"]}
      />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* <!-- Sidebar Start --> */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z"
                    fill=""
                  />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* <!-- filter box --> */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>
                      <button
                        onClick={() => {
                          setCategoryType([]);
                          setPriceFilteredProducts(null);
                        }}
                        className="text-blue"
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* <!-- category box --> */}
                  <CategoryDropdown
                    onSendData={handleReceiveData}
                    categories={categories}
                  />

                  {/* <!-- gender box --> */}
                  {/* <GenderDropdown genders={genders} /> */}

                  {/* // <!-- size box --> */}
                  {/* <SizeDropdown /> */}

                  {/* // <!-- color box --> */}
                  {/* <ColorsDropdwon /> */}

                  {/* // <!-- price range box --> */}
                  <PriceDropdown onSendData={handlePriceData} />
                </div>
              </form>
            </div>
            {/* // <!-- Sidebar End --> */}

            {/* // <!-- Content Start --> */}
            <div className="xl:max-w-[870px] w-full">
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* <!-- top bar left --> */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />

                    <p>
                      Showing{" "}
                      <span className="text-dark">
                        {showing} of {page?.totalElements}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  {/* <!-- top bar right --> */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="button for product grid tab"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-1"
                      } flex items-center justify-center w-8 h-8 rounded-[3px] border duration-200`}
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 1H6V6H1V1Z" />
                        <path d="M10 1H15V6H10V1Z" />
                        <path d="M1 10H6V15H1V10Z" />
                        <path d="M10 10H15V15H10V10Z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="button for product list tab"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-1"
                      } flex items-center justify-center w-8 h-8 rounded-[3px] border duration-200`}
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M1 1H15V3H1V1Z" />
                        <path d="M1 6H15V8H1V6Z" />
                        <path d="M1 11H15V13H1V11Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* <!-- Products Display --> */}
              {loading && (
                <div className="text-center py-10">Loading products...</div>
              )}
              {error && (
                <div className="text-center py-10 text-red-500">{error}</div>
              )}
              {!loading &&
                !error &&
                (priceFilteredProducts !== null
                  ? priceFilteredProducts?.content?.length === 0
                  : products.length === 0) && (
                  <div className="text-center py-10">No products found</div>
                )}

              {!loading && !error && products.length > 0 && (
                <div
                  className={`${
                    productStyle === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }`}
                >
                  {products.map((product: any) => (
                    <div key={product.id}>
                      {productStyle === "grid" ? (
                        <SingleGridItem product={product} cartKey={cartKey} />
                      ) : (
                        <SingleListItem product={product} cartKey={cartKey} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* <!-- Products Pagination Start --> */}
              <div className="flex items-center justify-center mt-10">
                <div className="flex items-center gap-2">
                  <ul className="flex items-center gap-1">
                    <li>
                      <button
                        id="paginationLeft"
                        onClick={() => setPageIndex((prev) => prev - 1)}
                        aria-label="button for pagination left"
                        type="button"
                        disabled={pageIndex === 1}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1782 16.1156C12.0095 16.1156 11.8407 16.0594 11.7282 15.9187L5.37197 9.45C5.11885 9.19687 5.11885 8.80312 5.37197 8.55L11.7282 2.08125C11.9813 1.82812 12.3751 1.82812 12.6282 2.08125C12.8813 2.33437 12.8813 2.72812 12.6282 2.98125L6.72197 9L12.6563 15.0187C12.9095 15.2719 12.9095 15.6656 12.6563 15.9187C12.4876 16.0312 12.347 16.1156 12.1782 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>

                    {renderPagination()}

                    <li>
                      <button
                        id="paginationRight"
                        aria-label="button for pagination right"
                        onClick={() => setPageIndex((prev) => prev + 1)}
                        type="button"
                        disabled={pageIndex === page?.totalPages - 1}
                        className="flex items-center justify-center w-8 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.82197 16.1156C5.65322 16.1156 5.5126 16.0594 5.37197 15.9469C5.11885 15.6937 5.11885 15.3 5.37197 15.0469L11.2782 9L5.37197 2.98125C5.11885 2.72812 5.11885 2.33437 5.37197 2.08125C5.6251 1.82812 6.01885 1.82812 6.27197 2.08125L12.6282 8.55C12.8813 8.80312 12.8813 9.19687 12.6282 9.45L6.27197 15.9187C6.15947 16.0312 5.99072 16.1156 5.82197 16.1156Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              {/* <!-- Products Pagination End --> */}
            </div>
            {/* // <!-- Content End --> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;
