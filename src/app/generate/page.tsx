"use client";

import Header from "@/components/Header";
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

import { generate } from "@/lib/api";
import IteneraryView from "@/components/IteneraryView";

import { Itinerary } from "@/app/generate/IteneraryInterface";
import { Session } from "next-auth";

const formSchema = z.object({
  destinations: z.string().min(2, {
    message: "Destinations cannot be empty.",
  }),
  startDate: z.string().date("Invalid date"),
  endDate: z.string().date("Invalid date"),
  preference: z.string().min(3, {
    message: "Invalid preference.",
  }),
});

type CustomSession = {
  user: {
    email: string;
    username: string;
    token: string;
  };
  expires: string;
};

export default function Generate() {
  const [loading, setLoading] = React.useState(false);

  const [session, setSession] = useState<CustomSession | null>(null);
  console.log("Session: ", session);
  useEffect(() => {
    const fetchSession = async () => {
      const session = (await getSession()) as Session as CustomSession;
      setSession(session);
    };
    fetchSession();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destinations: "",
      startDate: "",

      endDate: "",
      preference: "",
    },
  });
  console.log("token: ", session?.user?.token);

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await generate({
        ...values,
        token: session?.user?.token as string,
      });
      console.log("Res: ", res);
      if (res.message == "Success") {
        const resJSON = JSON.parse(res?.itenerary);
console.log("ResJSON: ", resJSON);
        const content = resJSON?.choices[0]?.message?.content;
        console.log("Content: ", content);
        const cleaned = content.replace(/```json\n|```/g, "").trim();
        console.log("Cleaned: ", cleaned);
        setItinerary(JSON.parse(cleaned));
        console.log("Itinerary: ", itinerary);
      }
      else throw new Error("Failed to generate itinerary.");

      console.log("Data: ", JSON.parse(res?.itenerary));
    } catch (error) {
      console.log("Error: ", error);
      toast({
        variant: "destructive",
        description: "Failed to generate itinerary..",
      });
    }
    setLoading(false);
    console.log("Itinerary: ", itinerary);
    console.log("Stopped loading");
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col justify-center items-center mt-6">
        <p className="text-2xl">Welcome to travel Itinerary planner.</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <div className="flex flex-col justify-center items-center mt-6">
            <Label>Fill</Label>
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
                      <FormLabel>Destinations</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your destinations"
                          {...field}
                        />
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
                          placeholder="Enter your preferences"
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
        <IteneraryView itinerary={itinerary} />
      </div>
    </div>
  );
}
