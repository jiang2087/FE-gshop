"use client";
import React, { use, useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Newsletter from "../Common/Newsletter";
import RecentlyViewdItems from "@/components/ShopDetails/RecentlyViewd";
import { usePreviewSlider } from "@/app/context/PreviewSliderContext";
import { getProductById } from "@/api/productApi";
import { Heart, ThumbsUp } from "lucide-react";
import { getReviewsByProductId } from "@/api/reviewApi";
import { AppDispatch, RootState, useAppSelector } from "@/redux/store";
import { reviewApi } from "@/api/reviewApi";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { addToCartThunk } from "@/redux/slices/cart-slice";

const DetailItems = {
  laptop: [
    { key: "storage", label: "Storage" },
    { key: "ram", label: "RAM" },
    { key: "cpu", label: "CPU" },
  ],
};

const AdditionalInfo = {
  laptop: [
    { key: "cpu", label: "CPU" },
    { key: "ram", label: "RAM" },
    { key: "storage", label: "Storage" },
    { key: "gpu", label: "GPU" },
    { key: "resolution", label: "Resolution" },
    { key: "screenSize", label: "Screen Size" },
    { key: "dimension", label: "Dimension" },
    { key: "brand", label: "Brand" },
  ],
  mobile: [
    { key: "name", label: "Name" },
    { key: "model", label: "Model" },
    { key: "brand", label: "Brand" },
    { key: "productType", label: "Product Type" },
    { key: "ScreenSize", label: "Screen Size (inch)" },
    { key: "resolution", label: "Resolution" },
    { key: "camera", label: "Camera" },
    { key: "battery", label: "Battery" },
    { key: "dimension", label: "Dimensions" },
  ],
  watches: [
    { key: "name", label: "Name" },
    { key: "model", label: "Model" },
    { key: "brand", label: "Brand" },
    { key: "productType", label: "Product Type" },
    { key: "gender", label: "Gender" },
    { key: "material", label: "Material" },
    { key: "batteryLife", label: "Battery Life (hours)" },
    { key: "gps", label: "GPS" },
  ],
  televisions: [
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "productType", label: "Product Type" },
    { key: "screenSize", label: "Screen Size (inch)" },
    { key: "resolution", label: "Resolution" },
    { key: "refreshRate", label: "Refresh Rate (Hz)" },
    { key: "weight", label: "Weight (kg)" },
    { key: "warrantyMonths", label: "Warranty (months)" },
  ],
};

const formatValue = (item, value) => {
  if (value === null || value === undefined) return "-";

  // boolean
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  // custom theo field
  switch (item.key) {
    case "screenSize":
      return `${value}"`;
    case "refreshRate":
      return `${value} Hz`;
    case "weight":
      return `${value} kg`;
    case "warrantyMonths":
      return `${value} months`;
    case "batteryLife":
      return `${value} hours`;
    case "gps":
      return value ? "Yes" : "No";
    default:
      return value;
  }
};

