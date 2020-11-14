import React, { useState } from 'react';
import { Accordion, Button, Card, ListGroup, Modal } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ATLAClient } from "types/ALTAClient";
import { VolunteerWithTravelInfo } from "types/Volunteer";

// function buildEmailUrl(client: ATLAClient, volunteer: VolunteerWithTravelInfo) {
//     const subject = "AllTogether LA - we need your help";
//     const body = `Hi ${volunteer.name.split(' ')[0]}! %0D%0AThis is [insert your name] from AllTogether LA.
//     We’ve matched you with a senior, ${client.name}, who lives ${volunteer.minutes.toFixed(2)} minutes from you and needs your help.
//     Contact info is below.%0D%0APlease review the information packet we previously emailed, then call your senior to discuss your delivery plan.%0D%0A
//     Leave a message if they don’t answer, they are expecting to hear from you.%0D%0A%0D%0A
//     Information about your senior:%0D%0A
//     Name: ${client.name}%0D%0A
//     Address: ${client.address}%0D%0A
//     Phone Number: ${client.phone}%0D%0A
//     Payment: ${client.payment}%0D%0A%0D%0A
//     Please respond to this message as soon as you have reached out to your senior.%0D%0A
//     Let us know if you have any questions, and thank you for all your help!`
//     return `mailto:${volunteer.email}?subject=${subject}&body=${body}`;
// }

function emailBodyText(client: ATLAClient, volunteer: VolunteerWithTravelInfo) {
    // const subject = "AllTogether LA - we need your help";
    return `EMAIL TEXT FOR ${volunteer.email}


    Hi ${volunteer.name.split(' ')[0]}! 
    
    This is [insert your name] from AllTogether LA.
    We’ve matched you with a senior, ${client.name}, who lives ${volunteer.minutes.toFixed(0)} minutes from you and needs your help.
    Contact info is below. Please review the information packet we previously emailed, then call your senior to discuss your delivery plan. 
    Leave a message if they don’t answer, they are expecting to hear from you.  
    
    Information about your senior: 

    Name: ${client.name} 
    Address: ${client.address} 
    Phone Number: ${client.phone} 
    Payment: ${client.payment}  

    Please respond to this message as soon as you have reached out to your senior. 
    Let us know if you have any questions, and thank you for all your help!`;
}

type Props = {
    client: ATLAClient;
    closestVolunteers: Array<VolunteerWithTravelInfo>;
}

export default function ClientInfo({client, closestVolunteers}: Props) {
    const [copied, setCopied] = useState(false);

    // Tried looking into this to highlight the client that is clicked: https://react-bootstrap.netlify.app/components/accordion/#custom-toggle-with-expansion-awareness
	return (
        <Card>
            <Accordion.Toggle as={Card.Header} variant="button" eventKey={client.name} style={{cursor: 'pointer'}}>
                <b>{client.name}</b> needs a match. Click for closest volunteers.
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={client.name}>
                <Card.Body className="mb-2 text" >
                    <ListGroup style={{cursor: 'pointer'}}>
                        {closestVolunteers.map((volunteer) =>
                            <CopyToClipboard key={volunteer.name} text={emailBodyText(client, volunteer)}>
                                <ListGroup.Item onClick={() => setCopied(true)} key={volunteer.name}>
                                    {volunteer.name} - {volunteer.minutes} minutes away. Click to copy email text.
                                </ListGroup.Item>
                            </CopyToClipboard>
                        )}
                    </ListGroup>
                </Card.Body>
            </Accordion.Collapse>
            <Modal show={copied} onHide={() => setCopied(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Email text copied!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setCopied(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
	);
}
