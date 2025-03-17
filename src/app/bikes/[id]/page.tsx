"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { format, differenceInDays, set } from "date-fns";
import {
  Bike,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Shield,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Footer from '@/components/layout/Footer';
import SignInDialog from "@/components/dialogs/SignInDialog";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Mock data for bikes
const allBikes = [
  {
    id: 1,
    name: "Honda Activa",
    model: "Activa 6G",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
    price: 299,
    specs: "110cc | 60kmpl",
    rating: 4.8,
    available: true,
    description:
      "The Honda Activa 6G is a reliable and fuel-efficient scooter perfect for city commuting. With its comfortable seating and smooth ride, it's ideal for daily use.",
    features: [
      "110cc BS6 Engine",
      "60 kmpl Mileage",
      "Telescopic Front Suspension",
      "LED Headlamp",
      "Mobile Charging Socket",
      "5.3L Fuel Tank Capacity",
    ],
    securityDeposit: 1000,
    locations: [
      {
        name: "Andheri Branch",
        address: "Shop No. 12, Andheri West, Mumbai - 400053",
        phone: "+91 95000 00001",
      },
      {
        name: "Bandra Branch",
        address: "Plot 7, Linking Road, Bandra West, Mumbai - 400050",
        phone: "+91 95000 00002",
      },
    ],
  },
  {
    id: 2,
    name: "Yamaha Fascino",
    model: "Fascino 125",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
    price: 349,
    specs: "125cc | 55kmpl",
    rating: 4.9,
    available: true,
    description:
      "The Yamaha Fascino 125 combines style with performance. Its sleek design and powerful engine make it a popular choice among young riders looking for both aesthetics and functionality.",
    features: [
      "125cc BS6 Engine",
      "55 kmpl Mileage",
      "Disc Brake Option",
      "LED Position Light",
      "Side Stand Engine Cut-off",
      "5.2L Fuel Tank Capacity",
    ],
    securityDeposit: 1200,
    locations: [
      {
        name: "Andheri Branch",
        address: "Shop No. 12, Andheri West, Mumbai - 400053",
        phone: "+91 95000 00001",
      },
      {
        name: "Bandra Branch",
        address: "Plot 7, Linking Road, Bandra West, Mumbai - 400050",
        phone: "+91 95000 00002",
      },
    ],
  },
  {
    id: 3,
    name: "Suzuki Access 125",
    model: "Access 125",
    image:
      "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=800",
    price: 399,
    specs: "125cc | 52kmpl",
    rating: 4.7,
    available: true,
    description:
      "The Suzuki Access 125 is known for its powerful performance and premium features. It offers excellent acceleration and comfort, making it perfect for both city rides and longer journeys.",
    features: [
      "125cc BS6 Engine",
      "52 kmpl Mileage",
      "Front Disc Brake",
      "LED Headlamp & Position Lamp",
      "Digital Meter with Eco Assist",
      "5.8L Fuel Tank Capacity",
    ],
    securityDeposit: 1500,
    locations: [
      {
        name: "Andheri Branch",
        address: "Shop No. 12, Andheri West, Mumbai - 400053",
        phone: "+91 95000 00001",
      },
      {
        name: "Bandra Branch",
        address: "Plot 7, Linking Road, Bandra West, Mumbai - 400050",
        phone: "+91 95000 00002",
      },
    ],
  },
];

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [isSignInDialog, setIsSignInDialog] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetCount, setResetCount] = useState(60);
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const availableBikes = useSelector((state: any) => state.bike.availableBikes);

  // Get bike details from ID
  const bike = params ? availableBikes.find((b: any) => b.bikeId === params.id) : null;
  console.log(bike, "bike");
  // Get booking details from URL params
  const city = searchParams?.get("city");
  const startDate = searchParams?.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : null;
  const endDate = searchParams?.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : null;
  const startTime = searchParams?.get("startTime");
  const endTime = searchParams?.get("endTime");

  // Calculate rental duration and total cost
  const rentalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const subtotal = bike ? bike.dailyRate * rentalDays : 0;
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bike Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The bike you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    if (!isTermsAccepted) {
      alert("Please accept the terms and conditions to proceed");
      return;
    }

    // For demo purposes, we'll just show the login dialog
    setIsSignInDialog(true);
  };

  const userSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/login", {
      phoneNumber: `+91${phoneNumber}`,
    });
    console.log(res, "res lgoin");
    if (res?.status === 200) {
      setIsSignInDialog(false);
      setShowOTPDialog(true);
      setResetCount(60);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/api/auth/verify-otp", {
      phoneNumber: `+91${phoneNumber}`,
      otp: otp.join(""),
    });
    if (res.data.token) {
      setSession(res.data.token);
      localStorage.setItem("authToken", res.data.token);
      setShowOTPDialog(false);
      setOtp(["", "", "", "", "", ""]);
      toast.success("Logged In Successfully!");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 mt-12" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Bike Details */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{bike.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="font-medium">{bike.rating}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="text-muted-foreground">
                          {bike.specs}
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        {bike.description}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="features">
                    <ul className="grid grid-cols-2 gap-4">
                      {bike.features.map((feature: any, index: number) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  {/* <TabsContent value="locations">
                    <div className="space-y-4">
                      {bike.locations.map((location, index) => (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium mb-2">
                                  {location.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4 inline mr-1" />
                                  {location.address}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <Phone className="w-4 h-4 inline mr-1" />
                                  {location.phone}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => setSelectedLocation(index)}
                              >
                                Select
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent> */}
                </Tabs>
              </CardContent>
            </Card>

            {/* Pickup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Pickup Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                    <span>
                      Bring your valid driving license and an additional
                      government ID proof
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                    <span>
                      Security deposit of ₹{bike.securityDeposit} will be
                      collected at the time of pickup
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                    <span>
                      Full tank fuel will be provided, return with full tank
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2 mt-0.5" />
                    <span>Wear helmet at all times while riding</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Trip Details */}
                  <div>
                    <h3 className="font-medium mb-4">Trip Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Trip Start</p>
                          <p className="text-muted-foreground">
                            {startDate
                              ? format(startDate, "PPP")
                              : "Not selected"}{" "}
                            at {startTime ? new Date(startTime).toTimeString() : "Not selected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Trip End</p>
                          <p className="text-muted-foreground">
                            {endDate ? format(endDate, "PPP") : "Not selected"}{" "}
                            at {endTime ? new Date(endTime).toTimeString() : "Not selected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Pickup Location</p>
                          {/* <p className="text-muted-foreground">
                            {bike.locations[selectedLocation].name}
                          </p> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div>
                    <h3 className="font-medium mb-4">Price Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Rental Charges ({rentalDays} days × ₹{bike.dailyRate})
                        </span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Security Deposit</span>
                        <span>₹{bike.securityDeposit}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={isTermsAccepted}
                        onCheckedChange={(checked) =>
                          setIsTermsAccepted(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground leading-tight"
                      >
                        I agree to the terms and conditions, including the
                        rental agreement and cancellation policy
                      </label>
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleProceedToPayment}
                    >
                      Proceed to Payment
                    </Button>

                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Your payment is secure and encrypted.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Login Dialog */}
          <SignInDialog
            isSignInDialog={isSignInDialog}
            setIsSignInDialog={setIsSignInDialog}
            handlePhoneSubmit={userSignIn}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            showButton={false}
          />


      {/* <Footer /> */}
    </div>
  );
}
