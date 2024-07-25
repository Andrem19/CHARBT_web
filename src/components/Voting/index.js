import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Image, ProgressBar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getBlog, voteOnPoll } from '../../api/data';
import { useNavigate } from "react-router-dom";
import { updateBlogLastVisit } from '../../redux/userActions';

function VotingBlogPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useSelector(state => state.data.theme);
    const user = useSelector((state) => state.user.user);
    const [blogPosts, setBlogPosts] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const type = user ? 'api' : 'pub';
            const blog = await getBlog(navigate, type);
            setBlogPosts(blog);
        }
        getData();
        if (user) {
            dispatch(updateBlogLastVisit())
        }
    }, []);

    const handleVote = async (postId, optionId) => {
        if (user) {
            const updatedBlog = await voteOnPoll(navigate, postId, optionId);
            setBlogPosts(updatedBlog);
        }
    }

    return (
        <Container fluid style={{ backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)', color: theme === 'dark' ? 'white' : 'black', paddingTop: '1rem' }}>
            <Row className="justify-content-md-center">
                <Col xs={12} md={8}>
                    {blogPosts && blogPosts.map((post, index) => {
                        const pollDisabled = post.poll && (post.poll.disabled || new Date(post.poll.to_date) < new Date());
                        return (
                            <Card key={index} className="mb-4" bg={theme} text={theme === 'dark' ? 'white' : 'dark'}>
                                <Card.Header as="h5">{post.title}</Card.Header>
                                <Card.Body>
                                    {post.img_url && <Image src={post.img_url} fluid />}
                                    <Card.Text>{post.content}</Card.Text>
                                    {post.poll && (
                                        <>
                                            <hr />
                                            <h6>{post.poll.question}</h6>
                                            <p>Poll ends on: {new Date(post.poll.to_date).toLocaleDateString()}</p>
                                            <ListGroup variant="flush">
                                                {post.poll.options.map((option, index) => {
                                                    const totalVotes = post.poll.options.reduce((total, opt) => total + opt.votes, 0);
                                                    const votePercentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                                                    return (
                                                        <ListGroup.Item key={index} action variant={theme} onClick={!pollDisabled && user ? () => handleVote(post.id, option.id) : null}>
                                                            {option.name} {pollDisabled || post.isVoted ? `(${option.votes} votes, ${votePercentage}%)` : ''}
                                                            {pollDisabled || post.isVoted ? <ProgressBar now={votePercentage} label={`${votePercentage}%`} /> : ''}
                                                        </ListGroup.Item>
                                                    );
                                                })}
                                            </ListGroup>
                                        </>
                                    )}
                                </Card.Body>
                                <Card.Footer className="text-muted">Posted by {post.user_id} on {new Date(post.timestamp).toLocaleDateString()}</Card.Footer>
                            </Card>
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}

export default VotingBlogPage;
