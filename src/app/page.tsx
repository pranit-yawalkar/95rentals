'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bike, MapPin, Phone, Shield, Star, Users, Menu, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value !== '' && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowOTPDialog(true);
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle OTP verification here
    console.log('OTP:', otp.join(''));
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Safe & Insured",
      description: "All vehicles are regularly serviced and fully insured"
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Convenient Pickup",
      description: "Multiple pickup locations across the city"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock roadside assistance"
    }
  ];

  const popularBikes = [
    {
      name: "Honda Activa",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
      price: "299/day",
      specs: "110cc | 60kmpl",
      rating: 4.8
    },
    {
      name: "Yamaha Fascino",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
      price: "349/day",
      specs: "125cc | 55kmpl",
      rating: 4.9
    },
    {
      name: "Suzuki Access 125",
      image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=800",
      price: "399/day",
      specs: "125cc | 52kmpl",
      rating: 4.7
    }
  ];

  const SignInDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome Back!</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your phone number to continue
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handlePhoneSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-12"
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send you a one-time password
            </p>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const OTPDialog = () => (
    <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Verify OTP</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the 4-digit code sent to {phoneNumber}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleOTPSubmit} className="space-y-4 py-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg font-semibold"
                maxLength={1}
                required
              />
            ))}
          </div>
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary/90"
            >
              Resend OTP
            </Button>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Verify & Continue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Bike className="w-8 h-8 text-primary" />
              <span className="ml-2 text-xl font-bold">95BikeRentals</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#fleet" className="text-sm font-medium hover:text-primary transition-colors">Our Fleet</a>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
              <SignInDialog />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#fleet" className="text-sm font-medium hover:text-primary transition-colors">Our Fleet</a>
                <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
                <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
                <SignInDialog />
              </div>
            </div>
          )}
        </div>
      </nav>

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
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Journey Begins <br />With Perfect Ride
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Rent premium scooters and bikes for your daily commute or weekend getaway. Best rates, zero hassle.
              </p>
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Start Riding Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign in with your phone number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <Button className="w-full">Send OTP</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-black">
                  View Fleet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose 95BikeRentals?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience hassle-free bike rentals with our premium service and customer-first approach
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
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
          <h2 className="text-3xl font-bold text-center mb-4">Our Premium Fleet</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Choose from our selection of well-maintained bikes and scooters
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {popularBikes.map((bike, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
                  <p className="text-sm text-muted-foreground mb-4">{bike.specs}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">₹{bike.price}</span>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Bike className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold ml-2">95BikeRentals</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for premium bike and scooter rentals in the city.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#fleet" className="text-gray-400 hover:text-primary transition-colors">Our Fleet</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-primary transition-colors">Features</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-primary mr-2" />
                  <span className="text-gray-400">+91 95000 00000</span>
                </div>
                <p className="text-gray-400">
                  Available 24/7 for your assistance
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            © 2024 95BikeRentals. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* OTP Dialog */}
      <OTPDialog />
    </div>
  );
}