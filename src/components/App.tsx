import React, { useEffect, useState } from 'react';
import ClientInfo from 'components/ClientInfo';
import { ATLAClient } from 'types/ALTAClient';
import logo from 'images/logo.png';
import { getDistanceMatrix } from 'data/google';
import { DistanceMatrix } from 'types/DistanceMatrix';
import { Accordion, Spinner, Container } from 'react-bootstrap';
import "./App.css";
import { useClients, useVolunteers } from 'data/hooks';
import { ErrorCard } from '@decode/client';

function App() {
  const { data: clientList, error: err1 } = useClients()
  const { data: volunteerList, error: err2 } = useVolunteers()
  const [distanceMatrix, setDistanceMatrix] = useState<DistanceMatrix | undefined>(undefined);
  
  useEffect(() => {
    if (clientList && volunteerList) getDistanceMatrix(clientList, volunteerList).then(setDistanceMatrix);
  }, [clientList, volunteerList]);

  let error = err1 || err2;

  return (
    <Container className="App-container">
      <header className="App-header">
        <img src={logo} alt="AllTogetherLA logo" className='App-logo'/>
        <p>ATLA Matching Portal</p>
      </header>
      {error && <ErrorCard error={error} /> }
      {clientList && volunteerList && distanceMatrix ? (
        <Accordion data-accordion>
          {clientList.map((client: ATLAClient) =>
            <ClientInfo key={client.name} client={client} closestVolunteers={distanceMatrix[client.name]}/>
          )}
        </Accordion>
      ) : (
        <Spinner className="App-loading" animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
    </Container>
  );
}

export default App;