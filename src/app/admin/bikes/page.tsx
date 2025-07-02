"use client";

import { useEffect, useState } from "react";
import { Bike, Plus, Pencil, Trash2, Search } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bike as BikeModel } from "@prisma/client";
import {
  createBike,
  fetchAllBikes,
  removeBike,
  updateBike,
} from "@/store/reducers/adminSlice";
import { useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";

export default function BikesPage() {
  const dispatch = useDispatch<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const { setLoading } = useLoading();
  const [selectedBike, setSelectedBike] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [bikeData, setBikeData] = useState<BikeModel>({
    bikeId: "",
    name: "",
    type: "",
    model: null,
    specs: null,
    description: null,
    imageUrl: null,
    hourlyRate: 0,
    dailyRate: 0,
    features: [],
    location: "",
    isAvailable: true,
    createdAt: new Date(),
  });

  const [bikeImage, setBikeImage] = useState<File | null>(null);

  const filteredBikes = bikes.filter(
    (bike) =>
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bike.model &&
        bike.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    fetchBikes();
  }, []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bikeImage) {
      const objectUrl = URL.createObjectURL(bikeImage);
      setPreviewUrl(objectUrl);

      // Clean up the object URL on unmount or when file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [bikeImage]);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const response = await dispatch(fetchAllBikes());
      setBikes(response.payload);
    } catch (error) {
      console.error("Error fetching bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBike = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", bikeData.name);
      formData.append("type", bikeData.type);
      formData.append("model", String(bikeData.model));
      formData.append("specs", String(bikeData.specs));
      formData.append("description", String(bikeData.description));
      formData.append("hourlyRate", String(bikeData.hourlyRate));
      formData.append("dailyRate", String(bikeData.dailyRate));
      formData.append("features", String(bikeData.features));
      formData.append("location", String(bikeData.location));

      if (bikeImage) {
        formData.append("image", bikeImage);
      }

      const response = await dispatch(createBike(formData));
      if (response?.error?.message) {
        toast.error(response?.error?.message || "Error adding bike");
        return;
      }

      toast.success("Bike added successfully!");
      fetchBikes();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error adding bike:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBike = async (bikeData: any) => {
    setSelectedBike(bikeData);
    setIsEditDialogOpen(true);

    // Handle features - convert array to string or keep as string
    let featuresString = "";
    if (Array.isArray(bikeData.features)) {
      featuresString = bikeData.features.join(",");
    } else if (typeof bikeData.features === "string") {
      featuresString = bikeData.features;
    }

    setBikeData(bikeData);
  };

  const handleUpdateBike = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", bikeData.name);
      formData.append("type", bikeData.type);
      formData.append("model", String(bikeData.model));
      formData.append("specs", String(bikeData.specs));
      formData.append("description", String(bikeData.description));
      formData.append("hourlyRate", String(bikeData.hourlyRate));
      formData.append("dailyRate", String(bikeData.dailyRate));
      formData.append("features", String(bikeData.features));
      formData.append("location", String(bikeData.location));
      formData.append("isAvailable", String(bikeData.isAvailable));
      if (bikeImage) {
        formData.append("image", bikeImage);
      }
      const response = await dispatch(
        updateBike({ bikeId: bikeData.bikeId, bikeData: formData })
      );
      if (response?.error?.message) {
        toast.error(response?.payload?.message || "Error updating bike");
        return;
      }
      toast.success("Bike updated successfully!");
      fetchBikes();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating bike:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBike = async () => {
    try {
      setLoading(true);
      const response = await dispatch(removeBike(selectedBike.bikeId));
      if (response?.error?.message) {
        toast.error(response?.error?.message || "Error deleting bike");
        return;
      }
      toast.success("Bike deleted successfully!");
      fetchBikes();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting bike:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bikes</h2>
          <p className="text-muted-foreground">
            Manage your bike fleet and inventory
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Bike
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Bike</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bike Name</Label>
                <Input
                  id="name"
                  placeholder="Enter bike name"
                  required
                  onChange={(e) =>
                    setBikeData({ ...bikeData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                {/* create shadcn dropdown for type e.g. scooter, bike */}
                <Label htmlFor="type">Type</Label>
                <Select
                  onValueChange={(value) =>
                    setBikeData({ ...bikeData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="Enter model name"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, model: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Input
                  id="specs"
                  placeholder="Enter specifications"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, specs: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Short description"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="Enter hourly price"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      hourlyRate: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Price (₹)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  placeholder="Enter daily rental price"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      dailyRate: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  placeholder="e.g., Helmet, Fuel Included"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      features: e.target.value.split(","),
                    })
                  }
                />
              </div>
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Bike Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setBikeImage(file);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter location"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, location: e.target.value })
                  }
                />
              </div>
              <Button className="w-full" onClick={handleAddBike}>
                Add Bike
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bikes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Specifications</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBikes.map((bike) => (
              <TableRow key={bike.bikeId}>
                <TableCell>
                  <Image
                    src={bike.imageUrl || ""}
                    alt={bike.name}
                    className="h-12 w-20 object-cover rounded-md"
                    width={20}
                    height={12}
                  />
                </TableCell>
                <TableCell className="font-medium">{bike.name}</TableCell>
                <TableCell>{bike.model}</TableCell>
                <TableCell>{bike.specs}</TableCell>
                <TableCell>₹{bike.dailyRate}</TableCell>
                <TableCell>
                  <Badge variant={bike.isAvailable ? "default" : "destructive"}>
                    {bike.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell>{bike.location}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditBike(bike)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedBike(bike);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Bike</DialogTitle>
          </DialogHeader>
          {selectedBike && (
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Bike Name</Label>
                <Input
                  id="edit-name"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, name: e.target.value })
                  }
                  value={bikeData.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  placeholder="e.g., Scooter, Motorcycle"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, type: e.target.value })
                  }
                  value={bikeData.type}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input
                  id="edit-model"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, model: e.target.value })
                  }
                  value={bikeData.model || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specs">Specifications</Label>
                <Input
                  id="edit-specs"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, specs: e.target.value })
                  }
                  value={bikeData.specs || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Short description"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, description: e.target.value })
                  }
                  value={bikeData.description || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="Enter hourly price"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      hourlyRate: Number(e.target.value),
                    })
                  }
                  value={bikeData.hourlyRate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Daily Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      dailyRate: Number(e.target.value),
                    })
                  }
                  value={bikeData.dailyRate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  placeholder="e.g., Helmet, Fuel Included"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      features: e.target.value.split(","),
                    })
                  }
                  value={bikeData.features}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  onChange={(e) =>
                    setBikeData({ ...bikeData, location: e.target.value })
                  }
                  value={bikeData.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  onChange={(e) =>
                    setBikeData({
                      ...bikeData,
                      isAvailable: e.target.value === "available",
                    })
                  }
                  value={bikeData.isAvailable ? "available" : "unavailable"}
                  className="w-full border rounded-md p-2"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              {/* if imageUrl is present, then show the image */}
              {/* Also update the input field and show the image preview if user uploads the image */}
              {/* Create a nice UI for the same */}
              <div className="space-y-2">
                <Label htmlFor="image">Bike Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setBikeImage(file);
                    }
                  }}
                />
                {/* Show preview if user selects a new image */}
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Preview:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-24 w-40 object-cover rounded-md border"
                    />
                  </div>
                )}
                {/* If no new file selected but imageUrl exists */}
                {!previewUrl && bikeData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Current Image:
                    </p>
                    <img
                      src={bikeData.imageUrl}
                      alt={bikeData.name}
                      className="h-24 w-40 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              <Button className="w-full" onClick={handleUpdateBike}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bike</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete this bike? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteBike}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
