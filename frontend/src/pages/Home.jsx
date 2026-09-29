import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography, Button, Divider, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom';

import ProductCard from '../components/common/ProductCard';
import Section from '../components/common/Section';
import Blob from '../components/common/Blob';
import TestimonialCard from '../components/common/TestimonialCard';
import NewsletterForm from '../components/common/NewsletterForm';
import { colors } from '../theme/theme';
import { tagColorFor } from '../utils/tagColor';
import { resolveImageUrl } from '../utils/imageUrl';

import Reveal from '../motion/Reveal';
import { StaggerGroup, StaggerItem } from '../motion/Stagger';
import TiltCard from '../motion/TiltCard';
import MagneticButton from '../motion/MagneticButton';
import CountUp from '../motion/CountUp';
import RotatingWord from '../motion/RotatingWord';
import Marquee from '../motion/Marquee';
import ScrollRail from '../motion/ScrollRail';

import { getHomeProducts } from '../redux/product/productSlice';
import { getCategories } from '../redux/category/categorySlice';

const STEPS = [
    { title: 'Pick what you need', description: 'Browse the catalog and add a few things to your cart.' },
    { title: 'We pack it with care', description: 'Every order is checked and boxed the same day.' },
    { title: 'It lands on your counter', description: 'Tracked delivery, right to your door.' },
];

const TRUST_MESSAGES = [
    'Free shipping over 1000 UAH',
    'Cruelty-free formulas',
    '14-day returns',
    'Loved by 10,000+ customers',
];

// Static placeholder testimonials — swap for GET /reviews?featured=true
// once that endpoint exists on the backend.
const TESTIMONIALS = [
    { name: 'Olena', rating: 5, text: "The serum I've repurchased three times now. Genuinely changed my skin in a month." },
    { name: 'Marta', rating: 5, text: 'Delivery was next-day and the packaging alone made it feel like a gift.' },
    { name: 'Sofia', rating: 4.5, text: 'Finally a shop that lists real ingredients instead of just marketing words.' },
    { name: 'Kateryna', rating: 5, text: "Customer support helped me pick the right shade over chat — didn't expect that." },
];

const collageColors = [colors.punchSoft, colors.zapSoft, colors.grapeSoft];
const collageLayout = [
    { size: 210, top: 0, left: 40, rotate: -4, z: 2 },
    { size: 170, top: 150, left: 260, rotate: 6, z: 3 },
    { size: 150, top: 260, left: 0, rotate: -8, z: 1 },
];

