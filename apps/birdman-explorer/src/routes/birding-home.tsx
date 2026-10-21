import { createFileRoute } from '@tanstack/react-router';
import BirdingHome from '../pages/BirdingHome';

export const Route = createFileRoute('/birding-home')({
  component: BirdingHome,
});