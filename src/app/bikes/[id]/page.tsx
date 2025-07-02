"use client";

import { useEffect, useState } from "react";
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
  Upload,
  User,
  KeyRound,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Footer from '@/components/layout/Footer';
import SignInDialog from "@/components/dialogs/SignInDialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import OTPDialog from "@/components/dialogs/OTPDialog";
import { login } from "@/store/reducers/authSlice";
import ProfileDialog from "@/components/dialogs/ProfileDialog";
import { getUserData, uploadUserDocs } from "@/store/reducers/userSlice";
import { fetchAvailableBikes } from "@/store/reducers/bikeSlice";
import Script from "next/script";
import {
  createOrderRequest,
  verifyPaymentRequest,
} from "@/store/reducers/paymentSlice";
import { bookRentalRequest } from "@/store/reducers/rentalSlice";
import {
  loginUser,
  registerUser,
  verifyOtpOnLogin,
  verifyOtpOnRegister,
} from "@/services/authService";

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

const steps = [
  {
    id: "profile",
    title: "Basic Details",
    icon: User,
  },
  {
    id: "verification",
    title: "Phone Verification",
    icon: KeyRound,
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
  },
];

export default function Page() {
  const dispatch = useDispatch<any>();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFetched, setIsFetched] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isProfileDialog, setIsProfileDialog] = useState(false);
  const [isSignInDialog, setIsSignInDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [resetCount, setResetCount] = useState(60);
  const [session, setSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  // Profile form state
  const [currentStep, setCurrentStep] = useState(0);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
    otp: ["", "", "", "", "", ""],
    licenseDocument: null as File | null,
    idProof: null as File | null,
  });
  const availableBikes = useSelector((state: any) => state.bike.availableBikes);
  const token = localStorage.getItem("authToken");
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [token]);

  // Get bike details from ID
  const bike = params
    ? availableBikes.find((b: any) => b.bikeId === params.id)
    : null;
  // Get booking details from URL params
  const city = searchParams?.get("city");
  const startDate = searchParams?.get("startTime")
    ? new Date(searchParams.get("startTime")!)
    : null;
  const endDate = searchParams?.get("endTime")
    ? new Date(searchParams.get("endTime")!)
    : null;
  const startTime = searchParams?.get("startTime");
  const endTime = searchParams?.get("endTime");

  // Calculate rental duration and total cost
  const rentalDays =
    startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;
  const subtotal = bike ? bike.dailyRate * rentalDays : 0;
  // const gst = subtotal * 0.18; // 18% GST
  const total = subtotal;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resetCount > 0) {
      timer = setTimeout(() => {
        setResetCount(resetCount - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resetCount]);

  useEffect(() => {
    if (startTime && endTime && !isFetched) {
      // Convert IST to UTC
      const startUTC = new Date(startTime).toISOString();
      const endUTC = new Date(endTime).toISOString();

      dispatch(
        fetchAvailableBikes({
          startTime: startUTC,
          endTime: endUTC,
        })
      ).then(() => {
        setIsFetched(true);
      });
    }
  }, [startTime, endTime, isFetched]);

  const resetState = () => {
    setCurrentStep(0);
    setProfileForm({
      name: "",
      email: "",
      gender: "",
      address: "",
      phone: "",
      otp: ["", "", "", "", "", ""],
      licenseDocument: null,
      idProof: null,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

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

    if (Object.keys(user).length === 0) {
      setIsProfileDialog(true);
      return;
    }

    initiatePayment();

    // initiatePayment();
  };

  const userSignIn = async (e?: React.FormEvent) => {
    try {
      e?.preventDefault();
      const res = await loginUser(phoneNumber);
      if (res?.status === 200) {
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP sent successfully!");
        setShowOTPDialog(true);
        setResetCount(60);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const userRegister = async () => {
    try {
      const res = await registerUser(profileForm);
      if (res?.status === 200) {
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP sent successfully!");
        // setShowOTPDialog(true);
        setResetCount(60);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const verifyLoginOtp = async (e?: React.FormEvent) => {
    try {
      e?.preventDefault();
      const res = await verifyOtpOnLogin(phoneNumber, otp.join(""));
      if (res.data.token) {
        setSession(res.data.token);
        localStorage.setItem("authToken", res.data.token);
        login(res.data.token);
        await dispatch(getUserData());
        setOtp(["", "", "", "", "", ""]);
        setPhoneNumber("");
        setShowOTPDialog(false);
        setIsSignInDialog(false);
        toast.success("OTP verified successfully!");
      } else {
        alert("Invalid OTP");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const verifyRegisterOtp = async () => {
    try {
      const res = await verifyOtpOnRegister(
        profileForm.phone,
        profileForm.otp.join("")
      );
      if (res.data.token) {
        setSession(res.data.token);
        localStorage.setItem("authToken", res.data.token);
        login(res.data.token);
        await dispatch(getUserData());
        setProfileForm((prev) => ({ ...prev, otp: ["", "", "", "", "", ""] }));
        setCurrentStep((prev) => prev + 1);
        toast.success("OTP verified successfully!");
      } else {
        alert("Invalid OTP");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const uploadDocs = async () => {
    try {
      const formData = new FormData();
      formData.append("license", profileForm.licenseDocument!);
      formData.append("idProof", profileForm.idProof!);
      const res = await dispatch(uploadUserDocs(formData));
      if (res?.payload?.error) {
        toast.error(res?.payload?.error);
        return;
      }
      toast.success("Documents uploaded successfully!");
      setIsProfileDialog(false);
      resetState();
    } catch (error) {
      console.log(error);
      toast.error("Error uploading documents");
    }
  };

  const handleResendOtp = () => {
    setResetCount(60);
    userSignIn();
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 0) {
      if (
        !profileForm.name ||
        !profileForm.email ||
        !profileForm.gender ||
        !profileForm.phone ||
        !profileForm.address
      ) {
        alert("Please fill all the required fields");
        return;
      }

      userRegister();
    } else if (currentStep === 1) {
      if (!profileForm.phone || !profileForm.otp) {
        alert("Please complete phone verification");
        return;
      }

      verifyRegisterOtp();
    } else if (currentStep === 2) {
      if (!profileForm.licenseDocument || !profileForm.idProof) {
        alert("Please upload all required documents");
        return;
      }
      uploadDocs();
    }
  };

  const initiatePayment = async () => {
    try {
      if (!params || !startTime || !endTime) {
        return;
      }
      const rentalRes = await dispatch(
        bookRentalRequest({
          bikeId: params.id as string,
          startTime,
          endTime,
          totalAmount: Math.round(total),
        })
      );
      console.log(rentalRes, "rentalRes");
      if (rentalRes?.error?.message) {
        toast.error("Error booking rental");
        return;
      }
      const orderRes = await dispatch(
        createOrderRequest({
          rentalId: rentalRes?.payload?.rental?.rentalId as string,
          amount: rentalRes?.payload?.rental?.totalAmount as number,
        })
      );
      console.log(orderRes, "orderRes");
      if (orderRes?.error?.message) {
        toast.error("Error creating order");
        return;
      }
      // const data = res?.payload;
      const options = {
        key: process.env.NEXT_PUBLIC_RZP_KEY,
        amount: orderRes?.payload?.order?.amount,
        currency: "INR",
        name: "95BikeRentals",
        description: "Bike Rental Payment",
        order_id: orderRes?.payload?.order?.id as string,
        handler: async function (response: any) {
          console.log(response, "response");
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;
          const res = await dispatch(
            verifyPaymentRequest({
              paymentId,
              orderId,
              signature,
            })
          );
          if (res?.error?.message) {
            toast.error("Error verifying payment");
            return;
          }

          toast.success("Thanks for booking with 95BikeRentals!");
          router.push("/rentals");
        },
        prefill: {
          name: user ? user?.name : "Guest",
          email: user ? user?.email : "",
          contact: user ? user?.phone : "",
        },
      };
      console.log(options, "options");
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 mt-12"
          onClick={() => router.back()}
        >
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
                        {/* <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="font-medium">{bike.rating}</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" /> */}
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

                  <TabsContent value="locations">
                    <div className="space-y-4">
                      {/* location */}
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-primary mr-2" />
                        <span>{bike.location}</span>
                      </div>
                    </div>
                  </TabsContent>
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
                  {/* <li className="flex items-start">
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
                  </li> */}
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
                            at{" "}
                            {startTime
                              ? new Date(startTime).toTimeString()
                              : "Not selected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Trip End</p>
                          <p className="text-muted-foreground">
                            {endDate ? format(endDate, "PPP") : "Not selected"}{" "}
                            at{" "}
                            {endTime
                              ? new Date(endTime).toTimeString()
                              : "Not selected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-1" />
                        <div>
                          <p className="font-medium">Pickup Location</p>
                          <p className="text-muted-foreground">
                            {bike.location}
                          </p>
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
                      {/* <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div> */}
                      <Separator className="my-4" />
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                      {/* <div className="flex justify-between text-muted-foreground">
                        <span>Security Deposit</span>
                        <span>₹{bike.securityDeposit}</span>
                      </div> */}
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
        handleRegister={() => {
          setIsSignInDialog(false);
          setIsProfileDialog(true);
          setCurrentStep(0);
          setProfileForm((prev) => ({
            ...prev,
            otp: ["", "", "", "", "", ""],
          }));
        }}
      />

      {/* OTP Dialog */}
      <OTPDialog
        showOTPDialog={showOTPDialog}
        setShowOTPDialog={setShowOTPDialog}
        handleOTPSubmit={verifyLoginOtp}
        phoneNumber={phoneNumber}
        otp={otp}
        onResend={handleResendOtp}
        handleOtpChange={handleOtpChange}
        resendCount={resetCount}
      />

      <ProfileDialog
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isProfileDialog={isProfileDialog}
        setIsProfileDialog={setIsProfileDialog}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        handleNextStep={handleNextStep}
        handleResendOtp={handleResendOtp}
        errorText={errorText}
        otpCounter={resetCount}
        handleLogin={() => {
          setIsProfileDialog(false);
          setIsSignInDialog(true);
          setCurrentStep(0);
          setProfileForm((prev) => ({
            ...prev,
            otp: ["", "", "", "", "", ""],
          }));
        }}
      />

      {/* <Footer /> */}
    </div>
  );
}
