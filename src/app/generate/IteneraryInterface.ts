export interface Itinerary {
  itinerary: DayPlan[];
}

interface DayPlan {
  day: string; 
  date: string; 
  activities: Activity[];
  locations: string[];
}

interface Activity {
  time: string; 
  description: string; 
}
