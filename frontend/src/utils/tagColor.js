import { colors } from '../theme/theme';

const TAG_COLORS = [colors.punchSoft, colors.zapSoft, colors.grapeSoft, colors.mintSoft];

// Deterministically maps a label (category name) to one of the brand's
// accent tints, so the same category always reads the same color.
export const tagColorFor = (label = '') => {
    const hash = [...label].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return TAG_COLORS[hash % TAG_COLORS.length];
};
