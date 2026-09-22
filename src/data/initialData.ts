import {
  Subject,
  VideoLesson,
  SimulationConfig,
  Quiz,
  CodingProblem,
  STEMActivity,
  STEMChallenge,
  Badge,
  LearningPath,
  FreeResource,
  StudentProfile,
} from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    category: 'science',
    description: 'Explore Physics, Chemistry, Biology, Environmental & Space Sciences with interactive visual experiments.',
    iconName: 'Atom',
    accentColor: 'from-emerald-500 to-teal-700',
    topicCount: 5,
    topics: ['Physics & Mechanics', 'Atomic Chemistry & Bonding', 'Cell Biology & Genetics', 'Environmental Ecology', 'Space & Astronomy'],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'mathematics',
    description: 'Master Algebra, Geometry, Trigonometry, and Probability through visual dynamic graphs and real-world problems.',
    iconName: 'Compass',
    accentColor: 'from-blue-500 to-indigo-700',
    topicCount: 6,
    topics: ['Algebra & Quadratics', 'Coordinate Geometry', 'Trigonometric Ratios', 'Probability & Odds', 'Descriptive Statistics', 'Number Theory'],
  },
  {
    id: 'technology',
    name: 'Technology',
    category: 'technology',
    description: 'Learn modern programming, computer architecture, web technologies, and AI foundations with hands-on practice.',
    iconName: 'Cpu',
    accentColor: 'from-amber-500 to-orange-700',
    topicCount: 5,
    topics: ['Computer Fundamentals', 'Python & Algorithm Design', 'Web Development (HTML/CSS/JS)', 'Artificial Intelligence & ML', 'Internet & Cyber Safety'],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    category: 'engineering',
    description: 'Design circuits, understand robotics, build mechanisms, and solve practical engineering challenges.',
    iconName: 'Wrench',
    accentColor: 'from-rose-500 to-red-700',
    topicCount: 5,
    topics: ['Electrical Circuits & Ohm’s Law', 'Robotics & Microcontrollers', 'Applied Mechanics', 'Sensors & Automation', 'Design Thinking & Prototyping'],
  },
];

export const INITIAL_VIDEOS: VideoLesson[] = [
  {
    id: 'vid-1',
    title: 'Physics → Understanding Velocity and Acceleration',
    description: 'Discover the distinction between speed and velocity, and observe how acceleration changes the velocity vector in 1D and 2D motion.',
    videoUrl: 'https://www.youtube.com/embed/FOkQszg1-j8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '11 mins',
    learningObjectives: [
      'Differentiate between scalar speed and vector velocity',
      'Calculate instantaneous and average acceleration',
      'Interpret distance-time and velocity-time graphs',
      'Apply kinematic formulas to horizontal motion'
    ],
    keyConcepts: ['Scalar vs Vector', 'Displacement (Δx)', 'Velocity v = Δx / Δt', 'Acceleration a = Δv / Δt'],
    importantFormulas: ['v = u + at', 's = ut + 0.5at²', 'v² = u² + 2as'],
    notes: 'Remember that negative acceleration signifies deceleration if it opposes the direction of motion, or acceleration in the negative coordinate direction.',
    relatedSimulationId: 'sim-projectile',
    practiceQuizId: 'quiz-motion',
    nextLessonId: 'vid-2',
    views: 1420,
  },
  {
    id: 'vid-2',
    title: 'Physics → Newton’s Three Laws of Motion in Action',
    description: 'Break down inertia, F = ma, and action-reaction pairs with everyday demonstrations and space-flight scenarios.',
    videoUrl: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '14 mins',
    learningObjectives: [
      'Explain how mass dictates an object\'s inertia',
      'Calculate net forces using Newton\'s second law (F = ma)',
      'Identify action-reaction force pairs on free-body diagrams'
    ],
    keyConcepts: ['Inertia', 'Net Force', 'Mass vs Weight', 'Action-Reaction Pairs'],
    importantFormulas: ['F_net = m · a', 'W = m · g'],
    notes: 'Action and reaction forces act on different bodies, which is why they never cancel each other out.',
    relatedSimulationId: 'sim-projectile',
    practiceQuizId: 'quiz-newton',
    nextLessonId: 'vid-3',
    views: 1980,
  },
  {
    id: 'vid-3',
    title: 'Chemistry → Inside the Atom: Protons, Neutrons & Electron Shells',
    description: 'Explore the subatomic anatomy of elements, atomic numbers, isotopes, and how valence electrons govern chemical reactivity.',
    videoUrl: 'https://www.youtube.com/embed/EMDrb283Gx4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Atomic Chemistry & Bonding',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '12 mins',
    learningObjectives: [
      'Identify the location and charges of protons, neutrons, and electrons',
      'Calculate atomic mass and atomic number from subatomic counts',
      'Model Bohr electron configurations up to element 20 (Calcium)'
    ],
    keyConcepts: ['Nucleus', 'Protons (+1)', 'Neutrons (0)', 'Electrons (-1)', 'Valence Shell (2, 8, 8 rule)'],
    importantFormulas: ['Atomic Number Z = Protons', 'Mass Number A = Protons + Neutrons'],
    notes: 'The outermost electron shell determines whether an atom readily gains, loses, or shares electrons.',
    relatedSimulationId: 'sim-atom',
    practiceQuizId: 'quiz-atom',
    nextLessonId: 'vid-4',
    views: 1650,
  },
  {
    id: 'vid-4',
    title: 'Biology → The Architecture of Plant and Animal Cells',
    description: 'Take a microscopic guided tour through eukaryotic cells. Examine organelles including the nucleus, mitochondria, and chloroplasts.',
    videoUrl: 'https://www.youtube.com/embed/URUJD5NEXC8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Cell Biology & Genetics',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    duration: '10 mins',
    learningObjectives: [
      'Distinguish between plant and animal cell components',
      'Understand ATP energy synthesis in the mitochondria',
      'Recognize how the cell membrane controls cellular homeostasis'
    ],
    keyConcepts: ['Cell Organelles', 'Selective Permeability', 'Mitochondria (Powerhouse)', 'Chloroplast (Photosynthesis)'],
    importantFormulas: ['Photosynthesis: 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂'],
    notes: 'Plant cells have rigid cell walls made of cellulose and large central vacuoles, whereas animal cells do not.',
    relatedSimulationId: 'sim-cell',
    practiceQuizId: 'quiz-cell',
    nextLessonId: 'vid-5',
    views: 2120,
  },
  {
    id: 'vid-5',
    title: 'Mathematics → Visualizing Quadratic Functions and Parabolic Curves',
    description: 'Learn how varying parameters a, b, and c transforms the parabola y = ax² + bx + c in real-time.',
    videoUrl: 'https://www.youtube.com/embed/cqXdp_18h50',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    subject: 'mathematics',
    topic: 'Algebra & Quadratics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    duration: '15 mins',
    learningObjectives: [
      'Locate the vertex, axis of symmetry, and roots of a parabola',
      'Predict how the leading coefficient a affects concavity and width',
      'Compute the discriminant (b² - 4ac) to determine the nature of roots'
    ],
    keyConcepts: ['Parabola', 'Vertex (-b/2a, f(-b/2a))', 'Roots / Zeroes', 'Discriminant Δ'],
    importantFormulas: ['x = (-b ± √(b² - 4ac)) / 2a', 'Vertex x = -b / (2a)'],
    notes: 'When the discriminant is negative, the quadratic has no real roots and the parabola does not cross the x-axis.',
    relatedSimulationId: 'sim-grapher',
    practiceQuizId: 'quiz-quadratics',
    nextLessonId: 'vid-6',
    views: 1840,
  },
  {
    id: 'vid-6',
    title: 'Mathematics → Trigonometry & The Magic of the Unit Circle',
    description: 'Demystify sine, cosine, and tangent using a rotating unit circle and see how trigonometric waves describe periodic nature.',
    videoUrl: 'https://www.youtube.com/embed/5a4G70GZ6U0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    subject: 'mathematics',
    topic: 'Trigonometric Ratios',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    duration: '16 mins',
    learningObjectives: [
      'Define sin(θ) and cos(θ) on the Cartesian coordinate plane',
      'Map angles in degrees and radians (2π rad = 360°)',
      'Derive the fundamental Pythagorean identity sin²θ + cos²θ = 1'
    ],
    keyConcepts: ['Unit Circle (r=1)', 'Sine = Opposite / Hypotenuse', 'Cosine = Adjacent / Hypotenuse', 'Radians'],
    importantFormulas: ['sin²(θ) + cos²(θ) = 1', 'tan(θ) = sin(θ) / cos(θ)'],
    notes: 'Trigonometry is essential in game development, sound wave synthesis, and astronomical navigation.',
    relatedSimulationId: 'sim-grapher',
    practiceQuizId: 'quiz-trig',
    nextLessonId: 'vid-7',
    views: 1330,
  },
  {
    id: 'vid-7',
    title: 'Technology → Algorithmic Thinking with Python',
    description: 'Learn how to translate human problem-solving into structured Python logic using variables, conditions, and loops.',
    videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '18 mins',
    learningObjectives: [
      'Write and execute basic Python input/output programs',
      'Control program flow with if/elif/else statements',
      'Iterate over sequences using for and while loops'
    ],
    keyConcepts: ['Variables', 'Data Types (int, str, float, bool)', 'Conditional Branching', 'Iteration'],
    importantFormulas: ['Algorithm Complexity: O(1), O(n) basic intuition'],
    notes: 'Python relies on indentation (whitespace) to structure code blocks instead of curly braces.',
    relatedSimulationId: 'sim-projectile',
    practiceQuizId: 'quiz-python',
    nextLessonId: 'vid-8',
    views: 3100,
  },
  {
    id: 'vid-8',
    title: 'Technology → How the Internet and Web Browsers Work',
    description: 'Unpack the journey of a web request from DNS lookup, TCP/IP packets, and HTTP protocol to browser DOM rendering.',
    videoUrl: 'https://www.youtube.com/embed/7_LPdttKXPc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
    subject: 'technology',
    topic: 'Internet & Cyber Safety',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    duration: '11 mins',
    learningObjectives: [
      'Trace how an IP address and domain name interact via DNS',
      'Understand client-server architecture and HTTP request/response',
      'Learn fundamental internet safety rules and encryption basics'
    ],
    keyConcepts: ['IP Address', 'DNS Resolution', 'Client vs Server', 'HTTPS & SSL Encryption'],
    importantFormulas: ['URL = Protocol + Domain + Path + Query'],
    notes: 'HTTPS guarantees that data traveling between your device and the server is encrypted against eavesdropping.',
    relatedSimulationId: 'sim-circuit',
    practiceQuizId: 'quiz-internet',
    nextLessonId: 'vid-9',
    views: 1720,
  },
  {
    id: 'vid-9',
    title: 'Engineering → Ohm’s Law & Fundamentals of Electric Circuits',
    description: 'Visualize electric current as electron flow. Discover the mathematical and physical relationship between Voltage (V), Current (I), and Resistance (R).',
    videoUrl: 'https://www.youtube.com/embed/HsLLq6Rm5qc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=800&auto=format&fit=crop&q=80',
    subject: 'engineering',
    topic: 'Electrical Circuits & Ohm’s Law',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '13 mins',
    learningObjectives: [
      'Define Voltage as electrical potential difference (Volts)',
      'Define Current as rate of charge flow (Amperes)',
      'Calculate resistance and power in direct-current circuits'
    ],
    keyConcepts: ['Voltage (V)', 'Current (I)', 'Resistance (R)', 'Power P = V · I', 'Short Circuit Hazard'],
    importantFormulas: ['V = I · R', 'I = V / R', 'P = V · I = I² · R'],
    notes: 'If resistance drops to near zero, current spikes dangerously high—this is called a short circuit!',
    relatedSimulationId: 'sim-circuit',
    practiceQuizId: 'quiz-circuits',
    nextLessonId: 'vid-10',
    views: 2450,
  },
  {
    id: 'vid-10',
    title: 'Engineering → Robotics: Sensors, Actuators, and Feedback Loops',
    description: 'Learn how robots perceive their environment using ultrasonic, infrared, and tactile sensors, and actuate using servo and stepper motors.',
    videoUrl: 'https://www.youtube.com/embed/V6dKk_1iW3Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    subject: 'engineering',
    topic: 'Robotics & Microcontrollers',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    duration: '15 mins',
    learningObjectives: [
      'Distinguish between sensors (inputs) and actuators (outputs)',
      'Explain open-loop versus closed-loop control systems',
      'Understand Pulse Width Modulation (PWM) for motor speed control'
    ],
    keyConcepts: ['Microcontroller (Arduino/ESP32)', 'Ultrasonic Distance Echo', 'Servo Angle Control', 'PID Feedback'],
    importantFormulas: ['Distance = (Echo Time × Speed of Sound) / 2'],
    notes: 'Closed loop systems use feedback from sensors to correct ongoing motor actions and maintain stability.',
    relatedSimulationId: 'sim-robotics',
    practiceQuizId: 'quiz-robotics',
    nextLessonId: 'vid-11',
    views: 1890,
  },
  {
    id: 'vid-11',
    title: 'Astronomy → Planetary Orbits, Gravity & Kepler’s Laws',
    description: 'Explore how gravitational attraction shapes planetary orbits from circles to ellipses. Discover Kepler’s Three Laws and orbital periods.',
    videoUrl: 'https://www.youtube.com/embed/6TGCPXhMQWw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Space & Astronomy',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    duration: '14 mins',
    learningObjectives: [
      'Understand Kepler’s 1st Law: Orbits are ellipses with the Sun at one focus',
      'Explain Kepler’s 2nd Law: Equal areas swept in equal time intervals',
      'Calculate orbital periods using Kepler’s 3rd Law (T² ∝ r³)'
    ],
    keyConcepts: ['Eccentricity', 'Semi-Major Axis', 'Escape Velocity', 'Centripetal Force vs Gravity'],
    importantFormulas: ['F = G · (M · m) / r²', 'v_circ = √(G · M / r)', 'T² = (4π² / GM) · r³'],
    notes: 'Planets move fastest at perihelion (closest to Sun) and slowest at aphelion (farthest).',
    relatedSimulationId: 'sim-gravity',
    practiceQuizId: 'quiz-gravity',
    nextLessonId: 'vid-12',
    views: 1620,
  },
  {
    id: 'vid-12',
    title: 'Physics → Wave Optics, Snell’s Law & Total Internal Reflection',
    description: 'Witness light bend when transitioning between media of differing refractive indices. Understand fiber optics and total internal reflection.',
    videoUrl: 'https://www.youtube.com/embed/yfawFJCR42I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    duration: '12 mins',
    learningObjectives: [
      'Define refractive index n as ratio of speed of light in vacuum to medium (n = c / v)',
      'Apply Snell’s Law (n₁ sin θ₁ = n₂ sin θ₂) to solve refraction problems',
      'Determine the critical angle θc for Total Internal Reflection'
    ],
    keyConcepts: ['Refractive Index', 'Angle of Incidence', 'Angle of Refraction', 'Total Internal Reflection (TIR)', 'Fiber Optics'],
    importantFormulas: ['n = c / v', 'n₁ · sin(θ₁) = n₂ · sin(θ₂)', 'sin(θ_c) = n₂ / n₁'],
    notes: 'Total Internal Reflection occurs only when light attempts to pass from an optically denser medium to a rarer medium at an angle greater than the critical angle.',
    relatedSimulationId: 'sim-optics',
    practiceQuizId: 'quiz-optics',
    nextLessonId: 'vid-13',
    views: 1950,
  },
  {
    id: 'vid-13',
    title: 'Technology → Logic Gates, Binary & Computer Architecture',
    description: 'Learn how modern microchips compute using billions of microscopic transistors arranged into AND, OR, NOT, and XOR logic gates.',
    videoUrl: 'https://www.youtube.com/embed/gI-qXk7XojA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    subject: 'technology',
    topic: 'Computer Fundamentals',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    duration: '11 mins',
    learningObjectives: [
      'Construct truth tables for fundamental logic gates (AND, OR, NOT, NAND, NOR, XOR)',
      'Understand how binary 0 and 1 correspond to voltage levels (0V and 3.3V/5V)',
      'Design a half-adder circuit that performs 1-bit binary addition'
    ],
    keyConcepts: ['Boolean Logic', 'Transistor as Switch', 'Truth Tables', 'Half Adder & Full Adder'],
    importantFormulas: ['AND: Y = A · B', 'OR: Y = A + B', 'XOR: Y = A ⊕ B = A\'B + AB\''],
    notes: 'NAND and NOR gates are known as "Universal Gates" because any Boolean logic circuit can be built entirely using only NAND or NOR gates.',
    relatedSimulationId: 'sim-circuit',
    practiceQuizId: 'quiz-boolean',
    nextLessonId: 'vid-14',
    views: 2180,
  },
  {
    id: 'vid-14',
    title: 'Mathematics → Unit Circle & Trigonometric Wave Functions',
    description: 'Connect right-angle triangles to circular motion and sinusoidal waves. Visualize sine, cosine, and tangent as coordinates on the Cartesian plane.',
    videoUrl: 'https://www.youtube.com/embed/a_7kN_o4FsA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    subject: 'mathematics',
    topic: 'Trigonometric Ratios',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    duration: '13 mins',
    learningObjectives: [
      'Define sine as y-coordinate and cosine as x-coordinate on a unit circle of radius 1',
      'Convert angles seamlessly between degrees and radians',
      'Graph y = sin(x) and y = cos(x) and analyze amplitude, frequency, and wavelength'
    ],
    keyConcepts: ['Unit Circle (r = 1)', 'Radians (2π = 360°)', 'Amplitude & Period', 'Pythagorean Identity'],
    importantFormulas: ['sin²(θ) + cos²(θ) = 1', 'tan(θ) = sin(θ) / cos(θ)', 'Radians = Degrees × (π / 180)'],
    notes: 'The unit circle explains why sine and cosine are periodic functions that repeat every 2π radians (360 degrees).',
    relatedSimulationId: 'sim-grapher',
    practiceQuizId: 'quiz-trigonometry',
    nextLessonId: 'vid-15',
    views: 1840,
  },
  {
    id: 'vid-15',
    title: 'Engineering → Solar Photovoltaic Cells & Renewable Energy',
    description: 'Explore the semiconductor physics behind solar panels. Learn how silicon p-n junctions absorb photon energy and convert it directly into clean electricity.',
    videoUrl: 'https://www.youtube.com/embed/L_q60geYMcM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    subject: 'engineering',
    topic: 'Sensors & Automation',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    duration: '15 mins',
    learningObjectives: [
      'Explain the photoelectric effect and bandgap excitation in semiconductors',
      'Understand how an electric field in a p-n junction directs electron-hole pairs',
      'Calculate solar panel power output based on irradiance (W/m²) and efficiency'
    ],
    keyConcepts: ['Semiconductor Bandgap', 'p-n Junction', 'Photovoltaic Effect', 'Solar Irradiance', 'Inverter (DC to AC)'],
    importantFormulas: ['Power = Irradiance × Area × Efficiency', 'E = h · f (Photon Energy)'],
    notes: 'Silicon solar panels typically have an energy conversion efficiency of 18% to 23%, with heat reducing their efficiency.',
    relatedSimulationId: 'sim-circuit',
    practiceQuizId: 'quiz-circuits',
    views: 1710,
  },
];

