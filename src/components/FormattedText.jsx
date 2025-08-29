import styles from '../app/textClamp.module.css';

export default function FormattedText({ text }) {
    return (
        <div className={styles.textContainer}>
            <p className={styles.truncatedText}>{text}</p>
        </div>
    );
}