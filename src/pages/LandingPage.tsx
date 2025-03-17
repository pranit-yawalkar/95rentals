"use client";
import React from "react";
import OTPDialog from "@/components/dialogs/OTPDialog";
import SignInDialog from "@/components/dialogs/SignInDialog";
import { Button } from "@/components/ui/button";
import {
  Bike,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
  Menu,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const LandingPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Safe & Insured",
      description: "All vehicles are regularly serviced and fully insured",
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Convenient Pickup",
      description: "Multiple pickup locations across the city",
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock roadside assistance",
    },
  ];

  const popularBikes = [
    {
      name: "Honda Activa",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
      price: "299/day",
      specs: "110cc | 60kmpl",
      rating: 4.8,
    },
    {
      name: "Yamaha Fascino",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
      price: "349/day",
      specs: "125cc | 55kmpl",
      rating: 4.9,
    },
    {
      name: "Suzuki Access 125",
      image:
        "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=800",
      price: "399/day",
      specs: "125cc | 52kmpl",
      rating: 4.7,
    },
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
  ];

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  const handleSearch = () => {
    // Validate form
    if (!city || !startDate || !endDate || !startTime || !endTime) {
      alert("Please fill all the fields");
      return;
    }
  
    // Convert "10:00 AM" to 24-hour format
    const convertTo24HourFormat = (time: string) => {
      const [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/)!.slice(1);
      let hours24 = parseInt(hours, 10);
      if (period === "PM" && hours24 !== 12) hours24 += 12;
      if (period === "AM" && hours24 === 12) hours24 = 0;
      return `${hours24.toString().padStart(2, "0")}:${minutes}`;
    };
  
    const startTime24 = convertTo24HourFormat(startTime);
    const endTime24 = convertTo24HourFormat(endTime);
  
    // Merge date and time
    const startDateTime = new Date(`${startDate.toISOString().split("T")[0]}T${startTime24}:00Z`);
    const endDateTime = new Date(`${endDate.toISOString().split("T")[0]}T${endTime24}:00Z`);
  
    // Create query params
    const params = new URLSearchParams();
    params.append("city", city);
    params.append("startDate", startDate.toISOString());
    params.append("endDate", endDate.toISOString());
    params.append("startTime", startDateTime.toISOString()); // ✅ Corrected
    params.append("endTime", endDateTime.toISOString()); // ✅ Corrected
  
    // Navigate to search results page
    router.push(`/search?${params.toString()}`);
  };
  

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = () => {};

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&q=80&w=2000"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 h-full pt-24 relative z-10">
          <div className="h-[calc(100vh-6rem)] flex items-center">
            <div className="w-full max-w-4xl mx-auto">
              <div className="max-w-2xl text-white mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  Your Journey Begins <br />
                  With Perfect Ride
                </h1>
                <p className="text-xl mb-8 text-gray-200">
                  Rent premium scooters and bikes for your daily commute or
                  weekend getaway. Best rates, zero hassle.
                </p>
              </div>

              {/* Search Form */}
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? (
                            format(endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < (startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Time
                    </label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Return Time
                    </label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                  size="lg"
                  onClick={handleSearch}
                >
                  Search Available Bikes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose 95BikeRentals?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience hassle-free bike rentals with our premium service and
            customer-first approach
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Bikes Section */}
      <section id="fleet" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our Premium Fleet
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our selection of well-maintained bikes and scooters
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {popularBikes.map((bike, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{bike.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{bike.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {bike.specs}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      ₹{bike.price}
                    </span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
