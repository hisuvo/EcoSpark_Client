import axios from "axios";

/**
 * Uploads an image to ImgBB and returns the direct image URL.
 * Supports File, Blob, or base64 data.
 * Includes validation for image type and size (max 32MB).
 *
 * @param image - The image file, blob, or base64 string to upload
 * @returns Promise<string | null> - The direct URL of the uploaded image or null if upload fails
 */
export const uploadImage = async (
  image: File | Blob | string,
): Promise<string | null> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    console.error("ImgBB API key is missing in environment variables.");
    return null;
  }

  // --- Validation ---
  const MAX_SIZE_MB = 32;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  if (image instanceof File || image instanceof Blob) {
    // 1. Check File/Blob Size
    if (image.size > MAX_SIZE_BYTES) {
      console.error(`Image size exceeds the ${MAX_SIZE_MB}MB limit.`);
      return null;
    }

    // 2. Check File/Blob Type (must be an image)
    if (!image.type.startsWith("image/")) {
      console.error("Invalid file type. Only image files are allowed.");
      return null;
    }
  } else if (typeof image === "string") {
    // 3. Base64 Size Check (approximate)
    // Base64 is roughly 33% larger than binary data.
    const isBase64 = image.startsWith("data:");
    if (isBase64) {
      const base64Length = image.split(",")[1]?.length || image.length;
      const sizeInBytes = (base64Length * 3) / 4;
      if (sizeInBytes > MAX_SIZE_BYTES) {
        console.error(`Base64 image size exceeds the ${MAX_SIZE_MB}MB limit.`);
        return null;
      }
    }
  }

  // --- Upload ---
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data && response.data.success) {
      return response.data.data.url;
    } else {
      console.error("ImgBB upload failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    return null;
  }
};
