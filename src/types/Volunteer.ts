export type Volunteer = {
  name: string;
  address: string;
  phone: string;
  email: string;
  numberOfSeniors: number;
}; 

export type TravelInfo = {
  minutes: number;
  miles: number;
};

export type VolunteerWithTravelInfo = Volunteer & TravelInfo;