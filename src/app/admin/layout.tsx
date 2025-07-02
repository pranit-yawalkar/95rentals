"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bike,
  Calendar,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminLogout } from "@/services/adminService";
import { toast } from "sonner";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Bikes", href: "/admin/bikes", icon: Bike },
  { name: "Rentals", href: "/admin/rentals", icon: Calendar },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await adminLogout();
      if (res.status !== 200) {
        throw new Error("Logout failed");
      }
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    setIsMounted(true);
    // Add your authentication check here
    // const isAuthenticated = localStorage.getItem("adminToken");
    // if (!isAuthenticated && pathname !== "/admin/login") {
    //   router.push("/admin/login");
    // }
  }, [pathname, router]);

  if (!isMounted) {
    return null;
  }

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return children;
  }

  const NavContent = () => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => router.push(item.href)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.name}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 sm:gap-8">
        <Sheet>
          <SheetTitle className="hidden"></SheetTitle>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-4">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">95BikeRentals Admin</h1>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col gap-4 border-r h-screen p-4 bg-white">
            <div className="flex items-center gap-2 px-2">
              <Bike className="h-6 w-6" />
              <span className="text-lg font-semibold">95BikeRentals</span>
            </div>
            <div className="flex-1">
              <NavContent />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="hidden lg:flex h-16 items-center gap-4 border-b bg-background px-6">
            <div className="flex-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.jpg" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:flex lg:items-center gap-2">
                    <span className="text-sm font-medium">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
