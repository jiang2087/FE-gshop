"use client";

import { useState, useEffect } from "react";
import { getProductTypeCount } from "@/api/productApi";
import { useSearchParams } from "next/navigation";

const CategoryItem = ({ name, count, onToggle, selected }) => {
  return (
    <button
      className={`${
        selected && "text-blue"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue `}
      onClick={() => onToggle(name)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            selected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={selected ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span>{name}</span>
      </div>

      <span
        className={`${
          selected ? "text-white bg-blue" : "bg-gray-2"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {count}
      </span>
    </button>
  );
};

const CategoryDropdown = ({ categories, onSendData }) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [categoryCount, setCategoryCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const category = searchParams.get("type");

  useEffect(() => {
    if (category) {
      setSelectedTypes([category.toUpperCase()]);
    }
  }, [category]);

  const handleToggle = (value) => {
    const val = value.toUpperCase();
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val],
    );
  };

  useEffect(() => {
    onSendData(selectedTypes);
  }, [selectedTypes]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await getProductTypeCount(categories);
        if (isMounted) {
          setCategoryCount(data);
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
  }, [categories]);

  const names = Object.keys(categoryCount);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Category</p>
        <button
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
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
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.16101 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {categories.map((category, key) => (
          <CategoryItem
            selected={
              names[key]
                ? selectedTypes.includes(names[key].toUpperCase())
                : false
            }
            onToggle={handleToggle}
            key={key}
            name={names[key]}
            count={categoryCount[names[key]] || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDropdown;