export const INITIAL_SIMULATIONS: SimulationConfig[] = [
  {
    id: 'sim-projectile',
    name: 'Physics: Projectile Motion Simulator',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Manipulate initial velocity, launch angle, and gravitational acceleration (Earth, Moon, Mars, Jupiter) to analyze the parabolic trajectory, range, peak altitude, and flight time in real-time.',
    instructions: [
      'Adjust the Launch Angle slider between 0° and 90°',
      'Adjust Initial Velocity from 5 m/s to 50 m/s',
      'Select different planetary environments (Earth 9.8m/s², Moon 1.6m/s², Mars 3.7m/s²)',
      'Click "Launch Projectile" to observe the animated trajectory and compare paths'
    ],
    type: 'projectile',
    published: true,
  },
  {
    id: 'sim-circuit',
    name: 'Engineering: Interactive Circuit Builder',
    subject: 'engineering',
    topic: 'Electrical Circuits & Ohm’s Law',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    description: 'Assemble a virtual direct-current circuit with a battery, variable resistor, toggle switch, and LED indicator. Watch current electron flow and prevent LED overload.',
    instructions: [
      'Flip the power switch to complete or break the circuit',
      'Adjust battery voltage (1.5V to 24V)',
      'Change resistor value (10Ω to 500Ω) and observe the LED brightness and current (mA)',
      'Notice warning indications if current exceeds safe diode limits'
    ],
    type: 'circuit',
    published: true,
  },
  {
    id: 'sim-grapher',
    name: 'Mathematics: 2D Interactive Function Grapher',
    subject: 'mathematics',
    topic: 'Algebra & Quadratics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Graph polynomial, trigonometric, and quadratic functions (y = ax² + bx + c). Live sliders let you investigate vertex coordinates, intercepts, roots, and symmetry.',
    instructions: [
      'Choose a function archetype (Quadratic, Linear, Cubic, Sine, Cosine)',
      'Drag sliders for parameters a, b, and c to see graph transformation',
      'Inspect automatically calculated roots, vertex, and y-intercept values',
      'Toggle the comparative secondary graph to see transformations side-by-side'
    ],
    type: 'grapher',
    published: true,
  },
  {
    id: 'sim-atom',
    name: 'Chemistry: Interactive Bohr Atom Model',
    subject: 'science',
    topic: 'Atomic Chemistry & Bonding',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Add or remove protons, neutrons, and electrons to construct chemical elements on the periodic table. Inspect valence electrons, net ionic charge, and nuclear stability.',
    instructions: [
      'Click + or - to alter Proton, Neutron, and Electron counts',
      'Notice the element identity, symbol, and atomic number change dynamically',
      'Observe electron shells (K=2, L=8, M=8) fill according to Aufbau principles',
      'Check whether your created isotope is stable or unstable (radioactive)'
    ],
    type: 'atom',
    published: true,
  },
  {
    id: 'sim-cell',
    name: 'Biology: Interactive Cell Explorer',
    subject: 'science',
    topic: 'Cell Biology & Genetics',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    description: 'Switch between Plant and Animal cells. Click each organelle (Nucleus, Mitochondria, Ribosomes, Chloroplast, Vacuole, etc.) to uncover its biological function and structural role.',
    instructions: [
      'Select either "Animal Cell" or "Plant Cell" view mode',
      'Hover over and click any highlighted cellular organelle in the cross-section',
      'Read detailed anatomical functions and see high-magnification micrographs',
      'Take the 3-question quick organelle challenge'
    ],
    type: 'cell',
    published: true,
  },
  {
    id: 'sim-robotics',
    name: 'Engineering: 2-Link Robotic Arm Kinematics',
    subject: 'engineering',
    topic: 'Robotics & Microcontrollers',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    description: 'Control joint angles (θ1, θ2) and segment lengths of a robotic manipulator. Understand forward kinematics, end-effector coordinates (X, Y), and torque balance.',
    instructions: [
      'Rotate Joint 1 (Base shoulder angle) and Joint 2 (Elbow angle)',
      'Observe real-time calculation of end-effector coordinates',
      'Toggle the target coordinate marker to practice inverse kinematic positioning'
    ],
    type: 'robotics',
    published: true,
  },
  {
    id: 'sim-gravity',
    name: 'Astronomy: Planetary Gravity & Orbit Simulator',
    subject: 'science',
    topic: 'Space & Astronomy',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Manipulate solar mass and tangential launch velocity to investigate Keplerian elliptical orbits, circular velocity equilibrium, and gravitational escape trajectories.',
    instructions: [
      'Adjust the Sun Mass slider to change the central gravitational attraction field',
      'Drag Orbital Radius to position the orbiting body farther or closer',
      'Tune Tangential Velocity to match calculated circular velocity v = √(GM/r)',
      'Press Play/Pause to observe planetary orbit trails and completed revolutions'
    ],
    type: 'gravity',
    relatedVideoId: 'vid-11',
    relatedQuizId: 'quiz-gravity',
    published: true,
  },
  {
    id: 'sim-optics',
    name: 'Physics: Wave Optics & Snell’s Law Refraction',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Direct a laser across optical boundaries between Air, Water, Glass, and Diamond. Observe light bending, reflected rays, and Total Internal Reflection (TIR).',
    instructions: [
      'Select starting medium (e.g. Air n=1.0 or Crown Glass n=1.52)',
      'Select refracting medium (e.g. Water n=1.33 or Diamond n=2.42)',
      'Drag the Incident Angle (θ1) slider from 0° (normal) to 85°',
      'Examine real-time calculated refracted angle (θ2) and critical angle for TIR'
    ],
    type: 'optics',
    relatedVideoId: 'vid-12',
    relatedQuizId: 'quiz-optics',
    published: true,
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-motion',
    title: 'Physics Mastery: Velocity, Speed & Acceleration',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Test your understanding of scalar vs vector quantities, velocity-time slopes, and standard motion equations.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 342,
    averageScorePercent: 78,
    relatedTopicOrVideo: 'vid-1',
    questions: [
      {
        id: 'qm-1',
        type: 'mcq',
        question: 'Which of the following is a vector quantity having both magnitude and direction?',
        options: ['Speed', 'Distance', 'Velocity', 'Temperature'],
        correctAnswer: 'Velocity',
        explanation: 'Velocity specifies both speed (magnitude) and direction of motion, making it a vector quantity.',
        hint: 'Think about which quantity requires a directional indicator (e.g. North or +x).'
      },
      {
        id: 'qm-2',
        type: 'mcq',
        question: 'What physical quantity does the slope of a Velocity vs. Time graph represent?',
        options: ['Displacement', 'Acceleration', 'Total Speed', 'Force'],
        correctAnswer: 'Acceleration',
        explanation: 'Slope is Δv / Δt. By definition, the rate of change of velocity with respect to time is acceleration.',
      },
      {
        id: 'qm-3',
        type: 'true-false',
        question: 'An object moving in a circle at constant speed has zero acceleration.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'False. Because its direction of motion is constantly changing, its velocity is changing, creating centripetal acceleration.',
      },
      {
        id: 'qm-4',
        type: 'multiple-select',
        question: 'Select all standard kinematic formulas for constant acceleration:',
        options: [
          'v = u + at',
          's = ut + 0.5at²',
          'v = s / t²',
          'v² = u² + 2as'
        ],
        correctAnswer: ['v = u + at', 's = ut + 0.5at²', 'v² = u² + 2as'],
        explanation: 'These three equations are Newton’s equations of uniformly accelerated linear motion.',
      },
      {
        id: 'qm-5',
        type: 'conceptual',
        question: 'If a car travels 150 km North in 3 hours, what is its average velocity?',
        options: ['50 km/h North', '50 km/h South', '150 km/h', '450 km/h North'],
        correctAnswer: '50 km/h North',
        explanation: 'Velocity = Displacement / Time = 150 km North / 3 hours = 50 km/h North.',
      }
    ]
  },
  {
    id: 'quiz-newton',
    title: 'Newtonian Dynamics: Forces and Gravitational Law',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Assess your knowledge of Newton\'s Three Laws, planetary orbits, and inertia.',
    timeLimitMinutes: 8,
    published: true,
    attemptsCount: 289,
    averageScorePercent: 82,
    relatedTopicOrVideo: 'vid-2',
    questions: [
      {
        id: 'qn-1',
        type: 'mcq',
        question: 'Which fundamental force keeps planets in stable orbit around the Sun?',
        options: ['Magnetic Force', 'Electromagnetic Repulsion', 'Gravity', 'Atmospheric Pressure'],
        correctAnswer: 'Gravity',
        explanation: 'Gravity provides the centripetal attraction that keeps planets in perpetual orbit around the Sun.',
      },
      {
        id: 'qn-2',
        type: 'mcq',
        question: 'According to Newton\'s Second Law, if you double the net force on an object while keeping its mass constant, its acceleration will:',
        options: ['Halve', 'Stay the same', 'Double', 'Quadruple'],
        correctAnswer: 'Double',
        explanation: 'Because F = m · a, acceleration is directly proportional to net force. Doubling force doubles acceleration.',
      },
      {
        id: 'qn-3',
        type: 'true-false',
        question: 'Mass and weight are identical physical quantities measured in kilograms.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Mass is the amount of matter (kg), whereas weight is the gravitational force acting on that mass (Newtons, W = mg).',
      },
      {
        id: 'qn-4',
        type: 'conceptual',
        question: 'When a rocket expels exhaust gases downward at high speed, what force propels the rocket upward?',
        options: ['Air resistance pushing the nose', 'The equal and opposite reaction force from the expelled gases', 'Solar wind', 'Decreased atmospheric gravity'],
        correctAnswer: 'The equal and opposite reaction force from the expelled gases',
        explanation: 'According to Newton’s Third Law, every action produces an equal and opposite reaction.',
      }
    ]
  },
  {
    id: 'quiz-atom',
    title: 'Chemistry: Atomic Anatomy & Periodic Table',
    subject: 'science',
    topic: 'Atomic Chemistry & Bonding',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Verify subatomic particle charges, mass numbers, electron configuration, and valence shells.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 410,
    averageScorePercent: 85,
    relatedTopicOrVideo: 'vid-3',
    questions: [
      {
        id: 'qa-1',
        type: 'mcq',
        question: 'An atom has 6 protons, 6 neutrons, and 6 electrons. What element is it?',
        options: ['Oxygen', 'Nitrogen', 'Carbon', 'Boron'],
        correctAnswer: 'Carbon',
        explanation: 'The atomic number is determined purely by the number of protons. Atomic number 6 is Carbon (C).',
      },
      {
        id: 'qa-2',
        type: 'mcq',
        question: 'What is the electrical charge of a neutron?',
        options: ['+1', '-1', 'Neutral (0)', '+2'],
        correctAnswer: 'Neutral (0)',
        explanation: 'Neutrons have zero net electrical charge and reside in the nucleus with positively charged protons.',
      },
      {
        id: 'qa-3',
        type: 'mcq',
        question: 'What is the maximum number of electrons that can occupy the first (K) shell in Bohr’s model?',
        options: ['2', '8', '18', '32'],
        correctAnswer: '2',
        explanation: 'The innermost electron shell (n=1) can accommodate a maximum of 2 electrons (2n² = 2(1)² = 2).',
      },
      {
        id: 'qa-4',
        type: 'true-false',
        question: 'Isotopes of the same element have the same number of protons but different numbers of neutrons.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. For example, Carbon-12 and Carbon-14 both have 6 protons, but possess 6 and 8 neutrons respectively.',
      }
    ]
  },
  {
    id: 'quiz-cell',
    title: 'Cell Biology: Organelles and Cellular Machinery',
    subject: 'science',
    topic: 'Cell Biology & Genetics',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    description: 'Identify animal vs plant cell components and their specialized biological roles.',
    timeLimitMinutes: 8,
    published: true,
    attemptsCount: 520,
    averageScorePercent: 90,
    relatedTopicOrVideo: 'vid-4',
    questions: [
      {
        id: 'qc-1',
        type: 'mcq',
        question: 'Which organelle is often referred to as the "powerhouse of the cell" due to ATP generation?',
        options: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Lysosome'],
        correctAnswer: 'Mitochondria',
        explanation: 'Mitochondria generate the majority of cellular chemical energy via adenosine triphosphate (ATP).',
      },
      {
        id: 'qc-2',
        type: 'multiple-select',
        question: 'Select all organelles found in plant cells but typically NOT in animal cells:',
        options: ['Chloroplast', 'Cellulose Cell Wall', 'Mitochondria', 'Large Central Vacuole'],
        correctAnswer: ['Chloroplast', 'Cellulose Cell Wall', 'Large Central Vacuole'],
        explanation: 'Chloroplasts and rigid cell walls are unique to plant/algal cells. Mitochondria are present in both plant and animal cells.',
      },
      {
        id: 'qc-3',
        type: 'mcq',
        question: 'Which structure houses the genetic blueprint (DNA) in eukaryotic cells?',
        options: ['Cytoplasm', 'Nucleus', 'Endoplasmic Reticulum', 'Cell Membrane'],
        correctAnswer: 'Nucleus',
        explanation: 'The nucleus contains chromatin and chromosomal DNA wrapped in a protective double membrane.',
      }
    ]
  },
  {
    id: 'quiz-quadratics',
    title: 'Algebra: Quadratic Functions & Graphs',
    subject: 'mathematics',
    topic: 'Algebra & Quadratics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Master vertex formula, discriminant analysis, and parabolic curve behavior.',
    timeLimitMinutes: 12,
    published: true,
    attemptsCount: 275,
    averageScorePercent: 72,
    relatedTopicOrVideo: 'vid-5',
    questions: [
      {
        id: 'qq-1',
        type: 'mcq',
        question: 'What is the shape of the graph of any quadratic equation y = ax² + bx + c?',
        options: ['Hyperbola', 'Straight Line', 'Parabola', 'Sinusoidal Wave'],
        correctAnswer: 'Parabola',
        explanation: 'The graph of any second-degree polynomial function is a symmetrical curve called a parabola.',
      },
      {
        id: 'qq-2',
        type: 'mcq',
        question: 'If the discriminant b² - 4ac is greater than 0, how many distinct real roots exist?',
        options: ['0', '1', '2', 'Infinitely many'],
        correctAnswer: '2',
        explanation: 'A positive discriminant (Δ > 0) indicates two distinct real intersections with the x-axis.',
      },
      {
        id: 'qq-3',
        type: 'conceptual',
        question: 'For the equation y = x² - 4, what are the roots (x-intercepts)?',
        options: ['x = 2 and x = -2', 'x = 4 and x = -4', 'x = 0 and x = 4', 'x = 16'],
        correctAnswer: 'x = 2 and x = -2',
        explanation: 'Setting y = 0: x² - 4 = 0 → (x-2)(x+2) = 0 → x = 2 or x = -2.',
      }
    ]
  },
  {
    id: 'quiz-trig',
    title: 'Trigonometry: Fundamental Ratios and Identities',
    subject: 'mathematics',
    topic: 'Trigonometric Ratios',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    description: 'Test your grasp of SOH-CAH-TOA, unit circle coordinates, and radian-degree conversions.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 195,
    averageScorePercent: 74,
    relatedTopicOrVideo: 'vid-6',
    questions: [
      {
        id: 'qt-1',
        type: 'mcq',
        question: 'What is the exact value of sin(30°) or sin(π/6 rad)?',
        options: ['0', '0.5 (1/2)', '√3 / 2', '1'],
        correctAnswer: '0.5 (1/2)',
        explanation: 'In a standard 30-60-90 right triangle, opposite/hypotenuse for 30° is 1/2.',
      },
      {
        id: 'qt-2',
        type: 'true-false',
        question: 'The identity sin²(x) + cos²(x) = 1 holds true for all real values of x.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. This is the fundamental Pythagorean trigonometric identity derived from x² + y² = 1 on the unit circle.',
      },
      {
        id: 'qt-3',
        type: 'mcq',
        question: 'In a right-angled triangle, which ratio represents Tangent (tan θ)?',
        options: ['Opposite / Hypotenuse', 'Adjacent / Hypotenuse', 'Opposite / Adjacent', 'Hypotenuse / Opposite'],
        correctAnswer: 'Opposite / Adjacent',
        explanation: 'By SOH CAH TOA: Tan θ = Opposite / Adjacent.',
      }
    ]
  },
  {
    id: 'quiz-python',
    title: 'Coding Essentials: Python Core Concepts',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Verify syntax rules, data types, condition evaluation, and looping constructs in Python.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 620,
    averageScorePercent: 86,
    relatedTopicOrVideo: 'vid-7',
    questions: [
      {
        id: 'qp-1',
        type: 'mcq',
        question: 'What keyword is used to define a function in Python?',
        options: ['function', 'func', 'def', 'define'],
        correctAnswer: 'def',
        explanation: 'In Python, user-defined functions begin with the keyword "def" followed by the function name.',
      },
      {
        id: 'qp-2',
        type: 'mcq',
        question: 'What is the result of 7 // 2 in Python 3?',
        options: ['3.5', '3', '4', '1'],
        correctAnswer: '3',
        explanation: 'The double forward slash (//) performs integer floor division in Python, discarding the fractional remainder.',
      },
      {
        id: 'qp-3',
        type: 'multiple-select',
        question: 'Select all valid built-in sequence data types in Python:',
        options: ['list', 'tuple', 'string (str)', 'integer (int)'],
        correctAnswer: ['list', 'tuple', 'string (str)'],
        explanation: 'Lists, tuples, and strings are sequence types that support indexing and slicing. Integers are numeric primitives.',
      }
    ]
  },
  {
    id: 'quiz-internet',
    title: 'Technology: Internet Protocols and Cybersecurity',
    subject: 'technology',
    topic: 'Internet & Cyber Safety',
    difficulty: 'Beginner',
    ageGroup: '10-12',
    description: 'Understand domain names, IP addresses, web browsers, and safe online habits.',
    timeLimitMinutes: 8,
    published: true,
    attemptsCount: 310,
    averageScorePercent: 88,
    relatedTopicOrVideo: 'vid-8',
    questions: [
      {
        id: 'qi-1',
        type: 'mcq',
        question: 'What system translates friendly web addresses like "google.com" into numerical IP addresses?',
        options: ['HTTP', 'DNS (Domain Name System)', 'FTP', 'HTML'],
        correctAnswer: 'DNS (Domain Name System)',
        explanation: 'DNS acts as the phonebook of the internet, mapping human-readable domain names to machine-readable IP addresses.',
      },
      {
        id: 'qi-2',
        type: 'true-false',
        question: 'A URL beginning with "https://" indicates that communication is encrypted with TLS/SSL.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. The "s" stands for secure, verifying encrypted transport between your browser and the web server.',
      }
    ]
  },
  {
    id: 'quiz-circuits',
    title: 'Engineering: Ohm’s Law & Electronic Circuits',
    subject: 'engineering',
    topic: 'Electrical Circuits & Ohm’s Law',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Calculate voltage, current, and resistance in basic series and parallel circuits.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 440,
    averageScorePercent: 81,
    relatedTopicOrVideo: 'vid-9',
    questions: [
      {
        id: 'qci-1',
        type: 'mcq',
        question: 'If a 9V battery is connected to a 3Ω resistor, what current flows through the circuit?',
        options: ['27 A', '3 A', '0.33 A', '12 A'],
        correctAnswer: '3 A',
        explanation: 'Ohm’s Law: I = V / R = 9V / 3Ω = 3 Amperes.',
      },
      {
        id: 'qci-2',
        type: 'mcq',
        question: 'What happens to the total resistance when two resistors are connected in series?',
        options: ['It decreases', 'It stays the same', 'It equals the sum of both resistances (R1 + R2)', 'It drops to zero'],
        correctAnswer: 'It equals the sum of both resistances (R1 + R2)',
        explanation: 'In a series circuit, resistors are in the same line of current flow, so R_total = R1 + R2.',
      },
      {
        id: 'qci-3',
        type: 'conceptual',
        question: 'Why is a resistor necessary when connecting a small LED to a 9V battery?',
        options: ['To amplify the LED glow', 'To limit current and prevent the LED from burning out', 'To convert DC into AC', 'To keep the battery charged'],
        correctAnswer: 'To limit current and prevent the LED from burning out',
        explanation: 'LEDs have very little internal resistance. Without a current-limiting resistor, excessive current will burn out the diode.',
      }
    ]
  },
  {
    id: 'quiz-robotics',
    title: 'Robotics & Automation: Sensors & Control',
    subject: 'engineering',
    topic: 'Robotics & Microcontrollers',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    description: 'Assess understanding of ultrasonic distance calculations, servo control, and automated feedback loops.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 220,
    averageScorePercent: 79,
    relatedTopicOrVideo: 'vid-10',
    questions: [
      {
        id: 'qr-1',
        type: 'mcq',
        question: 'How does an ultrasonic distance sensor measure distance to an obstacle?',
        options: [
          'By measuring ambient room temperature',
          'By timing the reflection of emitted high-frequency sound waves',
          'By detecting magnetic fields',
          'Using a miniature laser beam'
        ],
        correctAnswer: 'By timing the reflection of emitted high-frequency sound waves',
        explanation: 'The sensor emits an ultrasonic ping and measures the elapsed time for the echo to return.',
      },
      {
        id: 'qr-2',
        type: 'true-false',
        question: 'Servomotors can be commanded to rotate and hold specific angular positions with closed-loop feedback.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Unlike standard DC motors, servomotors incorporate internal potentiometers and control circuitry to position at exact angles.',
      },
      {
        id: 'qr-3',
        type: 'mcq',
        question: 'What technique is used by microcontrollers to regulate the speed of a DC motor without analog voltage dropping resistors?',
        options: ['Pulse Width Modulation (PWM)', 'Frequency Hopping', 'Capacitive Coupling', 'Step-down Resistors'],
        correctAnswer: 'Pulse Width Modulation (PWM)',
        explanation: 'PWM rapidly toggles the digital signal on and off, varying the average voltage delivered to the motor based on the duty cycle percentage.',
      },
      {
        id: 'qr-4',
        type: 'mcq',
        question: 'In robotics kinematics, what is the term for calculating the joint angles required to position an end-effector at a specific target (X, Y, Z)?',
        options: ['Inverse Kinematics', 'Forward Kinematics', 'Static Analysis', 'Dynamic Balancing'],
        correctAnswer: 'Inverse Kinematics',
        explanation: 'Forward kinematics computes position from known angles, whereas Inverse Kinematics solves for the necessary angles to achieve a desired Cartesian location.',
      },
      {
        id: 'qr-5',
        type: 'multiple-select',
        question: 'Select all common robot sensors that provide environment feedback to the controller:',
        options: ['Ultrasonic Distance Sensor', 'Infrared Obstacle Detector', 'Rotary Encoder', 'DC Solenoid'],
        correctAnswer: ['Ultrasonic Distance Sensor', 'Infrared Obstacle Detector', 'Rotary Encoder'],
        explanation: 'Ultrasonic, IR, and Encoders are input sensors. A solenoid is an electromagnetic output actuator.',
      }
    ]
  },
  {
    id: 'quiz-gravity',
    title: 'Astronomy & Gravitation: Kepler’s Planetary Laws',
    subject: 'science',
    topic: 'Space & Astronomy',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Test orbital mechanics, Newton’s universal gravitation, and Kepler’s three laws of planetary motion.',
    timeLimitMinutes: 12,
    published: true,
    attemptsCount: 290,
    averageScorePercent: 82,
    relatedTopicOrVideo: 'vid-11',
    questions: [
      {
        id: 'qg-1',
        type: 'mcq',
        question: 'According to Kepler’s First Law, what geometric shape is the orbit of every planet around the Sun?',
        options: ['A perfect circle with the Sun at the center', 'An ellipse with the Sun at one of the two foci', 'A parabola extending to infinity', 'A spiral collapsing inward'],
        correctAnswer: 'An ellipse with the Sun at one of the two foci',
        explanation: 'Kepler’s First Law states that all planets move in elliptical orbits, with the Sun situated at one focus.',
      },
      {
        id: 'qg-2',
        type: 'mcq',
        question: 'If the distance between two celestial bodies is doubled (2×), by what factor does the gravitational force between them change?',
        options: ['Halved (1/2)', 'Quartered (1/4)', 'Doubled (2×)', 'Unchanged'],
        correctAnswer: 'Quartered (1/4)',
        explanation: 'Gravitational attraction follows Newton’s inverse-square law (F ∝ 1/r²). Doubling distance reduces force by 2² = 4 times.',
      },
      {
        id: 'qg-3',
        type: 'true-false',
        question: 'A planet moves faster in its orbit when it is closest to the Sun (perihelion) than when it is farthest (aphelion).',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Kepler’s Second Law (conservation of angular momentum) requires the planet to sweep equal areas in equal times, moving fastest at perihelion.',
      },
      {
        id: 'qg-4',
        type: 'mcq',
        question: 'What is the theoretical circular orbital velocity formula for a satellite orbiting mass M at radius r?',
        options: ['v = √(GM / r)', 'v = GM · r²', 'v = 2πr / G', 'v = √(2GMr)'],
        correctAnswer: 'v = √(GM / r)',
        explanation: 'Equating centripetal force (m v² / r) with gravitational force (G M m / r²) yields v = √(GM / r).',
      },
      {
        id: 'qg-5',
        type: 'multiple-select',
        question: 'Which of the following variables directly influence the gravitational pull between two orbiting bodies?',
        options: ['Mass of Body 1', 'Mass of Body 2', 'Distance between centers of mass', 'Color and surface temperature of the bodies'],
        correctAnswer: ['Mass of Body 1', 'Mass of Body 2', 'Distance between centers of mass'],
        explanation: 'F = G(m1 · m2) / r². Gravitational force depends purely on masses and distance, not temperature or color.',
      }
    ]
  },
  {
    id: 'quiz-optics',
    title: 'Wave Optics: Snell’s Law & Light Refraction',
    subject: 'science',
    topic: 'Physics & Mechanics',
    difficulty: 'Intermediate',
    ageGroup: '13-15',
    description: 'Verify your mastery of refractive index, ray propagation, angles of refraction, and Total Internal Reflection.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 310,
    averageScorePercent: 79,
    relatedTopicOrVideo: 'vid-12',
    questions: [
      {
        id: 'qo-1',
        type: 'mcq',
        question: 'When a ray of light passes from Air (n = 1.0) into Water (n = 1.33), what happens to the ray?',
        options: ['It bends toward the normal line', 'It bends away from the normal line', 'It speeds up significantly', 'It reflects completely with zero transmission'],
        correctAnswer: 'It bends toward the normal line',
        explanation: 'When entering an optically denser medium (higher n), light slows down and bends toward the normal line.',
      },
      {
        id: 'qo-2',
        type: 'mcq',
        question: 'What is Snell’s Law formula relating the refractive indices and angles of incidence and refraction?',
        options: ['n₁ · sin(θ₁) = n₂ · sin(θ₂)', 'n₁ · cos(θ₁) = n₂ · cos(θ₂)', 'n₁ · θ₁ = n₂ · θ₂', 'sin(θ₁) · sin(θ₂) = n₁ · n₂'],
        correctAnswer: 'n₁ · sin(θ₁) = n₂ · sin(θ₂)',
        explanation: 'Snell’s Law states that the product of the refractive index and the sine of the angle to normal is constant across boundaries.',
      },
      {
        id: 'qo-3',
        type: 'true-false',
        question: 'Total Internal Reflection can happen when light travels from air into glass.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'False. Total Internal Reflection only occurs when traveling from an optically denser medium (higher n, e.g. glass) toward a rarer medium (lower n, e.g. air).',
      },
      {
        id: 'qo-4',
        type: 'mcq',
        question: 'What is the critical angle θc for a glass-air boundary where n(glass) = 1.50 and n(air) = 1.00?',
        options: ['~41.8°', '~90.0°', '~30.0°', '~60.5°'],
        correctAnswer: '~41.8°',
        explanation: 'sin(θc) = n_air / n_glass = 1 / 1.50 = 0.6667. arcsin(0.6667) ≈ 41.8°.',
      },
      {
        id: 'qo-5',
        type: 'multiple-select',
        question: 'Select all technological applications that depend fundamentally on Total Internal Reflection (TIR):',
        options: ['Fiber optic broadband cables', 'Medical endoscopes', 'Binocular roof prisms', 'Standard incandescent light bulbs'],
        correctAnswer: ['Fiber optic broadband cables', 'Medical endoscopes', 'Binocular roof prisms'],
        explanation: 'Fiber optics, endoscopes, and prism binoculars keep light trapped via consecutive TIR reflections along boundaries.',
      }
    ]
  },
  {
    id: 'quiz-boolean',
    title: 'Computer Science: Logic Gates & Binary Architecture',
    subject: 'technology',
    topic: 'Computer Fundamentals',
    difficulty: 'Beginner',
    ageGroup: '13-15',
    description: 'Test your understanding of Boolean logic truth tables, gate combinations, and digital binary addition.',
    timeLimitMinutes: 10,
    published: true,
    attemptsCount: 380,
    averageScorePercent: 86,
    relatedTopicOrVideo: 'vid-13',
    questions: [
      {
        id: 'qb-1',
        type: 'mcq',
        question: 'Which logic gate outputs 1 (HIGH) if and only if BOTH of its inputs A and B are 1 (HIGH)?',
        options: ['AND Gate', 'OR Gate', 'XOR Gate', 'NOR Gate'],
        correctAnswer: 'AND Gate',
        explanation: 'An AND gate produces an output of 1 only when both input A and input B are 1.',
      },
      {
        id: 'qb-2',
        type: 'mcq',
        question: 'What is the output of an XOR (Exclusive OR) gate when input A = 1 and input B = 1?',
        options: ['0', '1', 'Undefined', '-1'],
        correctAnswer: '0',
        explanation: 'XOR outputs 1 when the inputs differ. When both inputs are 1 (identical), the output is 0.',
      },
      {
        id: 'qb-3',
        type: 'true-false',
        question: 'NAND and NOR gates are universal gates capable of synthesizing any Boolean logic function.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Any complex digital circuit (adders, multiplexers, ALUs) can be built using only NAND or only NOR gates.',
      },
      {
        id: 'qb-4',
        type: 'mcq',
        question: 'In binary arithmetic, what is the sum of 1 + 1?',
        options: ['10 in binary (0 with a carry of 1)', '2 in binary', '11 in binary', '0 with zero carry'],
        correctAnswer: '10 in binary (0 with a carry of 1)',
        explanation: '1 + 1 in binary equals 2 in base 10, written as binary 10 (Sum = 0, Carry = 1).',
      },
      {
        id: 'qb-5',
        type: 'multiple-select',
        question: 'Select all logic gates that will output 1 when input A = 0 and input B = 1:',
        options: ['OR Gate', 'XOR Gate', 'NAND Gate', 'AND Gate'],
        correctAnswer: ['OR Gate', 'XOR Gate', 'NAND Gate'],
        explanation: 'OR outputs 1, XOR outputs 1, NAND outputs 1 (since not both are 1). Only AND outputs 0.',
      }
    ]
  },
  {
    id: 'quiz-trigonometry',
    title: 'Mathematics: Unit Circle & Trigonometric Identities',
    subject: 'mathematics',
    topic: 'Trigonometric Ratios',
    difficulty: 'Intermediate',
    ageGroup: '16-18',
    description: 'Master radian measure, trigonometric definitions on the Cartesian plane, and fundamental identities.',
    timeLimitMinutes: 12,
    published: true,
    attemptsCount: 330,
    averageScorePercent: 81,
    relatedTopicOrVideo: 'vid-14',
    questions: [
      {
        id: 'qt-1',
        type: 'mcq',
        question: 'On a unit circle with radius r = 1, which trigonometric function corresponds directly to the y-coordinate of a point at angle θ?',
        options: ['sin(θ)', 'cos(θ)', 'tan(θ)', 'sec(θ)'],
        correctAnswer: 'sin(θ)',
        explanation: 'By definition on the unit circle, x = cos(θ) and y = sin(θ).',
      },
      {
        id: 'qt-2',
        type: 'mcq',
        question: 'What is the angle 180° converted to radians?',
        options: ['π radians', '2π radians', 'π / 2 radians', '3π / 2 radians'],
        correctAnswer: 'π radians',
        explanation: '180° corresponds to half a circle, which equals π radians (360° = 2π rad).',
      },
      {
        id: 'qt-3',
        type: 'true-false',
        question: 'The Pythagorean identity states that sin²(θ) + cos²(θ) = 1 for any real angle θ.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True. Derived directly from the equation of the unit circle x² + y² = 1 where x = cos(θ) and y = sin(θ).',
      },
      {
        id: 'qt-4',
        type: 'mcq',
        question: 'What is the exact value of sin(30°) or sin(π/6 rad)?',
        options: ['0.5 (1/2)', '√2 / 2', '√3 / 2', '1.0'],
        correctAnswer: '0.5 (1/2)',
        explanation: 'In a 30-60-90 right triangle, the side opposite the 30° angle is exactly half the hypotenuse: sin(30°) = 1/2 = 0.5.',
      },
      {
        id: 'qt-5',
        type: 'multiple-select',
        question: 'Select all angles θ where sin(θ) = 0:',
        options: ['0° (0 rad)', '180° (π rad)', '360° (2π rad)', '90° (π/2 rad)'],
        correctAnswer: ['0° (0 rad)', '180° (π rad)', '360° (2π rad)'],
        explanation: 'sin(θ) = 0 wherever the point lies on the horizontal x-axis (0, π, 2π, etc.). At 90°, sin(90°) = 1.',
      }
    ]
  }
];

