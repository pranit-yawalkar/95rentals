"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Calendar,
  MapPin,
  IndianRupee,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data for rides
const rides = [
  {
    id: "RNT001",
    bike: {
      name: "Honda Activa",
      model: "Activa 6G",
    },
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-17"),
    startTime: "10:00 AM",
    endTime: "10:00 AM",
    location: "Andheri Branch",
    status: "active",
    amount: 897,
    paymentStatus: "paid",
  },
  {
    id: "RNT002",
    bike: {
      name: "Yamaha Fascino",
      model: "Fascino 125",
    },
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-03-12"),
    startTime: "11:00 AM",
    endTime: "11:00 AM",
    location: "Bandra Branch",
    status: "completed",
    amount: 1047,
    paymentStatus: "paid",
  },
  {
    id: "RNT003",
    bike: {
      name: "Suzuki Access",
      model: "Access 125",
    },
    startDate: new Date("2024-02-25"),
    endDate: new Date("2024-02-27"),
    startTime: "09:00 AM",
    endTime: "09:00 AM",
    location: "Andheri Branch",
    status: "cancelled",
    amount: 998,
    paymentStatus: "refunded",
  },
];

export default function RentalsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Filter and sort rides
  const filteredRides = rides
    .filter((ride) => {
      const matchesSearch =
        ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.bike.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || ride.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return b.startDate.getTime() - a.startDate.getTime();
      } else if (sortBy === "amount") {
        return b.amount - a.amount;
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b mt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Rides</h1>
            <p className="text-muted-foreground">
              View and manage your ride history
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="amount">Sort by Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rides List */}
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <Card
                key={ride.id}
                className="hover:bg-accent cursor-pointer transition-colors"
                onClick={() => router.push(`/rides/${ride.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Bike className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{ride.bike.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {ride.bike.model}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(ride.status)}>
                      {ride.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{format(ride.startDate, "MMM d")}</div>
                        <div className="text-muted-foreground">
                          {ride.startTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>{format(ride.endDate, "MMM d")}</div>
                        <div className="text-muted-foreground">
                          {ride.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">{ride.location}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div>₹{ride.amount}</div>
                        <div className="text-muted-foreground capitalize">
                          {ride.paymentStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredRides.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Bike className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rides found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "You haven't taken any rides yet"}
                </p>
                <Button onClick={() => router.push("/")}>
                  Book Your First Ride
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
