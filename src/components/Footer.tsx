"use client";

import { Bike, Phone } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Bike className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold ml-2">95BikeRentals</span>
            </div>
            <p className="text-gray-400">
              Your trusted bike and scooter rentals in the city. Book your perfect
              ride now!
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#fleet"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Our Fleet
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-2" />
                <span className="text-gray-400">+91 78419 42095</span>
              </div>
              <p className="text-gray-400">
                Available 24/7 for your assistance
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          © {new Date().getFullYear()} 95BikeRentals. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