export const INITIAL_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'code-1',
    title: 'Sum of Two Numbers',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Read two integers a and b separated by a space and output their sum.',
    inputFormat: 'Two space-separated integers a and b.',
    outputFormat: 'A single integer representing a + b.',
    exampleInput: '5 10',
    exampleOutput: '15',
    starterCode: {
      python: `# Calculate sum of two numbers\nimport sys\n\ndef solve():\n    line = sys.stdin.read().strip()\n    if not line: return\n    a, b = map(int, line.split())\n    print(a + b)\n\nsolve()`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nif (input) {\n    const [a, b] = input.split(/\\s+/).map(Number);\n    console.log(a + b);\n}`,
      c: `#include <stdio.h>\nint main() {\n    long long a, b;\n    if (scanf("%lld %lld", &a, &b) == 2) {\n        printf("%lld\\n", a + b);\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long a, b;\n    if (cin >> a >> b) {\n        cout << (a + b) << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long a = sc.nextLong();\n            long b = sc.nextLong();\n            System.out.println(a + b);\n        }\n    }\n}`
    },
    testCases: [
      { input: '5 10', expectedOutput: '15', isPublic: true },
      { input: '100 250', expectedOutput: '350', isPublic: true },
      { input: '-7 12', expectedOutput: '5', isPublic: false },
      { input: '0 0', expectedOutput: '0', isPublic: false }
    ],
    hint: 'Split the input string by whitespace, convert each token into an integer, and print their addition.',
    solutionExplanation: 'Using standard I/O, parse the two tokens into integer variables a and b, then print a + b.',
    solvedCount: 1420
  },
  {
    id: 'code-2',
    title: 'Even or Odd Number Checker',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Determine whether a given integer n is "Even" or "Odd".',
    inputFormat: 'A single integer n.',
    outputFormat: 'Print "Even" if the number is divisible by 2, otherwise print "Odd".',
    exampleInput: '8',
    exampleOutput: 'Even',
    starterCode: {
      python: `import sys\n\ndef check_even_odd():\n    n = int(sys.stdin.read().strip())\n    # Your logic here\n    if n % 2 == 0:\n        print("Even")\n    else:\n        print("Odd")\n\ncheck_even_odd()`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync('/dev/stdin', 'utf-8').trim(), 10);\nconsole.log(n % 2 === 0 ? "Even" : "Odd");`,
      c: `#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    printf("%s\\n", (n % 2 == 0) ? "Even" : "Odd");\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    cout << ((n % 2 == 0) ? "Even" : "Odd") << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(n % 2 == 0 ? "Even" : "Odd");\n    }\n}`
    },
    testCases: [
      { input: '8', expectedOutput: 'Even', isPublic: true },
      { input: '15', expectedOutput: 'Odd', isPublic: true },
      { input: '0', expectedOutput: 'Even', isPublic: false },
      { input: '-3', expectedOutput: 'Odd', isPublic: false }
    ],
    hint: 'Use the modulo operator (%) to test remainder when divided by 2.',
    solutionExplanation: 'An integer is even if and only if n % 2 == 0; otherwise it is odd.',
    solvedCount: 1250
  },
  {
    id: 'code-3',
    title: 'Calculate Factorial of N',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Compute the factorial of a non-negative integer n (n! = n × (n-1) × ... × 1). Note: 0! = 1.',
    inputFormat: 'A non-negative integer n (0 <= n <= 15).',
    outputFormat: 'Print the factorial value.',
    exampleInput: '5',
    exampleOutput: '120',
    starterCode: {
      python: `import sys\n\ndef factorial():\n    n = int(sys.stdin.read().strip())\n    ans = 1\n    for i in range(1, n + 1):\n        ans *= i\n    print(ans)\n\nfactorial()`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync('/dev/stdin', 'utf-8').trim(), 10);\nlet ans = 1;\nfor(let i=1; i<=n; i++) ans *= i;\nconsole.log(ans);`,
      c: `#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    long long ans = 1;\n    for(int i=1; i<=n; i++) ans *= i;\n    printf("%lld\\n", ans);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    long long ans = 1;\n    for(int i=1; i<=n; i++) ans *= i;\n    cout << ans << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long ans = 1;\n        for(int i=1; i<=n; i++) ans *= i;\n        System.out.println(ans);\n    }\n}`
    },
    testCases: [
      { input: '5', expectedOutput: '120', isPublic: true },
      { input: '0', expectedOutput: '1', isPublic: true },
      { input: '7', expectedOutput: '5040', isPublic: false },
      { input: '10', expectedOutput: '3628800', isPublic: false }
    ],
    hint: 'Initialize result = 1. Loop from 1 to n multiplying result at each step.',
    solutionExplanation: 'For n = 0, the loop does not run and correctly outputs 1. Otherwise it computes the product 1*2*...*n.',
    solvedCount: 980
  },
  {
    id: 'code-4',
    title: 'Reverse a String',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Read a string s and output the reversed string.',
    inputFormat: 'A single line containing string s.',
    outputFormat: 'Print the reversed string.',
    exampleInput: 'science',
    exampleOutput: 'ecneics',
    starterCode: {
      python: `import sys\ns = sys.stdin.read().strip()\nprint(s[::-1])`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nconsole.log(s.split('').reverse().join(''));`,
      c: `#include <stdio.h>\n#include <string.h>\nint main() {\n    char s[1000];\n    if (scanf("%s", s) == 1) {\n        int len = strlen(s);\n        for(int i=len-1; i>=0; i--) putchar(s[i]);\n        putchar('\\n');\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        reverse(s.begin(), s.end());\n        cout << s << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            System.out.println(new StringBuilder(s).reverse().toString());\n        }\n    }\n}`
    },
    testCases: [
      { input: 'science', expectedOutput: 'ecneics', isPublic: true },
      { input: 'palghar', expectedOutput: 'rahglap', isPublic: true },
      { input: 'stem', expectedOutput: 'mets', isPublic: false },
      { input: 'racecar', expectedOutput: 'racecar', isPublic: false }
    ],
    hint: 'In Python, string slicing s[::-1] provides an instant reversal.',
    solutionExplanation: 'Using Python slice step -1 or two-pointer reversal swaps characters from outside in.',
    solvedCount: 1140
  },
  {
    id: 'code-5',
    title: 'Celsius to Fahrenheit Temperature Converter',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Given temperature in Celsius C, convert and output temperature in Fahrenheit rounded to 1 decimal place using formula: F = (C × 9/5) + 32.',
    inputFormat: 'A floating point number C.',
    outputFormat: 'Fahrenheit temperature rounded to 1 decimal place.',
    exampleInput: '25',
    exampleOutput: '77.0',
    starterCode: {
      python: `import sys\nc = float(sys.stdin.read().strip())\nf = (c * 9.0 / 5.0) + 32.0\nprint(f"{f:.1f}")`,
      javascript: `const fs = require('fs');\nconst c = parseFloat(fs.readFileSync('/dev/stdin', 'utf-8').trim());\nconst f = (c * 9 / 5) + 32;\nconsole.log(f.toFixed(1));`,
      c: `#include <stdio.h>\nint main() {\n    double c;\n    scanf("%lf", &c);\n    double f = (c * 9.0 / 5.0) + 32.0;\n    printf("%.1f\\n", f);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main() {\n    double c;\n    cin >> c;\n    double f = (c * 9.0 / 5.0) + 32.0;\n    cout << fixed << setprecision(1) << f << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double c = sc.nextDouble();\n        double f = (c * 9.0 / 5.0) + 32.0;\n        System.out.printf("%.1f\\n", f);\n    }\n}`
    },
    testCases: [
      { input: '25', expectedOutput: '77.0', isPublic: true },
      { input: '0', expectedOutput: '32.0', isPublic: true },
      { input: '100', expectedOutput: '212.0', isPublic: false },
      { input: '-40', expectedOutput: '-40.0', isPublic: false }
    ],
    hint: 'Multiply Celsius by 9/5 and add 32. Note that -40 is the same in both scales!',
    solutionExplanation: 'Standard conversion formula: F = (C * 9/5) + 32. Format with 1 decimal place.',
    solvedCount: 890
  },
  {
    id: 'code-6',
    title: 'Prime Number Checker',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Intermediate',
    language: 'python',
    description: 'Given an integer n (n >= 1), determine if it is a prime number. Output "Prime" or "Not Prime".',
    inputFormat: 'An integer n.',
    outputFormat: 'Print "Prime" or "Not Prime".',
    exampleInput: '17',
    exampleOutput: 'Prime',
    starterCode: {
      python: `import sys\nimport math\n\ndef is_prime(n):\n    if n <= 1:\n        return "Not Prime"\n    if n <= 3:\n        return "Prime"\n    if n % 2 == 0 or n % 3 == 0:\n        return "Not Prime"\n    i = 5\n    while i * i <= n:\n        if n % i == 0 or n % (i + 2) == 0:\n            return "Not Prime"\n        i += 6\n    return "Prime"\n\nn = int(sys.stdin.read().strip())\nprint(is_prime(n))`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync('/dev/stdin', 'utf-8').trim(), 10);\nfunction check(num){\n  if(num <= 1) return "Not Prime";\n  for(let i=2; i*i<=num; i++){\n    if(num % i === 0) return "Not Prime";\n  }\n  return "Prime";\n}\nconsole.log(check(n));`,
      c: `#include <stdio.h>\nint main() {\n    long long n;\n    scanf("%lld", &n);\n    if (n <= 1) { printf("Not Prime\\n"); return 0; }\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) { printf("Not Prime\\n"); return 0; }\n    }\n    printf("Prime\\n");\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long n;\n    cin >> n;\n    if (n <= 1) { cout << "Not Prime" << endl; return 0; }\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) { cout << "Not Prime" << endl; return 0; }\n    }\n    cout << "Prime" << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        if (n <= 1) { System.out.println("Not Prime"); return; }\n        for (long i = 2; i * i <= n; i++) {\n            if (n % i == 0) { System.out.println("Not Prime"); return; }\n        }\n        System.out.println("Prime");\n    }\n}`
    },
    testCases: [
      { input: '17', expectedOutput: 'Prime', isPublic: true },
      { input: '12', expectedOutput: 'Not Prime', isPublic: true },
      { input: '1', expectedOutput: 'Not Prime', isPublic: false },
      { input: '97', expectedOutput: 'Prime', isPublic: false }
    ],
    hint: 'Only check divisibility up to square root of n.',
    solutionExplanation: 'Numbers <= 1 are not prime. Test factors from 2 up to sqrt(n). If any factor divides n evenly, it is not prime.',
    solvedCount: 820
  },
  {
    id: 'code-7',
    title: 'Palindrome String Detector',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Check if an alphanumeric string reads the same backwards as forwards (case-insensitive). Print "YES" or "NO".',
    inputFormat: 'A single word string s.',
    outputFormat: 'Print "YES" if palindrome, otherwise "NO".',
    exampleInput: 'radar',
    exampleOutput: 'YES',
    starterCode: {
      python: `import sys\ns = sys.stdin.read().strip().lower()\nif s == s[::-1]:\n    print("YES")\nelse:\n    print("NO")`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync('/dev/stdin', 'utf-8').trim().toLowerCase();\nconsole.log(s === s.split('').reverse().join('') ? "YES" : "NO");`,
      c: `#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\nint main() {\n    char s[500];\n    if (scanf("%s", s) == 1) {\n        int l = 0, r = strlen(s) - 1;\n        int ok = 1;\n        while (l < r) {\n            if (tolower(s[l]) != tolower(s[r])) { ok = 0; break; }\n            l++; r--;\n        }\n        printf("%s\\n", ok ? "YES" : "NO");\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    if (cin >> s) {\n        for (auto &c : s) c = tolower(c);\n        string rev = s;\n        reverse(rev.begin(), rev.end());\n        cout << (s == rev ? "YES" : "NO") << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next().toLowerCase();\n            String rev = new StringBuilder(s).reverse().toString();\n            System.out.println(s.equals(rev) ? "YES" : "NO");\n        }\n    }\n}`
    },
    testCases: [
      { input: 'radar', expectedOutput: 'YES', isPublic: true },
      { input: 'college', expectedOutput: 'NO', isPublic: true },
      { input: 'Level', expectedOutput: 'YES', isPublic: false },
      { input: 'a', expectedOutput: 'YES', isPublic: false }
    ],
    hint: 'Convert string to lowercase and compare against its reverse.',
    solutionExplanation: 'A palindrome reads identically forwards and backwards.',
    solvedCount: 940
  },
  {
    id: 'code-8',
    title: 'Find Maximum in Array',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Given space-separated integers, output the maximum value.',
    inputFormat: 'A line of space-separated integers.',
    outputFormat: 'The single maximum integer.',
    exampleInput: '3 14 1 5 9 2',
    exampleOutput: '14',
    starterCode: {
      python: `import sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(max(nums))`,
      javascript: `const fs = require('fs');\nconst nums = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/).map(Number);\nconsole.log(Math.max(...nums));`,
      c: `#include <stdio.h>\nint main() {\n    long long val, mx;\n    if (scanf("%lld", &mx) == 1) {\n        while (scanf("%lld", &val) == 1) {\n            if (val > mx) mx = val;\n        }\n        printf("%lld\\n", mx);\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long val, mx;\n    if (cin >> mx) {\n        while (cin >> val) {\n            if (val > mx) mx = val;\n        }\n        cout << mx << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextLong()) {\n            long mx = sc.nextLong();\n            while (sc.hasNextLong()) {\n                long val = sc.nextLong();\n                if (val > mx) mx = val;\n            }\n            System.out.println(mx);\n        }\n    }\n}`
    },
    testCases: [
      { input: '3 14 1 5 9 2', expectedOutput: '14', isPublic: true },
      { input: '-10 -5 -20 -1', expectedOutput: '-1', isPublic: true },
      { input: '42', expectedOutput: '42', isPublic: false }
    ],
    hint: 'Initialize max with the first element and iterate through the rest.',
    solutionExplanation: 'Keep track of the largest element seen so far in a loop.',
    solvedCount: 760
  },
  {
    id: 'code-9',
    title: 'Sum of Array Elements',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Read an array of numbers and print the sum of all elements.',
    inputFormat: 'Space-separated integers.',
    outputFormat: 'Total integer sum.',
    exampleInput: '10 20 30 40',
    exampleOutput: '100',
    starterCode: {
      python: `import sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(sum(nums))`,
      javascript: `const fs = require('fs');\nconst nums = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/).map(Number);\nconsole.log(nums.reduce((a, b) => a + b, 0));`,
      c: `#include <stdio.h>\nint main() {\n    long long val, sum = 0;\n    while (scanf("%lld", &val) == 1) sum += val;\n    printf("%lld\\n", sum);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    long long val, sum = 0;\n    while (cin >> val) sum += val;\n    cout << sum << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long sum = 0;\n        while (sc.hasNextLong()) sum += sc.nextLong();\n        System.out.println(sum);\n    }\n}`
    },
    testCases: [
      { input: '10 20 30 40', expectedOutput: '100', isPublic: true },
      { input: '-5 5 10 -10', expectedOutput: '0', isPublic: true },
      { input: '7', expectedOutput: '7', isPublic: false }
    ],
    hint: 'Accumulate each number into a running total variable.',
    solutionExplanation: 'Sum all numbers in the collection and print.',
    solvedCount: 880
  },
  {
    id: 'code-10',
    title: 'N-th Fibonacci Number Generator',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Intermediate',
    language: 'python',
    description: 'Given n (0 <= n <= 30), find the n-th Fibonacci number. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).',
    inputFormat: 'A single non-negative integer n.',
    outputFormat: 'The n-th Fibonacci number.',
    exampleInput: '7',
    exampleOutput: '13',
    starterCode: {
      python: `import sys\n\ndef fib(n):\n    if n == 0: return 0\n    if n == 1: return 1\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\nn = int(sys.stdin.read().strip())\nprint(fib(n))`,
      javascript: `const fs = require('fs');\nconst n = parseInt(fs.readFileSync('/dev/stdin', 'utf-8').trim(), 10);\nlet a = 0, b = 1;\nif (n === 0) { console.log(0); } else {\n  for(let i=2; i<=n; i++) {\n    let c = a + b; a = b; b = c;\n  }\n  console.log(b);\n}`,
      c: `#include <stdio.h>\nint main() {\n    int n;\n    scanf("%d", &n);\n    if (n == 0) { printf("0\\n"); return 0; }\n    long long a = 0, b = 1;\n    for(int i=2; i<=n; i++) {\n        long long c = a + b;\n        a = b; b = c;\n    }\n    printf("%lld\\n", b);\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    if (n == 0) { cout << 0 << endl; return 0; }\n    long long a = 0, b = 1;\n    for(int i=2; i<=n; i++) {\n        long long c = a + b;\n        a = b; b = c;\n    }\n    cout << b << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        long a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            long c = a + b; a = b; b = c;\n        }\n        System.out.println(b);\n    }\n}`
    },
    testCases: [
      { input: '7', expectedOutput: '13', isPublic: true },
      { input: '0', expectedOutput: '0', isPublic: true },
      { input: '1', expectedOutput: '1', isPublic: true },
      { input: '12', expectedOutput: '144', isPublic: false }
    ],
    hint: 'Use iterative dynamic programming with two variables a and b to save time and memory.',
    solutionExplanation: 'Iteratively update a and b from 2 to n in O(n) time and O(1) space.',
    solvedCount: 650
  },
  {
    id: 'code-11',
    title: 'Binary String to Decimal Integer Converter',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Given a string representation of an unsigned binary number b, convert and output its equivalent base-10 decimal integer.',
    inputFormat: 'A binary string consisting only of "0" and "1".',
    outputFormat: 'Print the equivalent base-10 integer.',
    exampleInput: '1011',
    exampleOutput: '11',
    starterCode: {
      python: `import sys\nb = sys.stdin.read().strip()\nprint(int(b, 2))`,
      javascript: `const fs = require('fs');\nconst b = fs.readFileSync('/dev/stdin', 'utf-8').trim();\nconsole.log(parseInt(b, 2));`,
      c: `#include <stdio.h>\nint main() {\n    char b[65];\n    if (scanf("%s", b) == 1) {\n        long long ans = 0;\n        for (int i = 0; b[i]; i++) ans = (ans << 1) + (b[i] - '0');\n        printf("%lld\\n", ans);\n    }\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string b;\n    if (cin >> b) {\n        long long ans = 0;\n        for (char c : b) ans = (ans << 1) + (c - '0');\n        cout << ans << endl;\n    }\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String b = sc.next();\n            System.out.println(Long.parseLong(b, 2));\n        }\n    }\n}`
    },
    testCases: [
      { input: '1011', expectedOutput: '11', isPublic: true },
      { input: '11111111', expectedOutput: '255', isPublic: true },
      { input: '0', expectedOutput: '0', isPublic: false },
      { input: '1000000', expectedOutput: '64', isPublic: false }
    ],
    hint: 'Each bit represents 2^i starting from rightmost position (index 0). Or parse with base 2.',
    solutionExplanation: 'Multiply running accumulator by 2 and add each bit from left to right.',
    solvedCount: 520
  },
  {
    id: 'code-12',
    title: 'Count Vowels in a Text String',
    subject: 'technology',
    topic: 'Python & Algorithm Design',
    difficulty: 'Beginner',
    language: 'python',
    description: 'Given an alphanumeric string s, count how many English vowels (a, e, i, o, u, case-insensitive) appear in the text.',
    inputFormat: 'A string s.',
    outputFormat: 'An integer representing the total count of vowels.',
    exampleInput: 'Science Technology Engineering Math',
    exampleOutput: '11',
    starterCode: {
      python: `import sys\ns = sys.stdin.read()\nvowels = set("aeiouAEIOU")\nprint(sum(1 for c in s if c in vowels))`,
      javascript: `const fs = require('fs');\nconst s = fs.readFileSync('/dev/stdin', 'utf-8');\nconst count = (s.match(/[aeiou]/gi) || []).length;\nconsole.log(count);`,
      c: `#include <stdio.h>\n#include <ctype.h>\nint main() {\n    char ch; int count = 0;\n    while ((ch = getchar()) != EOF) {\n        char low = tolower(ch);\n        if (low == 'a' || low == 'e' || low == 'i' || low == 'o' || low == 'u') count++;\n    }\n    printf("%d\\n", count);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s; int count = 0;\n    while (getline(cin, s)) {\n        for (char c : s) {\n            char low = tolower(c);\n            if (low == 'a' || low == 'e' || low == 'i' || low == 'o' || low == 'u') count++;\n        }\n    }\n    cout << count << endl;\n    return 0;\n}`,
      java: `import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int count = 0;\n        while (sc.hasNextLine()) {\n            String s = sc.nextLine().toLowerCase();\n            for (char c : s.toCharArray()) {\n                if ("aeiou".indexOf(c) != -1) count++;\n            }\n        }\n        System.out.println(count);\n    }\n}`
    },
    testCases: [
      { input: 'Science Technology Engineering Math', expectedOutput: '11', isPublic: true },
      { input: 'rhythm', expectedOutput: '0', isPublic: true },
      { input: 'AEIOU aeiou', expectedOutput: '10', isPublic: false }
    ],
    hint: 'Iterate through characters and check membership in the set of vowels {a, e, i, o, u}.',
    solutionExplanation: 'Convert to lowercase and increment a counter whenever the character matches any vowel.',
    solvedCount: 710
  }
];

