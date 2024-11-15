import {useEffect, useState} from 'react';

import ReviewCard, {ReviewDoc} from '@/components/ReviewCard'
const ReviewsPage = () = => {
    const [reviews, setReviews] = useState<ReviewDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() = > {
        const getReviews
    })
}