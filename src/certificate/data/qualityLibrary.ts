import type { QualityItem } from '../types/certificate';

export const PREDEFINED_QUALITIES: QualityItem[] = [
  {
    id: 'innovative',
    title: 'Innovative',
    description: 'Bringing creative and original ideas to assignments or projects.'
  },
  {
    id: 'eager',
    title: 'Eager',
    description: 'Displaying enthusiasm and eagerness to participate in class.'
  },
  {
    id: 'consistent',
    title: 'Consistent',
    description: 'Maintaining consistent effort and participation throughout the course.'
  },
  {
    id: 'adaptable',
    title: 'Adaptable',
    description: 'Quickly adapting to new concepts, technologies and learning environments.'
  },
  {
    id: 'problem_solver',
    title: 'Problem Solver',
    description: 'Approaching technical challenges with logical and practical solutions.'
  },
  {
    id: 'responsible',
    title: 'Responsible',
    description: 'Demonstrating responsibility towards assignments, projects and deadlines.'
  },
  {
    id: 'collaborative',
    title: 'Collaborative',
    description: 'Working effectively with peers during activities and projects.'
  },
  {
    id: 'curious',
    title: 'Curious',
    description: 'Showing curiosity and willingness to explore new concepts.'
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Showing commitment and dedication towards learning and completing assigned tasks.'
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Demonstrating creativity while developing projects and solving problems.'
  },
  {
    id: 'disciplined',
    title: 'Disciplined',
    description: 'Following a structured approach towards learning and completing tasks.'
  },
  {
    id: 'quick_learner',
    title: 'Quick Learner',
    description: 'Demonstrating the ability to understand and apply new concepts quickly.'
  },
  {
    id: 'technical',
    title: 'Technical',
    description: 'Applying technical knowledge effectively during practical activities.'
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Taking initiative and demonstrating leadership during team activities.'
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Expressing ideas clearly and participating actively in discussions.'
  },
  {
    id: 'analytical',
    title: 'Analytical',
    description: 'Demonstrating logical thinking and analytical ability while solving problems.'
  }
];

export function getRandomTwoQualities(): [QualityItem, QualityItem] {
  const shuffled = [...PREDEFINED_QUALITIES].sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}
