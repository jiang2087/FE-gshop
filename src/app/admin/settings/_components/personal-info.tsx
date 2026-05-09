"use client";

import {
  EmailIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { updateUserInfo } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function PersonalInfoForm() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    imageUrl: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        imageUrl: user.imageUrl || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formattedRole =
    user?.roles?.map((role) =>
      role
        .replace("ROLE_", "")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase())
    ).join(", ") || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username) {
      toast.error("Username is required");
      return;
    }

    try {
      if (user?.id) {
        await dispatch(updateUserInfo({
          id: user.id,
          username: formData.username,
          email: formData.email,
          imageUrl: formData.imageUrl,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })).unwrap();
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: ""
        }));
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    }
  };


  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form onSubmit={handleSubmit}>
        <InputGroup
          className="mb-5.5"
          type="text"
          name="username"
          label="Username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          icon={<UserIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={<EmailIcon />}
          iconPosition="left"
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="password"
          name="currentPassword"
          label="Current Password"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={handleChange}
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="password"
          name="newPassword"
          label="New Password"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          height="sm"
        />

        <InputGroup
          className="mb-5.5"
          type="text"
          name="roles"
          label="Roles"
          defaultValue={formattedRole}
          placeholder="User roles"
          disabled
          height="sm"
        />

        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}


