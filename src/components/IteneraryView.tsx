import { Itinerary } from "@/app/generate/IteneraryInterface";
import { Badge } from "./ui/badge";


export default function IteneraryView({itinerary}: {itinerary: Itinerary | null}) { 
  return itinerary === null ? (
    <p>No itinerary generated</p>
  ) : (
    <div className="space-y-4 mt-8">
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
  );
}