import axios from "axios";
import { baseUrl } from "@/app/api/status/route";

export const fetchUserData = async (user_id, token) => {
    console.log('Fetching user');
    const headersList = {
      "Authorization": `Bearer ${token}`,
    };
    
    const response = await fetch(`${baseUrl}/user/${user_id}`, { 
      method: "GET",
      headers: headersList
    });
    
    const data = await response.json();
    return data;
  };
  

  export const uploadActivityData = async (data: any, token: string | null, id: string | null) => {
    try {
      const response = await fetch(`${baseUrl}/activity/new`, { 
        method: "POST",
        body: data,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (error) {
      console.error("Error uploading activity data:", error);
      throw error;
    }
  };

  export const fetchActivityData = async (token) => {
    console.log('Fetching user');
    const headersList = {
      "Authorization": `Bearer ${token}`,
    };
    
    const response = await fetch(`${baseUrl}/activity/all`, { 
      method: "GET",
      headers: headersList
    });
    
    const data = await response.json();
    return data;
  };