import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/KolPage.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolPage = () => {
  const [kols, setKols] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`${BACKEND_HOST}/api/kols?populate[0]=KolImage`);
    axios
      .get(`${BACKEND_HOST}/api/kols?populate[0]=KolImage`)
      .then(response => {
        if (response.data && response.data.data) {
          setKols(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className='kol-container'>
      <Row>
        {kols.map(kol => (
          <Col
            key={kol.id}
            md={3}
            className='mb-4'
          >
            <Link to={`/kol/${kol.id}`} className="card-link-KolPage">
              <Card className='kol-card'>
                {kol.attributes.KolImage && kol.attributes.KolImage.data ? (<Card.Img src={`${BACKEND_HOST}${kol.attributes.KolImage.data.attributes.url}`} alt={kol.attributes.Name} />) : 
                  (<Card.Img variant='top' src='https://placehold.co/250x350' fluid alt='Placeholder'/>)}
                  <Card.Body>
                    <Card.Title 
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '18px'
                            }}
                        title={kol.attributes.Name}>
                        {kol.attributes.Name}
                    </Card.Title>
                    <Card.Text style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '14px'
                            }}
                        title={kol.attributes.Title}>
                        {kol.attributes.Title}
                    </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KolPage;
