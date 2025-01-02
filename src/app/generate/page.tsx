"use client";


import Header from "@/components/Header";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useRouter } from "next/navigation";
import { generate, registerUser } from "@/lib/api";

const formSchema = z.object({
  destinations: z.string().min(2, {
    message:
      "Username must be at least 3 characters.",
  }),
    startDate: z.string().date("Invalid date"),
  endDate: z.string().date("Invalid date"),
  preference: z.string().min(3, {
    message: "Invalid preference.",
  }),
});

export default function Generate() {
     const [loading, setLoading] = React.useState(false);
   
    const [session, setSession] = useState<Session | null>(null);
    console.log(session);
    useEffect(() => { 
        const fetchSession = async () => {
            const session = await getSession();
            setSession(session);
        }
        fetchSession();
    }, [])
    
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          destinations: "",
          startDate: "",
          
            endDate: "",
          preference:""
        },
      });

     const router = useRouter();
    
      const { toast } = useToast();
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const res = await generate(values);
          if (!res.ok) {
            console.log(res.json());
          toast({
            variant: "destructive",
            description: "Failed to generate itinerary.",
          });
        }
        router.push("/login");
        setLoading(false);
      }


  return (
    <div className="">
      <Header />
      <div className="flex flex-col justify-center items-center mt-6">
        <p className="text-2xl">Welcome to travel Itinerary planner.</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <div className="flex flex-col justify-center items-center mt-6">
            <Label>Register</Label>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="destinations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your destinations separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter start date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The date you want to start your trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter end date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The date you want to end your trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preference</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your preference"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your preference for the trip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  Generate Itinerary
                  {loading && <Loader2 className="animate-spin" />}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
