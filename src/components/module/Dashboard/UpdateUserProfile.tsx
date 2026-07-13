"use client";

import Image from "next/image";
import { useState } from "react";

import { uploadImage } from "@/lib/uploadImage"; // <-- change path if needed
import { updateProfile } from "@/services/auth.service";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateProfileModal() {
  const [name, setName] = useState("John Doe");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      let imageUrl = "";

      if (image) {
        const uploadedImage = await uploadImage(image);

        if (!uploadedImage) {
          toast.error("Image upload failed");
          return;
        }

        imageUrl = uploadedImage;
      }

      await updateProfile({
        name,
        image: imageUrl,
      });

      toast.success("Profile updated successfully!");

      // Reset form
      setName("");
      setImage(null);
      setPreview("");

      // Close modal
      setOpen(false);

      // Refresh page
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
        >
          Edit
        </Badge>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {
            image && (
              <div className="flex justify-center">
                <Image
                  src={preview || "https://placehold.co/120x120?text=Profile"}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full border object-cover w-28 h-28"
                />
              </div>
            )
            /* Image Preview */
          }

          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>

            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>Profile Image</Label>

            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Button */}
          <Button className="w-full" disabled={loading} onClick={handleUpdate}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
