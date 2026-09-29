import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import EmptyState from '../components/common/EmptyState';
import { colors } from '../theme/theme';

const NotFound = () => (
    <EmptyState
        icon={<SearchOffOutlinedIcon fontSize="inherit" />}
        color={colors.grapeSoft}
        title="This page doesn't exist"
        description="The link might be broken, or the page may have moved."
        actionLabel="Back to home"
        actionTo="/"
    />
);

export default NotFound;