const Home = () => {
    const dispatch = useDispatch();
    const { homeProducts: products, homePagination: pagination } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.categories);

    useEffect(() => {
        if (!products.length) {
            dispatch(getHomeProducts({ limit: 20 }));
        }
        if (!categories.length) {
            dispatch(getCategories());
        }
    }, [dispatch, products.length, categories.length]);

    const collageProducts = products.slice(0, 3);
    const totalProducts = pagination?.total ?? products.length;

    // No sales/view counter on the backend yet — rank by
    // avgRating * reviewCount as a stand-in "popularity" score.
    const bestsellers = useMemo(
        () =>
            [...products]
                .sort((a, b) => (b.avgRating * b.reviewCount) - (a.avgRating * a.reviewCount))
                .slice(0, 6),
        [products]
    );

    // Kept mutually exclusive from bestsellers: ProductCard gives each image
    // a page-unique view-transition-name, so the same product rendered in
    // both sections at once would violate that uniqueness and abort the
    // transition (browser throws "duplicate view-transition-name").
    const featuredProducts = useMemo(() => {
        const bestsellerIds = new Set(bestsellers.map((product) => product.id));
        return products.filter((product) => !bestsellerIds.has(product.id)).slice(0, 6);
    }, [products, bestsellers]);

    return (
        <>
            <Box
                sx={{
                    mb: { xs: 4, md: 6 },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
                    gap: { xs: 6, md: 4 },
                    alignItems: 'center',
                }}
            >
                <StaggerGroup stagger={0.12}>
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            aria-hidden
                            className="breathing-glow"
                            sx={{
                                position: 'absolute',
                                top: -80,
                                left: -60,
                                width: 260,
                                height: 260,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${colors.blush} 0%, transparent 70%)`,
                                filter: 'blur(10px)',
                                zIndex: -1,
                            }}
                        />

                        <StaggerItem>
                            <Typography
                                variant="h1"
                                sx={{ fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' }, lineHeight: 1.1, mb: 3 }}
                            >
                                Makeup that earns its spot on your shelf.
                            </Typography>
                        </StaggerItem>

                        <StaggerItem>
                            <Typography color="text.secondary" sx={{ maxWidth: 480, mb: 1, fontSize: '1.1rem' }}>
                                Skincare and cosmetics we'd actually reach for ourselves — picked
                                for daily use, not just for how they photograph.
                            </Typography>
                        </StaggerItem>

                        <StaggerItem>
                            <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.1rem', minHeight: '1.6em' }}>
                                Because your <RotatingWord words={['skin', 'lips', 'nails', 'hair']} /> deserves better.
                            </Typography>
                        </StaggerItem>

                        <StaggerItem>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
                                <MagneticButton>
                                    <Button component={Link} to="/catalog" variant="contained" size="large">
                                        Browse the catalog
                                    </Button>
                                </MagneticButton>

                                <Button component={Link} to="/catalog" variant="text" size="large" sx={{ color: 'text.primary' }}>
                                    See new arrivals
                                </Button>
                            </Box>
                        </StaggerItem>

                        <StaggerItem>
                            <Box sx={{ display: 'flex', gap: { xs: 3, sm: 5 }, flexWrap: 'wrap' }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>
                                        <CountUp value={totalProducts} />
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        Products
                                    </Typography>
                                </Box>

                                <Divider orientation="vertical" flexItem />

                                <Box>
                                    <Typography variant="h5" fontWeight={700}>
                                        <CountUp value={categories.length} />
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        Categories
                                    </Typography>
                                </Box>

                                <Divider orientation="vertical" flexItem />

                                <Box>
                                    <Typography variant="h5" fontWeight={700}>
                                        24/7
                                    </Typography>
                                    <Typography color="text.secondary" variant="body2">
                                        Support
                                    </Typography>
                                </Box>
                            </Box>
                        </StaggerItem>
                    </Box>
                </StaggerGroup>

                <Reveal delay={0.2}>
                    <Box sx={{ position: 'relative', height: 430, display: { xs: 'none', md: 'block' } }}>
                        {collageLayout.map((slot, index) => {
                            const product = collageProducts[index];

                            return (
                                <Blob
                                    key={index}
                                    color={collageColors[index % collageColors.length]}
                                    size={slot.size}
                                    variant={index}
                                    sx={{
                                        position: 'absolute',
                                        top: slot.top,
                                        left: slot.left,
                                        zIndex: slot.z,
                                        transform: `rotate(${slot.rotate}deg)`,
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 40px rgba(28,21,18,.10)',
                                    }}
                                >
                                    {product?.image && (
                                        <Box
                                            component="img"
                                            src={resolveImageUrl(product.image)}
                                            alt={product.title}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transform: `rotate(${-slot.rotate}deg) scale(1.3)`,
                                            }}
                                        />
                                    )}
                                </Blob>
                            );
                        })}
                    </Box>
                </Reveal>
            </Box>

            <Box sx={{ mb: { xs: 5, md: 7 }, mx: { xs: -2, sm: -3 }, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', py: 1.5 }}>
                <Marquee
                    items={TRUST_MESSAGES}
                    renderItem={(message) => (
                        <Typography sx={{ fontWeight: 600, px: 3, whiteSpace: 'nowrap' }}>
                            {message}
                        </Typography>
                    )}
                />
            </Box>

            {categories.length > 0 && (
                <Section title="Shop by category" subtitle="Jump straight to what you're after">
                    <StaggerGroup stagger={0.04}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                            {categories.map((category) => (
                                <StaggerItem key={category.id}>
                                    <Chip
                                        label={category.name}
                                        component={Link}
                                        to="/catalog"
                                        clickable
                                        sx={{ bgcolor: tagColorFor(category.name), fontWeight: 600 }}
                                    />
                                </StaggerItem>
                            ))}
                        </Box>
                    </StaggerGroup>
                </Section>
            )}

            {bestsellers.length > 0 && (
                <Section title="Bestsellers" subtitle="What everyone keeps coming back for" actionLabel="View all" actionTo="/catalog">
                    <StaggerGroup as="div" stagger={0.08}>
                        <Grid container spacing={3}>
                            {bestsellers.map((product) => (
                                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                    <StaggerItem>
                                        <TiltCard>
                                            <ProductCard product={product} />
                                        </TiltCard>
                                    </StaggerItem>
                                </Grid>
                            ))}
                        </Grid>
                    </StaggerGroup>
                </Section>
            )}

            <Section title="New arrivals" actionLabel="View all" actionTo="/catalog">
                <StaggerGroup as="div" stagger={0.08}>
                    <Grid container spacing={3}>
                        {featuredProducts.map((product) => (
                            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <StaggerItem>
                                    <TiltCard>
                                        <ProductCard product={product} />
                                    </TiltCard>
                                </StaggerItem>
                            </Grid>
                        ))}
                    </Grid>
                </StaggerGroup>
            </Section>

            <Section title="How it works" subtitle="From cart to counter in three steps" sx={{ maxWidth: 560 }}>
                <ScrollRail steps={STEPS} />
            </Section>

            <Reveal>
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        p: { xs: 3, md: 5 },
                        borderRadius: '28px',
                        textAlign: 'center',
                        bgcolor: colors.punch,
                        color: '#fff',
                    }}
                >
                    <Box
                        aria-hidden
                        className="breathing-glow"
                        sx={{
                            position: 'absolute',
                            bottom: -100,
                            right: -60,
                            width: 320,
                            height: 320,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)',
                        }}
                    />

                    <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' }, position: 'relative' }}>
                        Ready to restock?
                    </Typography>

                    <Typography sx={{ maxWidth: 520, mx: 'auto', mb: 4, opacity: 0.9, position: 'relative' }}>
                        Browse the full catalog and find the next thing you'll reach for
                        every morning.
                    </Typography>

                    <MagneticButton style={{ position: 'relative' }}>
                        <Button
                            component={Link}
                            to="/catalog"
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: '#fff', color: colors.punch, '&:hover': { bgcolor: colors.canvas } }}
                        >
                            Shop now
                        </Button>
                    </MagneticButton>
                </Box>
            </Reveal>

            <Section title="What customers say" subtitle="A few words from people who've already restocked" sx={{ mt: { xs: 5, md: 7 } }}>
                <StaggerGroup as="div" stagger={0.08}>
                    <Grid container spacing={3}>
                        {TESTIMONIALS.map((testimonial) => (
                            <Grid key={testimonial.name} size={{ xs: 12, sm: 6, md: 3 }}>
                                <StaggerItem>
                                    <TestimonialCard {...testimonial} />
                                </StaggerItem>
                            </Grid>
                        ))}
                    </Grid>
                </StaggerGroup>
            </Section>

            <Reveal>
                <Box
                    sx={{
                        textAlign: 'center',
                        p: { xs: 3, md: 5 },
                        borderRadius: '28px',
                        bgcolor: colors.canvas,
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 1 }}>
                        Get first access to new drops
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 420, mx: 'auto' }}>
                        One email a month, no spam — just new arrivals and the occasional discount code.
                    </Typography>

                    <NewsletterForm />
                </Box>
            </Reveal>
        </>
    );
};

export default Home;