export const INITIAL_STEM_ACTIVITIES: STEMActivity[] = [
  {
    id: 'act-1',
    title: 'Build a Simple Electric Circuit & Switch',
    subject: 'engineering',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    objective: 'Construct a functional direct-current circuit with a battery, switch, resistor, and LED to observe current flow.',
    materials: [
      '1x 9V Battery or 2x 1.5V AA Batteries in holder',
      '1x Standard 5mm Light Emitting Diode (LED)',
      '1x 330 Ohm or 470 Ohm resistor',
      '3x Jumper wires or insulated copper wire',
      '1x Metal paperclip (for switch contact)'
    ],
    steps: [
      'Identify the long lead of the LED as positive (anode) and short lead as negative (cathode).',
      'Twist one end of the 330Ω resistor to the long positive anode lead of the LED.',
      'Connect the other end of the resistor to the positive (+) terminal of your battery using a wire.',
      'Connect a wire from the short cathode lead of the LED to one end of a metal paperclip switch.',
      'Touch the loose end of the paperclip to the negative (-) battery terminal.',
      'Observe the LED illuminate when the paperclip completes the circuit loop.'
    ],
    safetyNotes: [
      'Never connect an LED directly to a 9V battery without a current-limiting resistor—it will burst or overheat.',
      'Do not allow bare wires connecting (+) and (-) terminals to touch each other directly (short circuit).'
    ],
    observationGuide: 'Notice what happens when you disconnect the paperclip. Does the light extinguish immediately? What happens if you add a second resistor in series?',
    scientificResult: 'Electricity requires an unbroken closed loop. The resistor impedes the flow of electrons according to Ohm’s Law (I = V/R), protecting the delicate semiconductor junction inside the LED.',
    published: true
  },
  {
    id: 'act-2',
    title: 'The Citrus Cell: Making a Lemon Battery',
    subject: 'science',
    difficulty: 'Beginner',
    estimatedTime: '25 mins',
    objective: 'Generate real electrical voltage from chemical oxidation-reduction reactions using lemon juice electrolyte.',
    materials: [
      '2 to 3 Fresh juicy lemons',
      'Copper coins or copper wire strips (positive electrode)',
      'Galvanized zinc nails or screws (negative electrode)',
      'Alligator clip connecting wires',
      'Small digital voltmeter or low-voltage LCD watch'
    ],
    steps: [
      'Roll each lemon firmly on a table with your palm to break internal juice vesicles.',
      'Carefully insert one copper coin and one galvanized zinc nail about 3 cm apart in the first lemon.',
      'Use alligator clips to connect the copper electrode of lemon 1 to the zinc electrode of lemon 2 (series connection).',
      'Attach voltmeter leads to the free copper coin on one end and the free zinc nail on the other.',
      'Read the voltage reading on your multimeter.'
    ],
    safetyNotes: [
      'Do not consume the lemons after inserting metal electrodes.',
      'Wash hands thoroughly after handling galvanized zinc nails.'
    ],
    observationGuide: 'A single lemon produces roughly 0.8 to 0.9 Volts. Connecting 3 lemons in series will yield approximately 2.5 Volts, enough to power a small digital clock display.',
    scientificResult: 'The citric acid acts as an electrolyte. Zinc oxidizes releasing electrons (Zn → Zn²⁺ + 2e⁻), which travel through the external wire to the copper electrode where hydrogen ions are reduced.',
    published: true
  },
  {
    id: 'act-3',
    title: 'Baking Soda & Vinegar: Gas Pressure Volcano Experiment',
    subject: 'science',
    difficulty: 'Beginner',
    estimatedTime: '15 mins',
    objective: 'Demonstrate an acid-base neutralization reaction generating Carbon Dioxide (CO2) gas and kinetic pressure.',
    materials: [
      '2 tablespoons of Baking Soda (Sodium Bicarbonate, NaHCO3)',
      '50 ml of White Vinegar (Dilute Acetic Acid, CH3COOH)',
      'A few drops of red food coloring or dish soap',
      'Empty 250ml plastic bottle or flask',
      'Plastic tray or basin to catch overflow'
    ],
    steps: [
      'Place the empty bottle upright in the center of the plastic basin.',
      'Add 2 tablespoons of baking soda into the bottle using a paper funnel.',
      'Mix food coloring and a drop of dish soap with 50 ml of vinegar in a separate cup.',
      'Quickly pour the colored vinegar mixture into the bottle and step back.',
      'Watch the rapid effervescent foam cascade out of the bottle neck.'
    ],
    safetyNotes: [
      'Wear safety spectacles or eyeglasses to protect eyes from vinegar splashes.',
      'Do not cap or seal the bottle tightly during the reaction as expanding gas could rupture the container.'
    ],
    observationGuide: 'Notice the immediate fizzing sound and the cooler temperature of the bottle (an endothermic reaction!).',
    scientificResult: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂(g). The rapid creation of CO₂ gas creates bubbling pressure, enhanced by dish soap into dense foam.',
    published: true
  },
  {
    id: 'act-4',
    title: 'DIY CD Spectroscope: Deconstructing Light Waves',
    subject: 'science',
    difficulty: 'Intermediate',
    estimatedTime: '30 mins',
    objective: 'Build a handheld optical diffraction spectroscope to split sunlight, fluorescent light, and LED light into visible spectral lines.',
    materials: [
      '1x Old blank CD or DVD (serves as a diffraction grating)',
      '1x Cardboard tube or small rectangular cardboard box',
      'Black construction paper or opaque tape',
      'Utility craft knife or scissors',
      'Ruler and pencil'
    ],
    steps: [
      'Cut a narrow 0.5 mm vertical entrance slit into one end of your cardboard tube using tape and black paper.',
      'At the opposite end, cut a viewing hole at approximately 30° to 45° angle.',
      'Carefully peel off the reflective metallic backing of a CD scrap, or use the shiny data surface directly.',
      'Secure the CD fragment over the viewing aperture angled toward the slit.',
      'Point the narrow slit toward a room light (never look directly at the Sun!) and look through the viewing hole.'
    ],
    safetyNotes: [
      'NEVER point your spectroscope directly at the intense midday sun to protect eyesight.',
      'Exercise caution when cutting cardboard with craft blades.'
    ],
    observationGuide: 'Compare sunlight (continuous rainbow spectrum) with fluorescent tube lights (distinct bright emission lines of mercury vapor!).',
    scientificResult: 'The microscopic tracks of a CD act as a diffraction grating (thousands of lines per millimeter), scattering different wavelengths of light at different angles (d sin θ = mλ).',
    published: true
  },
  {
    id: 'act-5',
    title: 'Water Surface Tension & Surfactant Detergent Experiment',
    subject: 'science',
    difficulty: 'Beginner',
    estimatedTime: '10 mins',
    objective: 'Investigate intermolecular hydrogen bonding in water and witness how surfactants disrupt surface tension.',
    materials: [
      'Shallow dinner plate or wide bowl',
      'Water',
      'Ground black pepper powder',
      'Liquid dish soap or hand detergent',
      'Cotton swab or toothpick'
    ],
    steps: [
      'Pour water into the plate until it covers the bottom about 1 cm deep.',
      'Generously sprinkle black pepper evenly across the entire water surface. Notice how the pepper flakes float.',
      'Touch the center of the water with a clean, dry fingertip. Observe that nothing happens.',
      'Dip the tip of a cotton swab into a drop of dish soap.',
      'Gently touch the soap-coated swab to the exact center of the peppered plate.',
      'Watch the pepper flakes instantaneously shoot outward to the plate rim!'
    ],
    safetyNotes: [
      'Avoid touching your eyes with pepper-coated fingers.'
    ],
    observationGuide: 'Notice how rapidly the pepper scatters. Try repeating immediately without changing the water—why does it not work a second time?',
    scientificResult: 'Water molecules have strong cohesive hydrogen bonds creating high surface tension. Soap molecules are amphiphilic surfactants that weaken hydrogen bonds; the surrounding intact tension pulls the water and floating pepper outward.',
    published: true
  }
];

