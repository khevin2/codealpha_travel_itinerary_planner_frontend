import { Itinerary } from "@/app/generate/IteneraryInterface";


export default function IteneraryView({itinerary}: {itinerary: Itinerary | null}) { 
    return ( 
        itinerary === null ? <p>No itinerary generated</p> :
      <div>
        {itinerary?.itinerary?.map((dayPlan) => (
          <div key={dayPlan.day}>
            <h2>{dayPlan.day}</h2>
            <h3>{dayPlan.date}</h3>
            <ul>
              {dayPlan.activities.map((activity) => (
                <li key={activity.time}>
                  <strong>{activity.time}:</strong> {activity.description}
                </li>
              ))}
            </ul>
            <p>Locations: {dayPlan.locations.join(", ")}</p>
          </div>
        ))}
      </div>
    );
}