const ProductDetail = ({ cartKey }: { cartKey: string | undefined }) => {
  const [activeColor, setActiveColor] = useState("blue");
  const { openPreviewModal } = usePreviewSlider();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const [previewImg, setPreviewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState("tabOne");
  const [hover, setHover] = useState(0);

  const [liked, setLiked] = useState(false);
  const [likedReviews, setLikedReviews] = useState([]);

  const [typeP, setTypeP] = useState<string>("");

  const [product1, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any>(null);
  const [isHelpful, setIsHelpful] = useState<
    Array<{ id: number; helpful: boolean }>
  >([]);
  const searchParams = useSearchParams();
  const productId = parseInt(searchParams.get("id") ?? "1", 10);
  const [review, setReview] = useState({
    userId: user?.id || null,
    productVariantId: productId || null,
    comment: "",
    username: user?.username || "",
    avatar: user?.imageUrl || "",
    rating: 1,
  });

  
  const tabs = [
    {
      id: "tabOne",
      title: "Description",
    },
    {
      id: "tabTwo",
      title: "Additional Information",
    },
    {
      id: "tabThree",
      title: "Reviews",
    },
  ];

  // add to cart
  const handleAddToCart = () => {
    const defaultVariant = product1.productVariants?.[0];
    if (!defaultVariant) {
      console.error("No product variant available");
      return;
    }
    dispatch(addToCartThunk({ 
      cartKey: cartKey || "", 
      productVariantId: defaultVariant.id, 
      quantity: 1 
    }))
      .unwrap()
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  };


  const handlePreviewSlider = () => {
    openPreviewModal(product1?.id || 1);
  };

  const getClassColor = (reviewId) => {
    const helpful = isHelpful.some((item) => item.id === reviewId);
    const toggleLiked = likedReviews.includes(reviewId);
    return helpful || toggleLiked ? "text-[#FBB040]" : "text-gray-400";
  };

  const handleHelpful = async (reviewId, userId) => {
    try {
      var response = await reviewApi.toggleReviewHelpful(reviewId, userId);

      setLikedReviews((prev) =>
        response ? [...prev, reviewId] : prev.filter((id) => id !== reviewId),
      );

      setIsHelpful((prev) =>
        response
          ? [
              ...prev.filter((n) => n.id !== reviewId),
              { id: reviewId, helpful: true },
            ]
          : prev.filter((n) => n.id !== reviewId),
      );

      setReviews(
        response
          ? reviews.map((r) =>
              r.id === reviewId
                ? { ...r, helpfulCount: r.helpfulCount + 1 }
                : r,
            )
          : reviews.map((r) =>
              r.id === reviewId
                ? { ...r, helpfulCount: r.helpfulCount - 1 }
                : r,
            ),
      );
    } catch (error) {
      console.error("Error updating helpful count:", error);
    }
  };

  const handleRating = (value) => {
    setReview((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await reviewApi.createReview(review);

      toast.success("Review submitted successfully");
      setReviews((prev) => [response, ...prev]);

      setReview({
        userId: null,
        productVariantId: null,
        comment: "",
        username: "",
        avatar: "",
        rating: 0,
      });
    } catch (error) {
      console.error(error);
      toast.error("You have not purchased this product");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductById(productId);
      setProduct(data);
      setTypeP(data?.productType?.toLowerCase());
    };
    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await reviewApi.getLikebyUserIdAndProductId(
        user?.id || 0,
        productId,
      );
      setLikedReviews(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!product1?.id) return;

      try {
        const reviewsData = await getReviewsByProductId(product1.id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [product1?.id]);

  const detailItem = DetailItems[typeP];
  const additionalInfo = AdditionalInfo[typeP];

  return (
    <>
      <Breadcrumb
        title={product1?.name || "Product Details"}
        pages={["products"]}
      />

      {product1?.name === "" ? (
        "Please add product"
      ) : (
        <>
          <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
                <div className="lg:max-w-[570px] w-full">
                  <div className="lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center">
                    <div>
                      <button
                        onClick={handlePreviewSlider}
                        aria-label="button for zoom"
                        className="gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50"
                      >
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z"
                            fill=""
                          />
                        </svg>
                      </button>

                      {product1?.productVariants?.[previewImg]?.image && (
                        <Image
                          src={product1.productVariants[previewImg].image}
                          alt="products-details"
                          width={400}
                          height={400}
                        />
                      )}
                    </div>
                  </div>

                  {/* ?  &apos;border-blue &apos; :  &apos;border-transparent&apos; */}
                  <div className="flex flex-wrap sm:flex-nowrap gap-4.5 mt-6">
                    {product1?.productVariants?.map((item, key) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={key}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          key === previewImg
                            ? "border-blue"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          width={50}
                          height={50}
                          src={item?.image}
                          alt="thumbnail"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className="max-w-[539px] w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">
                      {product1?.name}
                    </h2>

                    <div className="inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5">
                      30% OFF
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5.5 mb-4.5">
                    <div className="flex items-center gap-2.5">
                      {/* <!-- stars --> */}
                      <div className="flex items-center gap-1">
                        <svg
                          className="fill-[#FFA645]"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_375_9172)">
                            <path
                              d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_375_9172">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className="fill-[#FFA645]"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_375_9172)">
                            <path
                              d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_375_9172">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className="fill-[#FFA645]"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_375_9172)">
                            <path
                              d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_375_9172">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className="fill-[#FFA645]"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_375_9172)">
                            <path
                              d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_375_9172">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          className="fill-[#FFA645]"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_375_9172)">
                            <path
                              d="M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_375_9172">
                              <rect width="18" height="18" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>

                      <span> ({reviews?.length || 0} customer reviews) </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {product1?.productVariants[previewImg]?.stockQuantity >
                      0 ? (
                        <>
                          {/* In Stock */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_375_9221)">
                                <path
                                  d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                                  fill="#22AD5C"
                                />
                                <path
                                  d="M12.6875 7.09374L8.9688 10.7187L7.2813 9.06249C7.00005 8.78124 6.56255 8.81249 6.2813 9.06249C6.00005 9.34374 6.0313 9.78124 6.2813 10.0625L8.2813 12C8.4688 12.1875 8.7188 12.2812 8.9688 12.2812C9.2188 12.2812 9.4688 12.1875 9.6563 12L13.6875 8.12499C13.9688 7.84374 13.9688 7.40624 13.6875 7.12499C13.4063 6.84374 12.9688 6.84374 12.6875 7.09374Z"
                                  fill="#22AD5C"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_375_9221">
                                  <rect width="20" height="20" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>

                            <span className="text-green"> In Stock </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Out of Stock */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_375_9221)">
                                <path
                                  d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.78125 19.4688 10 19.4688C15.2188 19.4688 19.4688 15.2188 19.4688 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.59375 18.0625 10.0312C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                                  fill="#EF4444"
                                />
                                <path
                                  d="M7 7L13 13M13 7L7 13"
                                  stroke="#EF4444"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_375_9221">
                                  <rect width="20" height="20" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>

                            <span className="text-red-light">
                              {" "}
                              Out of Stock{" "}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="font-medium text-custom-1 mb-4.5">
                    <span className="text-sm sm:text-base text-dark">
                      Price: ${product1?.productVariant?.price}
                    </span>
                    <span className="line-through">
                      {" "}
                      123 ${product1?.productVariant?.discountedPrice}{" "}
                    </span>
                  </h3>

                  <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                          fill="#3C50E0"
                        />
                      </svg>
                      Free delivery available
                    </li>

                    <li className="flex items-center gap-2.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.3589 8.35863C13.603 8.11455 13.603 7.71882 13.3589 7.47475C13.1149 7.23067 12.7191 7.23067 12.4751 7.47475L8.75033 11.1995L7.5256 9.97474C7.28152 9.73067 6.8858 9.73067 6.64172 9.97474C6.39764 10.2188 6.39764 10.6146 6.64172 10.8586L8.30838 12.5253C8.55246 12.7694 8.94819 12.7694 9.19227 12.5253L13.3589 8.35863Z"
                          fill="#3C50E0"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0003 1.04169C5.05277 1.04169 1.04199 5.05247 1.04199 10C1.04199 14.9476 5.05277 18.9584 10.0003 18.9584C14.9479 18.9584 18.9587 14.9476 18.9587 10C18.9587 5.05247 14.9479 1.04169 10.0003 1.04169ZM2.29199 10C2.29199 5.74283 5.74313 2.29169 10.0003 2.29169C14.2575 2.29169 17.7087 5.74283 17.7087 10C17.7087 14.2572 14.2575 17.7084 10.0003 17.7084C5.74313 17.7084 2.29199 14.2572 2.29199 10Z"
                          fill="#3C50E0"
                        />
                      </svg>
                      Sales 30% Off Use Code: PROMO30
                    </li>
                  </ul>

                  <form>
                    <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                      {/* <!-- details item --> */}
                      <div className="flex items-center gap-4">
                        <div className="min-w-[65px]">
                          <h4 className="font-medium text-dark">Color:</h4>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {product1?.productVariants?.map((variant, key) => {
                            const color = variant.color?.hexCode;
                            const colorName = variant.color?.name; // tên màu

                            const isWhite =
                              color?.toLowerCase() === "#fff" ||
                              color?.toLowerCase() === "#ffffff";

                            return (
                              <label
                                key={key}
                                htmlFor={color}
                                className="cursor-pointer flex items-center gap-2"
                              >
                                <input
                                  type="radio"
                                  name="color"
                                  onClick={() => setPreviewImg(key)}
                                  id={color}
                                  className="sr-only"
                                  onChange={() => setActiveColor(color)}
                                />

                                {/* Circle */}
                                <div
                                  className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center ${
                                    activeColor === color
                                      ? "ring-2 ring-black"
                                      : ""
                                  }`}
                                  style={{
                                    borderColor: isWhite ? "#000" : color,
                                  }}
                                >
                                  <span
                                    className="block w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color }}
                                  ></span>
                                </div>

                                {/* Text */}
                                <span className="text-sm">
                                  {colorName || color}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* <!-- details item --> */}
                      {detailItem?.map((item, key) => (
                        <div className="flex items-center gap-4" key={key}>
                          <div className="min-w-[65px]">
                            <h4 className="font-medium text-dark">
                              {item.label}:
                            </h4>
                          </div>
                          <div className="text-dark">
                            {product1?.[item.key]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4.5">
                      <div className="flex items-center rounded-md border border-gray-3">
                        <button
                          type="button"
                          aria-label="button for remove product"
                          className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            quantity > 1 && setQuantity(quantity - 1);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10.0001C3.33301 9.53984 3.7061 9.16675 4.16634 9.16675H15.833C16.2932 9.16675 16.6663 9.53984 16.6663 10.0001C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10.0001Z"
                              fill=""
                            />
                          </svg>
                        </button>

                        <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setQuantity(quantity + 1);
                          }}
                          aria-label="button for add product"
                          className="flex items-center justify-center w-12 h-12 ease-out duration-200 hover:text-blue"
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.33301 10C3.33301 9.5398 3.7061 9.16671 4.16634 9.16671H15.833C16.2932 9.16671 16.6663 9.5398 16.6663 10C16.6663 10.4603 16.2932 10.8334 15.833 10.8334H4.16634C3.7061 10.8334 3.33301 10.4603 3.33301 10Z"
                              fill=""
                            />
                            <path
                              d="M9.99967 16.6667C9.53944 16.6667 9.16634 16.2936 9.16634 15.8334L9.16634 4.16671C9.16634 3.70647 9.53944 3.33337 9.99967 3.33337C10.4599 3.33337 10.833 3.70647 10.833 4.16671L10.833 15.8334C10.833 16.2936 10.4599 16.6667 9.99967 16.6667Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={handleAddToCart}
                        className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark cursor-pointer border-none"
                      >
                        Add to Cart
                      </button>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setLiked(!liked);
                        }}
                        className="flex items-center justify-center w-12 h-12 rounded-md border border-gray-3 ease-out duration-200 hover:text-white hover:bg-dark hover:border-transparent"
                      >
                        <Heart
                          fill={`${liked ? "red" : "none"}`}
                          stroke={`${liked ? "red" : "currentColor"}`}
                          className={`text-red-500 fill-red-500 ${liked ? "text-red-500 fill-red-500" : "text-gray-400"}`}
                        />
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden bg-gray-2 py-20">
            <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
              {/* <!--== tab header start ==--> */}
              <div className="flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6">
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                      activeTab === item.id
                        ? "text-blue before:w-full"
                        : "text-dark before:w-0"
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              {/* <!--== tab header end ==--> */}

              {/* <!--== tab content start ==--> */}
              {/* <!-- tab content one start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                    activeTab === "tabOne" ? "flex" : "hidden"
                  }`}
                >
                  <div className="max-w-[670px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-7">
                      Specifications:
                    </h2>

                    {/* <!-- description --> */}
                    <p className="mb-6 whitespace-pre-line leading-7">
                      {product1?.description?.replace(/\\n/g, "\n")}
                    </p>
                  </div>

                  <div className="max-w-[447px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-7">
                      Care & Maintenance:
                    </h2>

                    <p className="mb-6">
                      <b>Cleaning & Handling:</b> Use a soft, dry microfiber
                      cloth to clean your devices regularly. Avoid using water,
                      alcohol, or harsh cleaning agents directly on screens or
                      ports. Handle devices gently and avoid dropping or placing
                      heavy objects on them
                    </p>
                    <p className="mb-6">
                      <b>Temperature & Environment:</b> Keep your devices in a
                      cool, dry environment. Avoid exposure to extreme heat,
                      cold, or high humidity, as these conditions can damage
                      internal components and reduce battery life. Do not leave
                      devices in direct sunlight or inside a car for extended
                      periods.
                    </p>
                    <p className="mb-6  ">
                      <b>Software Maintenance:</b> Keep your system and
                      applications up to date to ensure security and optimal
                      performance. Only install software from trusted sources
                      and regularly back up important data.
                    </p>
                    <p>
                      <b>Inspection & Support:</b> Regularly check your devices
                      for any unusual behavior or physical damage. If issues
                      occur, contact GShop support or an authorized service
                      center instead of attempting self-repair.
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- tab content one end --> */}

              {/* <!-- tab content two start --> */}
              <div>
                <div
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${
                    activeTab === "tabTwo" ? "block" : "hidden"
                  }`}
                >
                  {additionalInfo?.map((item, key) => (
                    <div
                      className="rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5"
                      key={key}
                    >
                      <div className="max-w-[450px] min-w-[140px] w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {item.label}
                        </p>
                      </div>
                      <div className="w-full">
                        <p className="text-sm sm:text-base text-dark">
                          {formatValue(item, product1?.[item.key])}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <!-- tab content two end --> */}

              {/* <!-- tab content three start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                    activeTab === "tabThree" ? "flex" : "hidden"
                  }`}
                >
                  <div className="max-w-[570px] w-full">
                    <h2 className="font-medium text-2xl text-dark mb-9">
                      {reviews?.length} Review for this product
                    </h2>

                    <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 hide-scrollbar">
                      {reviews?.map((review, key) => (
                        <div
                          key={key}
                          className="rounded-xl bg-white shadow-1 p-4 sm:p-6"
                        >
                          <div className="flex items-center justify-between">
                            <a href="#" className="flex items-center gap-4">
                              <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
                                <Image
                                  src={
                                    review?.avatar ||
                                    "/images/users/user-01.jpg"
                                  }
                                  alt="author"
                                  className="w-12.5 h-12.5 rounded-full overflow-hidden"
                                  width={50}
                                  height={50}
                                />
                              </div>

                              <div>
                                <h3 className="font-medium text-dark">
                                  {review?.username}
                                </h3>
                                <p className="text-custom-sm">
                                  {review?.createdAt
                                    ? new Date(
                                        review.createdAt,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : ""}
                                </p>
                              </div>
                            </a>

                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, index) => (
                                <span
                                  key={index}
                                  className={`cursor-pointer ${
                                    index < review?.rating
                                      ? "text-[#FBB040]"
                                      : "text-gray-5"
                                  }`}
                                >
                                  <svg
                                    className="fill-current"
                                    width="15"
                                    height="16"
                                    viewBox="0 0 15 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z" />
                                  </svg>
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => handleHelpful(review.id, user.id)}
                              className="flex gap-2 items-center text-sm text-gray-500 hover:text-blue-500 transition"
                            >
                              <ThumbsUp
                                className={getClassColor(review.id)}
                                size={16}
                              />{" "}
                              {review?.helpfulCount || 0}
                            </button>
                          </div>

                          <p className="text-dark mt-6">{review?.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="max-w-[550px] w-full">
                    <form onSubmit={handleSubmitReview}>
                      <h2 className="font-medium text-2xl text-dark mb-3.5">
                        Add a Review
                      </h2>

                      <p className="mb-6">
                        Your email address will not be published. Required
                        fields are marked *
                      </p>

                      <div className="flex items-center gap-3 mb-7.5">
                        <span>Your Rating*</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isActive = (hover || review?.rating) >= star;

                            return (
                              <span
                                key={star}
                                onClick={() => handleRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onChange={() =>
                                  setReview((prev) => ({
                                    ...prev,
                                    rating: star,
                                  }))
                                }
                                className={`cursor-pointer transition duration-200 ${
                                  isActive ? "text-[#FBB040]" : "text-gray-5"
                                } hover:scale-110`}
                              >
                                <svg
                                  className="fill-current"
                                  width="15"
                                  height="16"
                                  viewBox="0 0 15 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z"
                                    fill=""
                                  />
                                </svg>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white shadow-1 p-4 sm:p-6">
                        <div className="mb-5">
                          <label htmlFor="comments" className="block mb-2.5">
                            Comments
                          </label>

                          <textarea
                            name="comment"
                            id="comment"
                            rows={5}
                            value={review.comment}
                            onChange={handleChange}
                            required
                            placeholder="Your comments here"
                            maxLength={250}
                            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                          ></textarea>

                          <span className="flex items-center justify-between mt-2.5">
                            <span className="text-custom-sm text-dark-4">
                              Maximum
                            </span>
                            <span
                              className={`text-sm ${
                                review.comment.length >= 200
                                  ? "text-red-light"
                                  : "text-gray-5"
                              }`}
                            >
                              {review?.comment.length}/250
                            </span>
                          </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 sm:gap-7.5 mb-5.5">
                          <div>
                            <label htmlFor="name" className="block mb-2.5">
                              Name
                            </label>

                            <input
                              type="text"
                              name="username"
                              id="name"
                              value={review.username}
                              onChange={handleChange}
                              required
                              placeholder="Enter your name"
                              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
                        >
                          Submit Reviews
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* <!-- tab content three end --> */}
              {/* <!--== tab content end ==--> */}
            </div>
          </section>

          <RecentlyViewdItems />

          <Newsletter />
        </>
      )}
    </>
  );
};

export default ProductDetail;
