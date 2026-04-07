import { NextRequest } from "next/server";

// Example of default export
export default function proxy(request: NextRequest) {
  // Proxy logic
  console.log("Proxy request ->", request);
}
