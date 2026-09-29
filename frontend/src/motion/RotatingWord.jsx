import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Typewriter cycle through a list of words with a blinking caret.
// Screen readers get the plain, static sentence instead of the animation.
const RotatingWord = ({ words, typingSpeed = 55, deleteSpeed = 28, pause = 1400 }) => {
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);
    const [text, setText] = useState('');
    const [phase, setPhase] = useState('typing');

    useEffect(() => {
        if (reduced) return;

        const current = words[index % words.length];
        let timeout;

        if (phase === 'typing') {
            if (text.length < current.length) {
                timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
            } else {
                timeout = setTimeout(() => setPhase('deleting'), pause);
            }
        } else if (text.length > 0) {
            timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed);
        } else {
            timeout = setTimeout(() => {
                setPhase('typing');
                setIndex((i) => (i + 1) % words.length);
            }, deleteSpeed);
        }

        return () => clearTimeout(timeout);
    }, [text, phase, index, reduced, words, typingSpeed, deleteSpeed, pause]);

    if (reduced) {
        return <span style={{ fontWeight: 700 }}>{words[0]}</span>;
    }

    return (
        <span>
            <span className="visually-hidden">{words.join(', ')}</span>
            <span aria-hidden="true" style={{ fontWeight: 700 }}>
                {text}
                <span className="caret" />
            </span>
        </span>
    );
};

export default RotatingWord;
