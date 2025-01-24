import { Itinerary } from "@/app/generate/IteneraryInterface";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { saveItinerary } from "@/lib/api";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { CustomSession } from "@/app/generate/CustomSession";
import { toast } from "@/hooks/use-toast";

export default function IteneraryView({
  itinerary,
}: {
  itinerary: Itinerary | null;
}) {
  const [session, setSession] = useState<CustomSession | null>(null);
  console.log("Session: ", session);
  useEffect(() => {
    const fetchSession = async () => {
      const session = (await getSession()) as Session as CustomSession;
      setSession(session);
    };
    fetchSession();
  }, []);

  const handleSaveItenerary = async () => {
    if (itinerary === null) return;
    const token = session?.user?.token || "";
    const res = await saveItinerary({ itinerary, token });

    if (res?.message == "Success") {
      // clear form
      // TODO: clear form
      // show success toast
      toast({
        title: "Itinerary saved",
        description: "Itinerary has been saved successfully",
      });
    }
  };
  return itinerary === null ? (
    <p className="space-y-4 my-8">No itinerary generated</p>
  ) : (
    <div className="space-y-4 my-8">
      <div className="space-y-4">
        {itinerary?.itinerary?.map((dayPlan) => (
          <div key={dayPlan.day}>
            <div className="flex col space-x-2">
              <Badge className="px-4 py-2">{dayPlan.day}</Badge>
              <Badge className="px-3 py-1" variant="secondary">
                {dayPlan.date}
              </Badge>
            </div>

            <ul className="list-disc list-inside space-y-2 my-2">
              {dayPlan.activities.map((activity) => (
                <li key={activity.time}>
                  <strong>{activity.time}:</strong> {activity.description}
                </li>
              ))}
            </ul>
            {dayPlan.locations.map((location) => (
              <span key={location} className="mr-1">
                <Badge>{location}</Badge>
              </span>
            ))}
          </div>
        ))}
      </div>
      <Button onClick={handleSaveItenerary}>Save Itenerary</Button>
    </div>
  );
}
