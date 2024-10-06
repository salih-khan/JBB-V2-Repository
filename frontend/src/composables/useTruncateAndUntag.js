import { ref } from 'vue';

export function useTruncateAndUntag() {

    // Function to truncate and remove HTML tags from text
    const truncate = (text, maxLength) => {
        if (!text || maxLength <= 0) return '';

        // Strip HTML tags
        const strippedText = text.replace(/<\/?[^>]+(>|$)/g, '');

        // Truncate text
        const truncatedText = strippedText.length > maxLength ? strippedText.substring(0, maxLength) + '...' : strippedText;

        return truncatedText;
    };

    return {
        truncate
    };
}