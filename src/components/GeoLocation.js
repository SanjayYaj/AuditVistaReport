import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {  Container,  Row,  Col, Label, CardTitle} from "reactstrap";

const mapContainerStyle = {
  // width: '400px',
  height: '400px',
  border: '2px solid lightgrey',
  borderRadius: '5px'
};

const center = {
  lat: 0, // Default value, will be replaced with actual latitude
  lng: 0, // Default value, will be replaced with actual longitude
};

const LocationComponent = ({ latitude, longitude }) => {
  const [locationInfo, setLocationInfo] = useState({
    lat: 'undefined',
    long: 'undefined',
    address: 'Getting GPS Data...',
  });

  useEffect(() => {
    const fetchLocationInfo = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBnFPdIGy05y2XSTMt7x-QZgUPciwrOmYI`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          const info = {
            lat: latitude,
            long: longitude,
            address: address,
          };
          setLocationInfo(info);
        } else {
          setLocationInfo({
            lat: 'undefined',
            long: 'undefined',
            address: 'Unable to get address from the response',
          });
        }
      } catch (error) {
        console.warn(error);
        setLocationInfo({
          lat: 'undefined',
          long: 'undefined',
          address: 'Error fetching GPS Data',
        });
      }
    };

    fetchLocationInfo();
  }, [latitude, longitude]);

  // Update center with actual latitude and longitude
  center.lat = parseFloat(latitude);
  center.lng = parseFloat(longitude);

  return (
    <div>

      <Row className='mt-3'>      
        <Col>
          <div>
            <Label>Address:</Label>
            <CardTitle>{locationInfo.address}</CardTitle>
          </div>
          <LoadScript googleMapsApiKey="AIzaSyBnFPdIGy05y2XSTMt7x-QZgUPciwrOmYI">
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={18}>
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </Col>
      </Row>




    </div>
  );
};

export default LocationComponent;