"use client";
import { useLoading } from "@/context/LoadingContext";
import Loader from "./Loader";

// Helper to show loader
const LoaderWrapper = () => {
  const { loading } = useLoading();
  return loading ? <Loader /> : null;
};

export default LoaderWrapper;
