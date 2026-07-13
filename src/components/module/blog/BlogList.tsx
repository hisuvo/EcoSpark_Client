"use client";

import { useBlogs } from "@/hooks/useBlog";

export default function BlogList() {
  const { data: blogs, isLoading, error } = useBlogs();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error loading blogs</p>;

  return (
    <div>
      {blogs?.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>

          <p>{blog.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
