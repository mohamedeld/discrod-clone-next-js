export default function middleware(request: Request) {}

export  const config = {
  matcher: ["/servers/:path*", "/profile/:path*", "/setup", "/"],
};