export const INITIAL_CHALLENGES: STEMChallenge[] = [
  {
    id: 'chal-1',
    title: 'The Mystery Quadratic Equation',
    category: 'mathematics',
    type: 'equation',
    description: 'A projectile lands at x = 6 meters and reaches its maximum height of 9 meters at x = 3 meters. Find the equation of its parabolic flight!',
    xpReward: 150,
    badgeRewardId: 'badge-math-master',
    timeSeconds: 180,
    challengeData: {
      question: 'Given roots at x=0, x=6 and vertex at (3,9), what is the quadratic equation?',
      options: ['y = -x² + 6x', 'y = x² - 6x', 'y = -2x² + 12x', 'y = -0.5x² + 3x'],
      correctAnswer: 'y = -x² + 6x',
      hint: 'Vertex form: y = a(x - h)² + k. With (h,k)=(3,9), test (0,0): 0 = a(0-3)² + 9 → 9a = -9 → a = -1.'
    }
  },
  {
    id: 'chal-2',
    title: 'Fix the Lunar Lander Trajectory',
    category: 'science',
    type: 'trajectory',
    description: 'A probe on the Moon (gravity = 1.62 m/s²) must hit a landing target 100 meters away with an initial speed of 15 m/s. What launch angle is needed?',
    xpReward: 180,
    badgeRewardId: 'badge-first-explorer',
    timeSeconds: 240,
    challengeData: {
      question: 'Range formula R = (v² · sin(2θ)) / g. If R = 100m, v = 15m/s, g = 1.62m/s², solve for θ:',
      options: ['23°', '45°', '30°', '60°'],
      correctAnswer: '23°',
      hint: 'sin(2θ) = (R · g) / v² = (100 · 1.62) / 225 = 162 / 225 = 0.72. 2θ ≈ 46° → θ ≈ 23°.'
    }
  },
  {
    id: 'chal-3',
    title: 'Circuit Emergency: Save the Microchip',
    category: 'engineering',
    type: 'circuit',
    description: 'You have a 12V supply and a sensitive LED sensor rated for maximum 20mA (0.02A) at 2V forward drop. What minimum resistor value must you install?',
    xpReward: 160,
    badgeRewardId: 'badge-circuit-builder',
    timeSeconds: 150,
    challengeData: {
      question: 'Voltage across resistor V_R = 12V - 2V = 10V. Required R = V_R / I_max:',
      options: ['500 Ω', '100 Ω', '250 Ω', '1000 Ω'],
      correctAnswer: '500 Ω',
      hint: 'R = (12 - 2) / 0.02 = 10 / 0.02 = 500 Ohms.'
    }
  },
  {
    id: 'chal-4',
    title: 'Identify the Mystery Molecule',
    category: 'science',
    type: 'molecule',
    description: 'An unknown neutral molecule contains 1 Carbon atom, 4 Hydrogen atoms, and is the primary component of natural gas.',
    xpReward: 120,
    badgeRewardId: 'badge-science-explorer',
    challengeData: {
      question: 'What is this molecule?',
      options: ['Methane (CH4)', 'Ethane (C2H6)', 'Carbon Dioxide (CO2)', 'Water (H2O)'],
      correctAnswer: 'Methane (CH4)',
      hint: 'Chemical formula CH₄ consists of a central carbon with 4 single covalent bonds.'
    }
  },
  {
    id: 'chal-5',
    title: 'Debug the Off-by-One Loop Bug',
    category: 'technology',
    type: 'debug',
    description: 'A junior programmer wanted to print numbers 1 to 5 inclusive using Python range(1, 5). Find the bug!',
    xpReward: 140,
    badgeRewardId: 'badge-code-starter',
    challengeData: {
      question: 'Why does range(1, 5) stop at 4?',
      options: [
        'The stop parameter in range(start, stop) is exclusive, so use range(1, 6)',
        'Python loops always decrement by 1',
        'Range only accepts one argument',
        'Syntax error in range'
      ],
      correctAnswer: 'The stop parameter in range(start, stop) is exclusive, so use range(1, 6)',
      hint: 'range(start, stop) generates numbers up to stop - 1.'
    }
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-explorer',
    title: 'First Explorer',
    description: 'Launched and completed your first interactive STEM simulation.',
    icon: 'Compass',
    category: 'simulation',
    xpThreshold: 50
  },
  {
    id: 'badge-code-starter',
    title: 'Code Starter',
    description: 'Submitted and passed your first automated coding lab challenge.',
    icon: 'Code',
    category: 'coding',
    xpThreshold: 100
  },
  {
    id: 'badge-science-explorer',
    title: 'Science Explorer',
    description: 'Completed 5 science video lessons and simulation modules.',
    icon: 'Atom',
    category: 'general',
    xpThreshold: 300
  },
  {
    id: 'badge-math-master',
    title: 'Math Master',
    description: 'Scored 85%+ in advanced mathematics quadratic & trigonometry quizzes.',
    icon: 'Calculator',
    category: 'quiz',
    xpThreshold: 450
  },
  {
    id: 'badge-circuit-builder',
    title: 'Circuit Builder',
    description: 'Constructed working circuits and solved Ohm’s Law challenges.',
    icon: 'Zap',
    category: 'simulation',
    xpThreshold: 200
  },
  {
    id: 'badge-streak-champion',
    title: '7-Day Streak',
    description: 'Maintained a consecutive 7-day STEM daily learning streak.',
    icon: 'Flame',
    category: 'streak',
    xpThreshold: 500
  },
  {
    id: 'badge-quiz-champion',
    title: 'Quiz Champion',
    description: 'Achieved a perfect 100% score on 3 consecutive quizzes.',
    icon: 'Award',
    category: 'quiz',
    xpThreshold: 350
  },
  {
    id: 'badge-lab-innovator',
    title: 'Lab Innovator',
    description: 'Completed 3 hands-on practical STEM DIY experiments.',
    icon: 'Beaker',
    category: 'general',
    xpThreshold: 250
  }
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-physics-beginner',
    title: 'Physics Foundations: From Motion to Forces',
    subject: 'science',
    difficulty: 'Beginner',
    description: 'A step-by-step master path covering speed, velocity vectors, acceleration, kinematics, Newton’s laws, and projectile trajectory simulation.',
    estimatedHours: 6,
    items: [
      { id: 'pi-1', title: 'Video: Understanding Velocity and Acceleration', type: 'video', referenceId: 'vid-1', completed: true },
      { id: 'pi-2', title: 'Quiz: Motion & Kinematics Mastery', type: 'quiz', referenceId: 'quiz-motion', completed: true },
      { id: 'pi-3', title: 'Simulation: Projectile Motion Lab', type: 'simulation', referenceId: 'sim-projectile', completed: true },
      { id: 'pi-4', title: 'Video: Newton’s Three Laws of Motion', type: 'video', referenceId: 'vid-2', completed: false },
      { id: 'pi-5', title: 'Quiz: Newtonian Dynamics', type: 'quiz', referenceId: 'quiz-newton', completed: false },
      { id: 'pi-6', title: 'Challenge: Fix the Lunar Lander Trajectory', type: 'activity', referenceId: 'chal-2', completed: false }
    ]
  },
  {
    id: 'path-python-starter',
    title: 'Computer Science: Python Programming Sprint',
    subject: 'technology',
    difficulty: 'Beginner',
    description: 'Learn the fundamentals of computational thinking, variables, flow control, arrays, and standard algorithm problem solving.',
    estimatedHours: 8,
    items: [
      { id: 'py-1', title: 'Video: Algorithmic Thinking with Python', type: 'video', referenceId: 'vid-7', completed: true },
      { id: 'py-2', title: 'Quiz: Python Core Syntax', type: 'quiz', referenceId: 'quiz-python', completed: true },
      { id: 'py-3', title: 'Coding Lab: Sum of Two Numbers', type: 'coding', referenceId: 'code-1', completed: true },
      { id: 'py-4', title: 'Coding Lab: Even or Odd Checker', type: 'coding', referenceId: 'code-2', completed: false },
      { id: 'py-5', title: 'Coding Lab: Calculate Factorial of N', type: 'coding', referenceId: 'code-3', completed: false },
      { id: 'py-6', title: 'Challenge: Debug the Off-by-One Loop Bug', type: 'activity', referenceId: 'chal-5', completed: false }
    ]
  },
  {
    id: 'path-electronics-circuits',
    title: 'Applied Engineering: Electronics & Circuit Design',
    subject: 'engineering',
    difficulty: 'Beginner',
    description: 'From Ohm’s Law and schematic diagrams to breadboard wiring, LED current limiting, and robotic actuator control.',
    estimatedHours: 7,
    items: [
      { id: 'ec-1', title: 'Video: Ohm’s Law & Electric Circuits', type: 'video', referenceId: 'vid-9', completed: true },
      { id: 'ec-2', title: 'Simulation: Interactive Circuit Builder', type: 'simulation', referenceId: 'sim-circuit', completed: true },
      { id: 'ec-3', title: 'Quiz: Ohm’s Law & Electronics', type: 'quiz', referenceId: 'quiz-circuits', completed: false },
      { id: 'ec-4', title: 'Activity: Build a Simple Electric Circuit & Switch', type: 'activity', referenceId: 'act-1', completed: false },
      { id: 'ec-5', title: 'Simulation: 2-Link Robotic Arm Kinematics', type: 'simulation', referenceId: 'sim-robotics', completed: false }
    ]
  },
  {
    id: 'path-math-quadratics',
    title: 'Algebra to Calculus: Functions & Visual Geometry',
    subject: 'mathematics',
    difficulty: 'Intermediate',
    description: 'Master parabolic graphs, vertex identification, quadratic equations, and unit circle trigonometric identities.',
    estimatedHours: 5,
    items: [
      { id: 'mq-1', title: 'Video: Visualizing Quadratic Functions & Parabolic Curves', type: 'video', referenceId: 'vid-5', completed: true },
      { id: 'mq-2', title: 'Simulation: 2D Interactive Function Grapher', type: 'simulation', referenceId: 'sim-grapher', completed: true },
      { id: 'mq-3', title: 'Quiz: Quadratic Functions & Graphs', type: 'quiz', referenceId: 'quiz-quadratics', completed: false },
      { id: 'mq-4', title: 'Video: Trigonometry & The Magic of the Unit Circle', type: 'video', referenceId: 'vid-6', completed: false },
      { id: 'mq-5', title: 'Quiz: Trigonometric Ratios and Identities', type: 'quiz', referenceId: 'quiz-trig', completed: false },
      { id: 'mq-6', title: 'Challenge: The Mystery Quadratic Equation', type: 'activity', referenceId: 'chal-1', completed: false }
    ]
  }
];

