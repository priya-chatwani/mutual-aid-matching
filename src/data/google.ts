import { ATLAClient } from "types/ALTAClient";
import { DistanceMatrix } from "types/DistanceMatrix";
import { Volunteer, VolunteerWithTravelInfo } from "types/Volunteer";

export function getDistanceMatrix(clientList: Array<ATLAClient>, volunteerList: Array<Volunteer>) {
  return new Promise<DistanceMatrix>((resolve, reject) => {
    const output: DistanceMatrix = {};

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: clientList.map((client) => client.address),
      destinations: volunteerList.map((volunteer) => volunteer.address),
      travelMode: google.maps.TravelMode.DRIVING,      
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, (response: google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus) => {
      if (status === google.maps.DistanceMatrixStatus.OK) {
        let origins = response.originAddresses;
    
        for (let i = 0; i < origins.length; i++) {
          let results = response.rows[i].elements;
          const client = clientList[i];
          const volunteersForClient: Array<VolunteerWithTravelInfo> = [];

          for (let j = 0; j < results.length; j++) {
            const volunteer = volunteerList[j];
            volunteersForClient.push({
              ...volunteer,
              minutes: Math.round(results[j].duration.value / 60),
              miles: Math.round(results[j].distance.value / 1609),
            })
          }

          volunteersForClient.sort((v1, v2) => v1.minutes - v2.minutes);
          output[client.name] = volunteersForClient.slice(0, 4);
        }
        resolve(output);
      } else {
        reject(new Error(status));
      }
    });
  });
}