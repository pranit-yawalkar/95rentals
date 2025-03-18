"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Bike,
  Phone,
  Star,
  ChevronDown,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableBikes } from "@/services/bikeService";
import { fetchAvailableBikes } from "@/store/reducers/bikeSlice";

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
  },
  {
    id: 4,
    name: "TVS Jupiter",
    model: "Jupiter Classic",
    image:
      "https://images.unsplash.com/photo-1571325654970-60aa4a2d689c?auto=format&fit=crop&q=80&w=800",
    price: 329,
    specs: "110cc | 58kmpl",
    rating: 4.6,
    available: true,
  },
  {
    id: 5,
    name: "Hero Pleasure",
    model: "Pleasure Plus",
    image:
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800",
    price: 279,
    specs: "110cc | 63kmpl",
    rating: 4.5,
    available: true,
  },
  {
    id: 6,
    name: "Royal Enfield Classic",
    model: "Classic 350",
    image:
      "https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&q=80&w=800",
    price: 799,
    specs: "350cc | 35kmpl",
    rating: 4.9,
    available: true,
  },
  {
    id: 7,
    name: "Bajaj Pulsar",
    model: "Pulsar 150",
    image:
      "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=800",
    price: 499,
    specs: "150cc | 45kmpl",
    rating: 4.7,
    available: true,
  },
  {
    id: 8,
    name: "KTM Duke",
    model: "Duke 200",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800",
    price: 899,
    specs: "200cc | 35kmpl",
    rating: 4.8,
    available: true,
  },
];

// Available models for filtering
const bikeModels = [
  "Activa 6G",
  "Fascino 125",
  "Access 125",
  "Jupiter Classic",
  "Pleasure Plus",
  "Classic 350",
  "Pulsar 150",
  "Duke 200",
];

// Time slots
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

// Cities
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

const BikeSearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BikeSearchContent />
    </Suspense>
  )
}

const BikeSearchContent = () => {
  const dispatch = useDispatch<any>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const availableBikes = useSelector((state: any) => state.bike.availableBikes);
  console.log(availableBikes, "availableBikes");
  // Search parameters
  const [params, setParams] = useState({
    city: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "",
    endTime: "",
  });

  // Filter state
  const [priceRange, setPriceRange] = useState([200, 1000]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("recommended");
  const [filteredBikes, setFilteredBikes] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  console.log(filteredBikes, "filteredBikes");
  // Initialize search parameters from URL
  useEffect(() => {
    if (searchParams) {
      const cityParam = searchParams.get("city");
      const startDateParam = searchParams.get("startDate");
      const endDateParam = searchParams.get("endDate");
      const startTimeParam = searchParams.get("startTime");
      const endTimeParam = searchParams.get("endTime");

      if (
        cityParam &&
        startDateParam &&
        endDateParam &&
        startTimeParam &&
        endTimeParam
      ) {
        // Convert params to Date objects
        const startDateTime = new Date(startTimeParam);
        const endDateTime = new Date(endTimeParam);

        setParams({
          city: cityParam,
          startDate: startDateTime,
          endDate: endDateTime,
          startTime: startDateTime.toISOString(), // ✅ Already in ISO format
          endTime: endDateTime.toISOString(), // ✅ Already in ISO format
        });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (params.startTime && params.endTime) {
      dispatch(
        fetchAvailableBikes({
          startTime: params.startTime,
          endTime: params.endTime,
        })
      );
    }
  }, [params]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...availableBikes];

    // Filter by price
    result = result.filter(
      (bike) => bike.dailyRate >= priceRange[0] && bike.dailyRate <= priceRange[1]
    );

    // Filter by model
    if (selectedModels.length > 0) {
      result = result.filter((bike) => selectedModels.includes(bike.model));
    }

    // Apply sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    setFilteredBikes(result);
  }, [priceRange, selectedModels, sortOption, availableBikes]);

  // Handle model selection
  const handleModelChange = (model: string, checked: boolean) => {
    if (checked) {
      setSelectedModels((prev) => [...prev, model]);
    } else {
      setSelectedModels((prev) => prev.filter((m) => m !== model));
    }
  };

  // Update search parameters
  const updateSearch = () => {
    console.log(params, "params");
    if (
      !params.city ||
      !params.startDate ||
      !params.endDate ||
      !params.startTime ||
      !params.endTime
    ) {
      alert("Please fill all the search fields");
      return;
    }
    const updatedParams = new URLSearchParams();
    updatedParams.append("city", params.city);
    updatedParams.append("startDate", params.startDate.toISOString());
    updatedParams.append("endDate", params.endDate.toISOString());
    updatedParams.append("startTime", params.startTime);
    updatedParams.append("endTime", params.endTime);
    console.log(updatedParams.toString(), "updatedParams");
    router.push(`/search?${updatedParams.toString()}`);
  };

  const handleBookNow = (bike: any) => {
    const urlParams = new URLSearchParams(window.location.search);
    router.push(`/bikes/${bike.bikeId}?${urlParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b mt-20">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Select
                value={params.city}
                onValueChange={(city) => setParams({ ...params, city })}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {params.startDate ? (
                      format(params.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={params.startDate}
                    onSelect={(date) =>
                      setParams({ ...params, startDate: date! })
                    }
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {params.endDate ? (
                      format(params.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={params.endDate}
                    onSelect={(date) =>
                      setParams({ ...params, endDate: date! })
                    }
                    initialFocus
                    disabled={(date) => date < (params.startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Time</Label>
              <div className="flex space-x-2">
                <Select
                  value={params.startTime}
                  onValueChange={(value) =>
                    setParams({ ...params, startTime: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pickup" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`pickup-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={params.endTime}
                  onValueChange={(value) =>
                    setParams({ ...params, endTime: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Return" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`return-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={updateSearch}
              >
                Update Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div
            className={`md:w-1/4 ${isFilterOpen ? "block" : "hidden md:block"}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>

              {/* Price Range Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">
                  Price Range (₹/day)
                </h3>
                <Slider
                  defaultValue={[200, 1000]}
                  min={200}
                  max={1000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Bike Model Filter */}
              <div>
                <h3 className="text-sm font-medium mb-4">Bike Models</h3>
                <div className="space-y-3">
                  {bikeModels.map((model) => (
                    <div key={model} className="flex items-center">
                      <Checkbox
                        id={`model-${model}`}
                        checked={selectedModels.includes(model)}
                        onCheckedChange={(checked: any) =>
                          handleModelChange(model, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`model-${model}`}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {model}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bike Listings */}
          <div className="md:w-3/4">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">
                {filteredBikes.length} Bikes Available
              </h1>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bike Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBikes.map((bike) => (
                <Card
                  key={bike.bikeId}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={bike.imageUrl}
                      alt={bike.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{bike.rating}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{bike.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {bike.model}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        Available
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-2">
                      {bike.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ₹{bike.dailyRate}/day
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleBookNow(bike)}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredBikes.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Bike className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No bikes found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([200, 1000]);
                    setSelectedModels([]);
                    setSortOption("recommended");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeSearchPage;