export const INITIAL_RESOURCES: FreeResource[] = [
  {
    id: 'res-1',
    title: 'PhET Interactive Simulations',
    category: 'Simulations',
    description: 'Free interactive physics, chemistry, biology, earth science, and math simulations founded by Nobel Laureate Carl Wieman at University of Colorado Boulder.',
    url: 'https://phet.colorado.edu',
    provider: 'University of Colorado Boulder',
    tags: ['Physics', 'Chemistry', 'Interactive', 'Free Open Source'],
    isFeatured: true
  },
  {
    id: 'res-2',
    title: 'GeoGebra Dynamic Mathematics Suite',
    category: 'Learning Tools',
    description: 'Free digital tools for graphing, geometry, 3D math, algebra, probability statistics, and CAS calculations.',
    url: 'https://www.geogebra.org',
    provider: 'GeoGebra Organization',
    tags: ['Math', 'Geometry', 'Graphing', 'Calculators'],
    isFeatured: true
  },
  {
    id: 'res-3',
    title: 'Desmos Graphing Calculator & Math Tools',
    category: 'Learning Tools',
    description: 'A fast, intuitive, and accessible graphing calculator that plots coordinates, functions, and dynamic sliders directly in the browser.',
    url: 'https://www.desmos.com',
    provider: 'Desmos Studio',
    tags: ['Graphing', 'Calculus', 'Algebra', 'Accessibility'],
    isFeatured: true
  },
  {
    id: 'res-4',
    title: 'Autodesk Tinkercad Circuits & 3D Design',
    category: 'Simulations',
    description: 'Free, easy-to-use web app for 3D modeling, Arduino microcontrollers, and electronic circuit simulation with breadboards and code blocks.',
    url: 'https://www.tinkercad.com',
    provider: 'Autodesk',
    tags: ['Circuits', 'Arduino', '3D Design', 'Engineering'],
    isFeatured: true
  },
  {
    id: 'res-5',
    title: 'ChemCollective Virtual Chemistry Laboratory',
    category: 'Simulations',
    description: 'Online chemistry experiments, scenario-based learning activities, and virtual reagents where students can mix chemicals and measure molarity.',
    url: 'http://chemcollective.org',
    provider: 'Carnegie Mellon University',
    tags: ['Chemistry', 'Virtual Lab', 'Titration', 'Stoichiometry']
  },
  {
    id: 'res-6',
    title: 'NASA Eyes on the Solar System & Exoplanets',
    category: 'STEM Websites',
    description: 'A free 3D interactive simulator exploring planets, moons, asteroids, and real-time NASA spacecraft trajectories across the cosmos.',
    url: 'https://eyes.nasa.gov',
    provider: 'NASA Jet Propulsion Laboratory',
    tags: ['Space', 'Astronomy', '3D Solar System', 'Spacecraft'],
    isFeatured: true
  },
  {
    id: 'res-7',
    title: 'CS Circles: Free Interactive Python Course',
    category: 'Practice Resources',
    description: 'An open-access web platform with interactive coding exercises and auto-graded feedback for beginners learning Python.',
    url: 'https://cscircles.cemc.uwaterloo.ca',
    provider: 'University of Waterloo (CEMC)',
    tags: ['Python', 'Computer Science', 'Tutorials', 'Auto-grader']
  },
  {
    id: 'res-8',
    title: 'Khan Academy Free STEM Library',
    category: 'Reference Material',
    description: 'World-class, completely free courses covering K-12 and collegiate mathematics, physics, biology, organic chemistry, and computing.',
    url: 'https://www.khanacademy.org',
    provider: 'Khan Academy',
    tags: ['Comprehensive', 'Video Library', 'Exercises', 'Free Forever']
  },
  {
    id: 'res-9',
    title: 'Scratch Coding Community for Learners',
    category: 'Practice Resources',
    description: 'Free visual block-based programming environment developed by the MIT Media Lab for creating interactive stories, games, and animations.',
    url: 'https://scratch.mit.edu',
    provider: 'MIT Media Lab',
    tags: ['Coding', 'Block Programming', 'Creativity', 'Kids 10-15']
  },
  {
    id: 'res-10',
    title: 'MIT OpenCourseWare: Free High School & College STEM',
    category: 'Reference Material',
    description: 'Unrestricted open publication of virtually all MIT course content, including lecture notes, exams, problem sets, and lab videos.',
    url: 'https://ocw.mit.edu',
    provider: 'Massachusetts Institute of Technology',
    tags: ['Advanced STEM', 'Lecture Notes', 'Exams', 'Open Access']
  }
];

