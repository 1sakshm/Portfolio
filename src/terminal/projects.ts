export type Project = {
  name: string;
  year: string;
  type: string;
  desc: string;
  tags: string[];
  stats?: string[];
};

export const PROJECTS: Project[] = [
  {
    name: 'Project Utopia',
    year: '2023 - Present',
    type: 'Assistive Learning Platform',
    desc: 'Research-driven platform building cognition-aware learning tools for students with neurological disorders. Includes original research on color accessibility in data visualization, testing 45+ palettes across multiple types of color vision deficiency.',
    tags: ['HCI', 'Accessibility', 'Neurodiversity', 'Research'],
    stats: ['45+ palettes tested', '3 CVD types analyzed', 'Active development'],
  },
  {
    name: 'MorsEye',
    year: '2024',
    type: 'Computer Vision Communication Interface',
    desc: 'Hands-free communication system that converts eye blinks into real-time Morse code text using computer vision and facial tracking.',
    tags: ['Computer Vision', 'Accessibility', 'HCI', 'Real-time Systems'],
    stats: ['Real-time translation', 'Blink-to-text pipeline', 'High accuracy tracking'],
  },
  {
    name: 'Aperiodic Hat Tile Research',
    year: '2023',
    type: 'Mathematical Research',
    desc: 'Proved the aperiodicity of the Hat monotile using a Golden Ratio-based geometric construction, contributing to non-periodic tiling theory.',
    tags: ['Mathematics', 'Geometry', 'Research', 'Tiling Theory'],
    stats: ['Golden ratio proof', 'Novel construction', 'Published work'],
  },
  {
    name: 'From Pixels to Polygons',
    year: '2023',
    type: 'Technical Book',
    desc: 'Authored a comprehensive guide on 3D simulation and real-time systems in Unity, widely applicable in robotics, computer vision, and HCI research workflows.',
    tags: ['Unity', 'Simulation', 'XR', 'Technical Writing'],
    stats: ['Covers full pipeline', 'Research-oriented', 'Published globally'],
  },
];