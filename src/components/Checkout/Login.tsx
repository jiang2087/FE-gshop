import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login } from "@/redux/slices/authSlice";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      await dispatch(login({ username, password })).unwrap();
      toast.success("Login successful", { id: toastId });
      setDropdown(false);
      router.push("/checkout");
    } catch {
      toast.error("incorrect password or username", { id: toastId });
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white shadow-1 rounded-[10px]">
        <div
          onClick={() => setDropdown(!dropdown)}
          className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 ${
            dropdown && "border-b border-gray-3"
          }`}
        >
          Returning customer?
          <span className="flex items-center gap-2.5 pl-1 font-medium text-dark">
            Click here to login
            <svg
              className={`${
                dropdown && "rotate-180"
              } fill-current ease-out duration-200`}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
                fill=""
              />
            </svg>
          </span>
        </div>

        {dropdown && (
          <form
            onSubmit={handleSubmit}
            className="pt-7.5 pb-8.5 px-4 sm:px-8.5"
          >
            <p className="text-custom-sm mb-6">
              If you haven&apos;t logged in yet, please log in first.
            </p>

            <div className="mb-5">
              <label htmlFor="username" className="block mb-2.5">
                Username<span className="text-red">*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2.5">
                Password <span className="text-red">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Login;
