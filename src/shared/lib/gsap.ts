import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export { gsap };
export type { gsap as GSAPInstance } from 'gsap';
