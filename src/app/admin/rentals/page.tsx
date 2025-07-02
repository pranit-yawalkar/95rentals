"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  User,
  Bike,
  Clock,
  IndianRupee,
  Eye,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { getRentals } from "@/store/reducers/adminSlice";
import { useLoading } from "@/context/LoadingContext";

// Mock data for rentals
const rentals = [
  {
    id: "RNT001",
    user: {
      name: "John Doe",
      phone: "+91 98765 43210",
    },
    bike: {
      name: "Honda Activa",
      model: "Activa 6G",
    },
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-17"),
    location: "Andheri Branch",
    status: "active",
    amount: 897,
    paymentStatus: "paid",
  },
  {
    id: "RNT002",
    user: {
      name: "Jane Smith",
      phone: "+91 98765 43211",
    },
    bike: {
      name: "Yamaha Fascino",
      model: "Fascino 125",
    },
    startDate: new Date("2024-03-14"),
    endDate: new Date("2024-03-16"),
    location: "Bandra Branch",
    status: "completed",
    amount: 1047,
    paymentStatus: "paid",
  },
  // Add more mock data as needed
];

export default function RentalsPage() {
  const dispatch = useDispatch<any>();
  const {setLoading} = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [rentals, setRentals] = useState<any>([]);
  const filteredRentals = rentals?.filter((rental: any) => {
    const matchesSearch =
      rental?.user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      rental?.bike?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || rental?.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    console.log("useEffect");
    getAllRentals();
  }, []);

  const getAllRentals = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getRentals());
      if (response?.error?.message) {
        return;
      }
      setRentals(response?.payload?.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rentals</h2>
        <p className="text-muted-foreground">
          Monitor and manage all bike rentals
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rentals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Rental ID</TableHead> */}
              <TableHead>Customer</TableHead>
              <TableHead>Bike</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals?.length ? (
              filteredRentals.map((rental: any) => (
                <TableRow key={rental.rentalId}>
                  {/* <TableCell className="font-medium">{rental.id}</TableCell> */}
                  <TableCell>
                    <div>
                      <div className="font-medium">{rental.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {rental.user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{rental.bike.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {rental.bike.model}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {format(rental.startTime, "MMM d, yyyy hh:mm a")}
                      </div>
                      <div className="text-muted-foreground">
                        to {format(rental.endTime, "MMM d, yyyy hh:mm a")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{rental.bike.location}</TableCell>
                  <TableCell>
                    <div className="font-medium">₹{rental.totalAmount}</div>
                    <div className="text-sm text-muted-foreground">
                      {rental.paymentStatus}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(rental.status)}>
                      {rental.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRental(rental);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No rentals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Rental Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rental Details</DialogTitle>
          </DialogHeader>
          {selectedRental && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <Badge
                  variant={getStatusColor(selectedRental.status)}
                  className="text-base px-4 py-1"
                >
                  {selectedRental.status}
                </Badge>
                <div className="text-2xl font-bold">
                  ₹{selectedRental.totalAmount}
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-7">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {selectedRental.user.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">
                      {selectedRental.user.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bike Details */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Bike Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-7">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">
                      {selectedRental.bike.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="font-medium">
                      {selectedRental.bike.model}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rental Information
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-7">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Start Date
                    </div>
                    <div className="font-medium">
                      {format(selectedRental.startTime, "MMM d, yyyy hh:mm a")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      End Date
                    </div>
                    <div className="font-medium">
                      {format(selectedRental.endTime, "MMM d, yyyy hh:mm a")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Location
                    </div>
                    <div className="font-medium">{selectedRental.bike.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Payment Status
                    </div>
                    <div className="font-medium capitalize">
                      {selectedRental.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedRental.status === "active" && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // Handle cancellation
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Rental
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      // Handle completion
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
