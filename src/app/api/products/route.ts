import { NextResponse } from "next/server";
import {
  generateProducts,
  APPLICATION_VERSION,
  APPLICATION_COMMIT,
} from "@/lib/demo-data";

export async function GET() {
  return NextResponse.json({
    products: generateProducts(),
    meta: {
      applicationVersion: APPLICATION_VERSION,
      applicationCommit: APPLICATION_COMMIT,
      timestamp: Date.now(),
    },
  });
}