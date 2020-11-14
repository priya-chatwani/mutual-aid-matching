import { ErrorCard, useFetcher } from "@decode/client";
import React, { ReactElement, useState } from "react";

interface Props {}

export default function SendSms({}: Props): ReactElement {
  let [processing, setProcessing] = useState(false);
  let [error, setError] = useState();
  let fetcher = useFetcher();

  let handleSMSSend = async () => {
    setProcessing(true);

    try {
      await fetcher("sendSMS", {
        Body: "TODO",
        From: "+13233100411",
        To: "TODO",
      });
    } catch (e) {
      console.error("Error sending SMS");
      console.error(e);
      setError(e);
    }

    setProcessing(false);
  };

  if (error) {
    <ErrorCard error={error} />;
  }

  return <div>{/* TODO: Render  */}</div>;
}
