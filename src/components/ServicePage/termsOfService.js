import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getText } from '../../api/data';
import { Container, Card } from 'react-bootstrap';

function TermsOfService() {
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);

  const theme = useSelector((state) => state.data.theme);

  useEffect(() => {
    const get_data = async (name_id) => {
      const data = await getText(name_id);
      setContent(data.text);
      setTitle(data.name);
      setDate(data.date);
    }
    get_data('terms_of_service')
  }, []);

  return (
    <Container style={{ padding: '1rem', backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black' }}>
      <Card style={{ padding: '2rem' }}>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Last updated: {date}</Card.Subtitle>
        <Card.Text>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{content}</pre>
        </Card.Text>
      </Card>
    </Container>
  );
}

export default TermsOfService;
