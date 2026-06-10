import { NextRequest, NextResponse } from "next/server";

// The live RSO archive viewer is a static page in public/rso/live/.
// Next doesn't resolve directory indexes in public/, and config rewrites
// don't reliably reach public files under the i18n router, so map the
// bare path here. The matcher keeps this off every other request.
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/rso/live/index.html";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/rso/live",
};
