import { ATLAClient } from "./ALTAClient";
import { VolunteerWithTravelInfo } from "./Volunteer";

export type DistanceMatrix = Record<ATLAClient['name'], Array<VolunteerWithTravelInfo>>