import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/trpc/spotify.getData",
    "/api/trpc/spotify.getDownloadUrl",
  ],
  secretKey: "sk_test_oy7FBLkWXp9XSWN2t1LJmujSojiGHC4zkQg5YgtHfL",
  publishableKey:
    "pk_test_cmVsZXZhbnQtb2FyZmlzaC0xNi5jbGVyay5hY2NvdW50cy5kZXYk",
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
