import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Box, Typography, Rating, TextField, Button, Stack, Avatar, Divider } from '@mui/material';

import { getProductReviews, createReview, resetReviews } from '../../redux/review/reviewSlice';
import RatingSummary from './RatingSummary';
import Reveal from '../../motion/Reveal';
import { colors } from '../../theme/theme';

const ReviewForm = ({ productId }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.reviews);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating) {
            toast.error('Pick a star rating first');
            return;
        }

        if (!comment.trim()) {
            toast.error('Say a little about your experience');
            return;
        }

        try {
            await dispatch(createReview({ productId, rating, comment: comment.trim() })).unwrap();
            toast.success('Thanks for your review!');
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error || 'Could not post your review');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Write a review</Typography>

            <Rating
                value={rating}
                onChange={(_, value) => setRating(value)}
                size="large"
                sx={{ mb: 2 }}
            />

            <TextField
                fullWidth
                multiline
                minRows={3}
                placeholder="What did you think of this product?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
            />

            <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Posting…' : 'Post review'}
            </Button>
        </Box>
    );
};

const timeAgo = (value) => {
    if (!value) return '';
    const date = new Date(value.replace(' ', 'T'));
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ProductReviews = ({ productId }) => {
    const dispatch = useDispatch();
    const { reviews, summary, loading } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(getProductReviews(productId));

        return () => dispatch(resetReviews());
    }, [dispatch, productId]);

    return (
        <Reveal>
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Reviews
                    </Typography>
                    <RatingSummary average={summary.average} count={summary.count} showEmpty size="medium" />
                </Box>

                <ReviewForm productId={productId} />

                {!loading && reviews.length === 0 && (
                    <Typography color="text.secondary">Be the first to review this product.</Typography>
                )}

                <Stack spacing={3}>
                    {reviews.map((review, index) => (
                        <Box key={review.id}>
                            {index > 0 && <Divider sx={{ mb: 3 }} />}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Avatar sx={{ bgcolor: colors.grapeSoft, color: colors.grape, fontWeight: 700 }}>
                                    {review.authorName.charAt(0).toUpperCase()}
                                </Avatar>

                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                        <Typography sx={{ fontWeight: 700 }}>{review.authorName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {timeAgo(review.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Rating value={review.rating} readOnly size="small" sx={{ my: 0.5 }} />

                                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {review.comment}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Reveal>
    );
};

export default ProductReviews;
