import { useDecode, useFetcher } from "@decode/client";
import { useEffect, useState } from "react";
import * as Airtable from "airtable";
import { Volunteer } from "types/Volunteer";
import { ATLAClient } from "types/ALTAClient";

type ATListResponse = { records: Array<Airtable.Record<any>> };
type ATGetResponse = Airtable.Record<any>;

export let useVolunteers = () => {
  return useDecode<ATListResponse, Volunteer[]>(
    [
      "listVolunteers",
      {
        filterByFormula: "{Status} = 'Available'",
        view: "Master Table",
      },
    ],
    (res) => {
      return res.records
        .filter((record) => 
          record.fields["Address"] !== undefined && 
          record.fields["# of Seniors Volunteer Can Support"] - record.fields["Number of Seniors"] > 0
        )
        .map((record) => ({
          name: record.fields["Name"] ? record.fields["Name"] : "missing name",
          address: record.fields["Best Address"]
            ? record.fields["Best Address"]
            : "missing address",
          phone: record.fields["Phone"]
            ? record.fields["Phone"]
            : "missing phone",
          email: record.fields["Email"]
            ? record.fields["Email"]
            : "missing email",
          numberOfSeniors: record.fields["Number of Seniors"],
        }));
    }
  );
};

export let useClients = () => {
  let { data: clientIds, error: clientIdsError } = useClientIds();
  let [clients, setClients] = useState<ATLAClient[]>();
  let [error, setError] = useState();
  let fetcher = useFetcher();

  useEffect(() => {
    if (clientIds) {
      try {
        // Feat request: Decode fan-outs :P
        Promise.all(
          clientIds.map(async (clientId) => {
            let record: ATGetResponse = await fetcher("getClient", {
              id: clientId,
            });
            return transformClientRecord(record);
          })
        ).then((clients) => setClients(clients));
      } catch (e) {
        console.error("Error while fetching client:");
        console.log(e);
        setError(e);
      }
    }
  }, [clientIds]);

  let err = clientIdsError || error;

  return { data: clients, error: err };
};

let useClientIds = () => {
  return useDecode<ATListResponse, string[]>(
    [
      "listJobs",
      {
        filterByFormula: "({Status} = 'Ready for Volunteer')", // This status means the client is ready to be matched
        fields: ["Client"],
        view: "MASTER JOBS VIEW",
      },
    ],
    (res) => {
      return res.records
        .map((record) => record.fields["Client"])
        .filter((id: string | undefined) => id);
    }
  );
};

let transformClientRecord = async (record: any): Promise<ATLAClient> => {
  return {
    name: record.fields["Full Name"]
      ? record.fields["Full Name"]
      : "missing name",
    address: record.fields["Full Address"]
      ? record.fields["Full Address"]
      : "missing address",
    phone: record.fields["Phone"] ? record.fields["Phone"] : "missing phone",
    payment: record.fields["Payment Info"]
      ? record.fields["Payment Info"]
      : "missing payment info",
  };
};
