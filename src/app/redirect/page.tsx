import { getUserIdFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RedirectPage () {
    const userId = await getUserIdFromCookies();
    if (!userId) {
        redirect("/login");
    };
    const profile = await prisma.profile.findUnique({where: {userId},});
    if (!profile) {
        redirect("/onboarding")
    } 
    redirect("/dashboard")
}