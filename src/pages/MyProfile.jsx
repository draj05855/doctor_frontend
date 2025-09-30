import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, backendUrl, token, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [localUserData, setLocalUserData] = useState(null);

  useEffect(() => {
    if (userData) setLocalUserData(userData);
  }, [userData]);

  if (!localUserData) {
    return userData &&(
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading profile...
      </div>
    );
  }

  const profileImageSrc =
    localUserData?.image &&
    typeof localUserData.image === "string" &&
    localUserData.image.length > 0
      ? localUserData.image
      : "/default-avatar.png";

  const safeText = (text) =>
    text && text !== "Not Selected" ? text : "Not Provided";

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", localUserData.name);
      formData.append("phone", localUserData.phone || "");
      formData.append("address", JSON.stringify(localUserData.address));
      formData.append("dob", localUserData.dob);
      formData.append("gender", localUserData.gender);

      // ✅ Pass token in Authorization header
      const response = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        loadUserProfileData();
        setIsEdit(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address_")) {
      const addressKey = name.split("_")[1];
      setLocalUserData({
        ...localUserData,
        address: { ...localUserData.address, [addressKey]: value },
      });
    } else {
      setLocalUserData({ ...localUserData, [name]: value });
    }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img
        className="w-36 rounded"
        src={profileImageSrc}
        alt="profile"
        onError={(e) => (e.target.src = "/default-avatar.png")}
      />

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          name="name"
          value={localUserData?.name || ""}
          onChange={handleChange}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {safeText(localUserData?.name)}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{safeText(localUserData?.email)}</p>

          <p className="font-medium">Phone</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              name="phone"
              value={localUserData?.phone || ""}
              onChange={handleChange}
            />
          ) : (
            <p className="text-blue-400">{safeText(localUserData?.phone)}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-50"
                type="text"
                name="address_line1"
                value={localUserData?.address?.line1 || ""}
                onChange={handleChange}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                name="address_line2"
                value={localUserData?.address?.line2 || ""}
                onChange={handleChange}
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {safeText(localUserData?.address?.line1)}
              <br />
              {safeText(localUserData?.address?.line2)}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              name="gender"
              value={localUserData?.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{safeText(localUserData?.gender)}</p>
          )}

          <p className="font-medium">Birthday :</p>
          {isEdit ? (
            <input
              className="max-28 bg-gray-100"
              type="date"
              name="dob"
              value={localUserData?.dob || ""}
              onChange={handleChange}
            />
          ) : (
            <p className="text-gray-400">{safeText(localUserData?.dob)}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            className="border bg-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={handleSave}
          >
            Save information
          </button>
        ) : (
          <button
            className="border bg-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;

