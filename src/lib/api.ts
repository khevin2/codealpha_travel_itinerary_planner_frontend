import { Itinerary } from "@/app/generate/IteneraryInterface";
type User = {
    username: string;
    email: string;
    password: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function loginUser({ email, password }: { email: string, password: string }) {
    return await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

}

export async function registerUser(user: User) {
    const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("An error occurred while registering");
    }

    return response.json();
}

export async function generate({ destinations, startDate, endDate, preference,token }: { destinations: string, startDate: string, endDate: string, preference: string,token:string }) { 
    const res =  await fetch(`${API_URL}/itineraries/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ destinations, startDate, endDate, preference }),
    });
    if(!res.ok){
      throw new Error("An error occurred while generating itinerary");
    }
    else return await res.json();
}

export async function saveItinerary({ itinerary, token }: { itinerary: Itinerary, token: string }) {
    const response = await fetch(`${API_URL}/itineraries/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itinerary),
    });

    if (!response.ok) {
        throw new Error("An error occurred while saving itinerary");
    }

    return response.json();
}