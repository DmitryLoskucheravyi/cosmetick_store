import {
    Box,
    Container,
} from '@mui/material';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa',
            }}
        >
            <Header />

            <Container
                maxWidth="lg"
                sx={{
                    flexGrow: 1,
                    py: {
                        xs: 3,
                        md: 5,
                    },
                }}
            >
                {children}
            </Container>

            <Footer />
        </Box>
    );
};

export default Layout;