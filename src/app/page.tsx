"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex flex-col justify-center items-center mt-6">
        <p className="text-2xl">Welcome to travel Itinerary planner.</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
