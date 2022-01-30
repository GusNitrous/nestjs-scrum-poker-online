import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

export const uuid = (size = 10) => customAlphabet(alphabet, size)();