export const INITIAL_DEMO_STUDENTS: StudentProfile[] = [
  {
    id: 'std-1',
    name: 'Aarav Patil',
    email: 'aarav.patil@palghar.edu',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    ageGroup: '13-15',
    grade: 'Grade 9',
    schoolName: 'Palghar High School',
    xp: 680,
    streakDays: 6,
    completedLessons: ['vid-1', 'vid-2', 'vid-3'],
    completedVideos: ['vid-1', 'vid-2', 'vid-3'],
    completedSimulations: ['sim-projectile', 'sim-circuit'],
    solvedProblems: ['code-1', 'code-2'],
    completedCoding: ['code-1', 'code-2'],
    completedActivities: ['act-1'],
    badges: ['badge-first-explorer', 'badge-code-starter', 'badge-circuit-builder'],
    quizScores: { 'quiz-motion': 80, 'quiz-circuits': 100 },
    subjectMastery: { science: 75, mathematics: 80, technology: 70, engineering: 65 },
    quizAttempts: [
      {
        id: 'qa-101',
        quizId: 'quiz-motion',
        quizTitle: 'Physics Mastery: Velocity, Speed & Acceleration',
        subject: 'science',
        score: 4,
        totalQuestions: 5,
        percentage: 80,
        completedAt: '2026-09-18',
        answers: {}
      },
      {
        id: 'qa-102',
        quizId: 'quiz-circuits',
        quizTitle: 'Engineering: Ohm’s Law & Electronic Circuits',
        subject: 'engineering',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        completedAt: '2026-09-19',
        answers: {}
      }
    ],
    codingSubmissions: [
      {
        id: 'sub-101',
        problemId: 'code-1',
        language: 'python',
        code: 'import sys\nprint(sum(map(int, sys.stdin.read().split())))',
        status: 'Accepted',
        passedCases: 4,
        totalCases: 4,
        submittedAt: '2026-09-18'
      }
    ],
    level: 3,
    joinedDate: '2026-09-01',
    active: true
  },
  {
    id: 'std-2',
    name: 'Diya Sharma',
    email: 'diya.sharma@palghar.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    ageGroup: '16-18',
    grade: 'Junior College (FYJC)',
    schoolName: 'SDES Junior College, Palghar',
    xp: 940,
    streakDays: 12,
    completedLessons: ['vid-1', 'vid-3', 'vid-5', 'vid-7'],
    completedVideos: ['vid-1', 'vid-3', 'vid-5', 'vid-7'],
    completedSimulations: ['sim-projectile', 'sim-grapher', 'sim-atom'],
    solvedProblems: ['code-1', 'code-2', 'code-3', 'code-6'],
    completedCoding: ['code-1', 'code-2', 'code-3', 'code-6'],
    completedActivities: ['act-1', 'act-2'],
    badges: ['badge-first-explorer', 'badge-code-starter', 'badge-math-master', 'badge-science-explorer'],
    quizScores: { 'quiz-quadratics': 100 },
    subjectMastery: { science: 90, mathematics: 95, technology: 85, engineering: 75 },
    quizAttempts: [
      {
        id: 'qa-201',
        quizId: 'quiz-quadratics',
        quizTitle: 'Algebra: Quadratic Functions & Graphs',
        subject: 'mathematics',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        completedAt: '2026-09-17',
        answers: {}
      }
    ],
    codingSubmissions: [],
    level: 4,
    joinedDate: '2026-08-25',
    active: true
  },
  {
    id: 'std-3',
    name: 'Rohan Mehra',
    email: 'rohan.m@palghar.edu',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    ageGroup: '10-12',
    grade: 'Grade 6',
    schoolName: 'V.S. Apte Secondary School',
    xp: 410,
    streakDays: 3,
    completedLessons: ['vid-4', 'vid-8'],
    completedVideos: ['vid-4', 'vid-8'],
    completedSimulations: ['sim-cell'],
    solvedProblems: ['code-1'],
    completedCoding: ['code-1'],
    completedActivities: ['act-3'],
    badges: ['badge-first-explorer'],
    quizScores: { 'quiz-cell': 100 },
    subjectMastery: { science: 70, mathematics: 65, technology: 60, engineering: 50 },
    quizAttempts: [
      {
        id: 'qa-301',
        quizId: 'quiz-cell',
        quizTitle: 'Cell Biology: Organelles and Cellular Machinery',
        subject: 'science',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        completedAt: '2026-09-19',
        answers: {}
      }
    ],
    codingSubmissions: [],
    level: 2,
    joinedDate: '2026-09-10',
    active: true
  },
  {
    id: 'std-4',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@palghar.edu',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    ageGroup: '16-18',
    grade: 'Junior College (SYJC)',
    schoolName: 'SDES Junior College of Science',
    xp: 1250,
    streakDays: 14,
    completedLessons: ['vid-1', 'vid-2', 'vid-5', 'vid-6', 'vid-7', 'vid-9'],
    completedVideos: ['vid-1', 'vid-2', 'vid-5', 'vid-6', 'vid-7', 'vid-9'],
    completedSimulations: ['sim-projectile', 'sim-grapher', 'sim-circuit', 'sim-robotics'],
    solvedProblems: ['code-1', 'code-2', 'code-3', 'code-4', 'code-5'],
    completedCoding: ['code-1', 'code-2', 'code-3', 'code-4', 'code-5'],
    completedActivities: ['act-1', 'act-4'],
    badges: ['badge-first-explorer', 'badge-code-starter', 'badge-circuit-builder', 'badge-streak-champion', 'badge-quiz-champion'],
    quizScores: { 'quiz-motion': 100, 'quiz-circuits': 100 },
    subjectMastery: { science: 95, mathematics: 90, technology: 90, engineering: 85 },
    quizAttempts: [],
    codingSubmissions: [],
    level: 5,
    joinedDate: '2026-08-15',
    active: true
  }
];

export const BADGES_LIST = INITIAL_BADGES;
export const DEMO_STUDENTS = INITIAL_DEMO_STUDENTS;

export const PROJECT_DETAILS = {
  title: 'STEM EDUCATION SUPPORT USING FREE DIGITAL TOOLS',
  institution: "Sonopant Dandekar Shikshan Mandali's Sonopant Dandekar Arts, V.S. Apte Commerce and M.H. Mehta Science College, Palghar",
  shortInstitution: 'SDES Arts, Commerce & Science College, Palghar',
  department: 'Department of Information Technology',
  projectType: 'Community Engagement Project (Research & Digital Learning Initiative)',
  objective: 'To democratize quality STEM education for rural and semi-urban school and junior-college students through open-access digital tools, interactive visual simulations, video explanations, practical experiments, and real-time coding exercises.',
  methodology: 'Needs assessment survey of students aged 10-18+ regarding digital tool availability, conceptual difficulties in Science and Mathematics, device access, and learning preferences, transformed into a holistic interactive platform.',
  motto: 'Learn → Explore → Practice → Test → Improve'
};
