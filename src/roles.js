// ============================================================================
// PRODUCTIVEDUDE — Role System Configuration
// Defines every supported life role, its unique feature panels, onboarding
// goals, dock apps, accent color, and starter seed data.
// ============================================================================

const d = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

const nowStr = () => new Date().toISOString().split('T')[0];

const uid = (prefix = 'r') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// ----------------------------------------------------------------------------
// Generic list panel builder helpers
// ----------------------------------------------------------------------------
const mkList = (prefix, items) => items.map((it, i) => ({ id: uid(`${prefix}-${i}`), done: false, ...it }));

export const ROLES = [
  {
    id: 'student',
    name: 'Student',
    emoji: '🎓',
    icon: 'school',
    accent: '#2563eb',
    tagline: 'Master your syllabus, pass exams, and level up your GPA.',
    desc: 'Syllabus velocity hub, exam countdown, GPA tracking, and focused study-session logging.',
    goals: [
      'Complete syllabus units on time',
      'Score 90%+ on the next exam',
      'Build a daily study routine',
      'Maintain a 3.5+ GPA',
      'Hand every assignment in early'
    ],
    dockApps: ['dashboard', 'calendar', 'academic', 'habits', 'capture', 'pomodoro'],
    features: [
      {
        id: 'study-sessions',
        title: 'Study Sessions',
        icon: 'psychology',
        type: 'list',
        color: 'primary',
        desc: 'Log focused study blocks and hours invested per subject.',
        fields: [
          { key: 'text', label: 'Subject / Topic', type: 'text' },
          { key: 'hours', label: 'Hours', type: 'number' },
          { key: 'date', label: 'Date', type: 'date' }
        ],
        defaultNew: { hours: 1 }
      },
      {
        id: 'assignments',
        title: 'Assignment Tracker',
        icon: 'assignment',
        type: 'list',
        color: 'secondary',
        desc: 'Track homework, projects and their deadlines.',
        fields: [
          { key: 'text', label: 'Assignment', type: 'text' },
          { key: 'subject', label: 'Subject', type: 'text' },
          { key: 'date', label: 'Due date', type: 'date' }
        ]
      },
      {
        id: 'revision',
        title: 'Revision Queue',
        icon: 'refresh',
        type: 'kanban',
        color: 'tertiary',
        desc: 'Move topics from "to revise" all the way to "revised".',
        columns: ['To revise', 'Revising', 'Revised']
      },
      {
        id: 'mock-scores',
        title: 'Mock Test Scores',
        icon: 'emoji_events',
        type: 'counters',
        color: 'primary',
        desc: 'Track daily practice-test accuracy percentage.',
        counterLabel: 'Accuracy',
        unit: '%',
        target: 90
      }
    ],
    seed: () => ({
      'study-sessions': mkList('study', [
        { text: 'Calculus — Partial derivatives deep dive', hours: 2, date: d(0) },
        { text: 'Physics — Dirac notation practice', hours: 1.5, date: d(0) },
        { text: 'Literature — Essay draft outline', hours: 1, date: d(1) }
      ]),
      assignments: mkList('assn', [
        { text: 'Problem set 7', subject: 'Math 301', date: d(2) },
        { text: 'Lab report — Optics', subject: 'Physics 202', date: d(4) },
        { text: 'History paper first draft', subject: 'Hist 110', date: d(6) }
      ]),
      revision: [
        { id: uid('rev'), title: 'Green’s theorem & Stokes', status: 0 },
        { id: uid('rev'), title: 'Quantum measurement postulates', status: 1 },
        { id: uid('rev'), title: 'Integration by parts', status: 2 }
      ],
      'mock-scores': { [nowStr()]: 82 }
    })
  },

  {
    id: 'teacher',
    name: 'Teacher',
    emoji: '🍎',
    icon: 'co_present',
    accent: '#059669',
    tagline: 'Plan lessons, grade papers, and manage your classrooms.',
    desc: 'Lesson planner, class schedules, a gradebook, and homework assignment tracking.',
    goals: [
      'Plan engaging lesson plans',
      'Grade papers within 48 hours',
      'Give every student clear feedback',
      'Hit curriculum milestones on time',
      'Keep classroom admin organized'
    ],
    dockApps: ['dashboard', 'calendar', 'habits', 'capture', 'pomodoro'],
    features: [
      {
        id: 'lessons',
        title: 'Lesson Planner',
        icon: 'menu_book',
        type: 'list',
        color: 'primary',
        desc: 'Plan your upcoming lessons, topics and materials.',
        fields: [
          { key: 'text', label: 'Lesson topic', type: 'text' },
          { key: 'subject', label: 'Subject', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'time', label: 'Time', type: 'time' }
        ]
      },
      {
        id: 'gradebook',
        title: 'Gradebook',
        icon: 'scoreboard',
        type: 'list',
        color: 'secondary',
        desc: 'Log student scores per assignment and subject.',
        fields: [
          { key: 'text', label: 'Student', type: 'text' },
          { key: 'subject', label: 'Subject', type: 'text' },
          { key: 'score', label: 'Score', type: 'number' },
          { key: 'max', label: 'Out of', type: 'number' }
        ],
        defaultNew: { max: 100 }
      },
      {
        id: 'homework',
        title: 'Homework Board',
        icon: 'home_work',
        type: 'list',
        color: 'tertiary',
        desc: 'Assign and track homework across your classes.',
        fields: [
          { key: 'text', label: 'Homework', type: 'text' },
          { key: 'subject', label: 'Class', type: 'text' },
          { key: 'date', label: 'Due date', type: 'date' }
        ]
      },
      {
        id: 'curriculum',
        title: 'Curriculum Milestones',
        icon: 'flag',
        type: 'kanban',
        color: 'primary',
        desc: 'Track units as you move through the curriculum.',
        columns: ['Upcoming', 'Teaching', 'Taught']
      }
    ],
    seed: () => ({
      lessons: mkList('lesson', [
        { text: 'Quadratic equations — factoring review', subject: 'Algebra II', date: d(0), time: '09:00' },
        { text: 'Photosynthesis lab intro', subject: 'Biology', date: d(1), time: '11:00' },
        { text: 'Romeo & Juliet — Act 3 analysis', subject: 'English', date: d(2), time: '13:00' }
      ]),
      gradebook: mkList('grade', [
        { text: 'Maya Johnson', subject: 'Algebra II', score: 92, max: 100 },
        { text: 'Ethan Park', subject: 'Algebra II', score: 78, max: 100 },
        { text: 'Lina Cruz', subject: 'Biology', score: 88, max: 100 }
      ]),
      homework: mkList('hw', [
        { text: 'Worksheet 4.2 — factoring', subject: 'Algebra II', date: d(1) },
        { text: 'Lab safety quiz', subject: 'Biology', date: d(2) }
      ]),
      curriculum: [
        { id: uid('curr'), title: 'Unit 4 — Exponents', status: 0 },
        { id: uid('curr'), title: 'Unit 3 — Polynomials', status: 1 },
        { id: uid('curr'), title: 'Unit 2 — Linear systems', status: 2 }
      ]
    })
  },

  {
    id: 'developer',
    name: 'Developer',
    emoji: '💻',
    icon: 'code',
    accent: '#7c3aed',
    tagline: 'Ship features, log commits, and keep your skills sharp.',
    desc: 'Sprint boards, commit logs, learning goals, and deep-focus coding sessions.',
    goals: [
      'Ship one feature per week',
      'Write meaningful commits daily',
      'Learn one new concept weekly',
      'Keep the backlog under control',
      'Protect deep-work focus blocks'
    ],
    dockApps: ['dashboard', 'calendar', 'capture', 'terminal', 'habits', 'pomodoro'],
    features: [
      {
        id: 'sprints',
        title: 'Sprint Board',
        icon: 'task_alt',
        type: 'kanban',
        color: 'primary',
        desc: 'Move tickets from backlog to done.',
        columns: ['Backlog', 'In progress', 'Done']
      },
      {
        id: 'commits',
        title: 'Commit Streak Log',
        icon: 'push_pin',
        type: 'list',
        color: 'secondary',
        desc: 'Log daily commits and the repos you touched.',
        fields: [
          { key: 'text', label: 'Commit message', type: 'text' },
          { key: 'repo', label: 'Repo', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' }
        ]
      },
      {
        id: 'learning',
        title: 'Learning Goals',
        icon: 'school',
        type: 'list',
        color: 'tertiary',
        desc: 'Concepts and technologies you want to master.',
        fields: [
          { key: 'text', label: 'Concept', type: 'text' },
          { key: 'date', label: 'Target date', type: 'date' }
        ]
      },
      {
        id: 'shipping-days',
        title: 'Shipping Streak',
        icon: 'rocket_launch',
        type: 'counters',
        color: 'primary',
        desc: 'Track feature/commit velocity each day.',
        counterLabel: 'Commits',
        unit: 'commits',
        target: 3
      }
    ],
    seed: () => ({
      sprints: [
        { id: uid('sprint'), title: 'Add auth flow to API', status: 0 },
        { id: uid('sprint'), title: 'Refactor billing service', status: 0 },
        { id: uid('sprint'), title: 'Dark mode toggle', status: 1 },
        { id: uid('sprint'), title: 'Fix onboarding NPE', status: 2 }
      ],
      commits: mkList('commit', [
        { text: 'feat: add role-based dashboard widgets', repo: 'productive-dude', date: d(0) },
        { text: 'fix: resolve window snap bounds', repo: 'productive-dude', date: d(0) },
        { text: 'chore: bump vite to 8', repo: 'site', date: d(-1) }
      ]),
      learning: mkList('learn', [
        { text: 'WebAssembly fundamentals', date: d(14) },
        { text: 'Postgres window functions', date: d(21) }
      ]),
      'shipping-days': { [nowStr()]: 3 }
    })
  },

  {
    id: 'designer',
    name: 'Designer',
    emoji: '🎨',
    icon: 'palette',
    accent: '#ea580c',
    tagline: 'Run projects, collect assets, and iterate on feedback.',
    desc: 'Project pipelines, asset libraries, feedback logs, and moodboard inspiration.',
    goals: [
      'Ship polished designs on schedule',
      'Keep one source of truth for assets',
      'Turn feedback into revisions fast',
      'Build a personal inspiration bank',
      'Protect creative flow time'
    ],
    dockApps: ['dashboard', 'calendar', 'capture', 'habits', 'pomodoro'],
    features: [
      {
        id: 'projects',
        title: 'Project Pipeline',
        icon: 'design_services',
        type: 'kanban',
        color: 'primary',
        desc: 'Move design projects from brief to shipped.',
        columns: ['Brief', 'In progress', 'Shipped']
      },
      {
        id: 'assets',
        title: 'Asset Library',
        icon: 'collections',
        type: 'list',
        color: 'secondary',
        desc: 'Log fonts, icons, colors and files you reuse.',
        fields: [
          { key: 'text', label: 'Asset name', type: 'text' },
          { key: 'kind', label: 'Type', type: 'text' },
          { key: 'date', label: 'Added', type: 'date' }
        ]
      },
      {
        id: 'feedback',
        title: 'Feedback Log',
        icon: 'rate_review',
        type: 'list',
        color: 'tertiary',
        desc: 'Track client/peer feedback and revision status.',
        fields: [
          { key: 'text', label: 'Feedback', type: 'text' },
          { key: 'project', label: 'Project', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' }
        ]
      },
      {
        id: 'inspiration',
        title: 'Inspiration Bank',
        icon: 'lightbulb',
        type: 'counters',
        color: 'primary',
        desc: 'Collect references every single day.',
        counterLabel: 'References',
        unit: 'items',
        target: 5
      }
    ],
    seed: () => ({
      projects: [
        { id: uid('proj'), title: 'Mobile app redesign', status: 0 },
        { id: uid('proj'), title: 'Brand refresh — logo suite', status: 1 },
        { id: uid('proj'), title: 'Landing page hero system', status: 2 }
      ],
      assets: mkList('asset', [
        { text: 'Inter Variable', kind: 'Font', date: d(0) },
        { text: 'Material Symbols Outlined', kind: 'Icon set', date: d(0) },
        { text: 'Soft shadows style guide', kind: 'Token', date: d(-2) }
      ]),
      feedback: mkList('fb', [
        { text: 'Increase button contrast on mobile', project: 'Mobile app', date: d(0) },
        { text: 'Soften the hero gradient', project: 'Landing page', date: d(-1) }
      ]),
      inspiration: { [nowStr()]: 4 }
    })
  },

  {
    id: 'creator',
    name: 'Creator',
    emoji: '🎬',
    icon: 'videocam',
    accent: '#dc2626',
    tagline: 'Plan content, hit uploads, and grow your audience.',
    desc: 'Content calendars, upload pipeline, idea bank, and audience growth tracking.',
    goals: [
      'Post on a consistent schedule',
      'Ship 1 long-form piece weekly',
      'Turn ideas into scripts fast',
      'Grow followers every month',
      'Improve engagement week over week'
    ],
    dockApps: ['dashboard', 'calendar', 'capture', 'habits', 'pomodoro'],
    features: [
      {
        id: 'content',
        title: 'Content Calendar',
        icon: 'calendar_view_week',
        type: 'list',
        color: 'primary',
        desc: 'Plan posts, videos and live streams.',
        fields: [
          { key: 'text', label: 'Content', type: 'text' },
          { key: 'platform', label: 'Platform', type: 'text' },
          { key: 'date', label: 'Publish date', type: 'date' }
        ]
      },
      {
        id: 'pipeline',
        title: 'Upload Pipeline',
        icon: 'upload',
        type: 'kanban',
        color: 'secondary',
        desc: 'Ideas → scripting → editing → published.',
        columns: ['Idea', 'Scripting', 'Editing', 'Published']
      },
      {
        id: 'ideas',
        title: 'Idea Vault',
        icon: 'idea',
        type: 'list',
        color: 'tertiary',
        desc: 'Bank every content idea that strikes.',
        fields: [
          { key: 'text', label: 'Idea', type: 'text' },
          { key: 'platform', label: 'Platform', type: 'text' }
        ]
      },
      {
        id: 'audience',
        title: 'Audience Growth',
        icon: 'trending_up',
        type: 'counters',
        color: 'primary',
        desc: 'Log daily subscriber count and momentum.',
        counterLabel: 'Subscribers',
        unit: 'subs',
        target: 10
      }
    ],
    seed: () => ({
      content: mkList('content', [
        { text: '“7 Productivity Myths Debunked”', platform: 'YouTube', date: d(1) },
        { text: 'Weekly studio vlog', platform: 'TikTok', date: d(2) },
        { text: 'Newsletter #12', platform: 'Newsletter', date: d(4) }
      ]),
      pipeline: [
        { id: uid('pip'), title: 'How I plan my week', status: 0 },
        { id: uid('pip'), title: 'Desk setup tour', status: 1 },
        { id: uid('pip'), title: 'Study with me — lofi', status: 2 },
        { id: uid('pip'), title: 'App I can’t live without', status: 3 }
      ],
      ideas: mkList('idea', [
        { text: 'Day in the life — freelancer', platform: 'YouTube' },
        { text: '5 apps under $10', platform: 'TikTok' }
      ]),
      audience: { [nowStr()]: 8 }
    })
  },

  {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    icon: 'edit_note',
    accent: '#be185d',
    tagline: 'Hit word counts, finish chapters, and publish consistently.',
    desc: 'Daily word targets, chapter progress, article queue, and writing-sprint logs.',
    goals: [
      'Hit daily word count every day',
      'Finish the current draft',
      'Publish one piece weekly',
      'Build a daily writing habit',
      'Outline before drafting'
    ],
    dockApps: ['dashboard', 'calendar', 'capture', 'habits', 'pomodoro'],
    features: [
      {
        id: 'word-target',
        title: 'Daily Word Target',
        icon: 'text_fields',
        type: 'counters',
        color: 'primary',
        desc: 'Track words written each day.',
        counterLabel: 'Words',
        unit: 'words',
        target: 1000
      },
      {
        id: 'chapters',
        title: 'Chapters',
        icon: 'menu_book',
        type: 'list',
        color: 'secondary',
        desc: 'Track manuscript chapters and their word counts.',
        fields: [
          { key: 'text', label: 'Chapter', type: 'text' },
          { key: 'words', label: 'Words', type: 'number' },
          { key: 'date', label: 'Revised', type: 'date' }
        ]
      },
      {
        id: 'articles',
        title: 'Article Queue',
        icon: 'article',
        type: 'list',
        color: 'tertiary',
        desc: 'Plan and publish articles and essays.',
        fields: [
          { key: 'text', label: 'Article', type: 'text' },
          { key: 'outlet', label: 'Outlet', type: 'text' },
          { key: 'date', label: 'Deadline', type: 'date' }
        ]
      },
      {
        id: 'drafts',
        title: 'Draft Pipeline',
        icon: 'history_edu',
        type: 'kanban',
        color: 'primary',
        desc: 'Move pieces from outline to published.',
        columns: ['Outline', 'Draft', 'Edited', 'Published']
      }
    ],
    seed: () => ({
      'word-target': { [nowStr()]: 650 },
      chapters: mkList('chap', [
        { text: 'Chapter 1 — The Spark', words: 4800, date: d(0) },
        { text: 'Chapter 2 — The Fall', words: 3900, date: d(0) },
        { text: 'Chapter 3 — The Climb', words: 1200, date: d(1) }
      ]),
      articles: mkList('art', [
        { text: 'Why routines beat motivation', outlet: 'Substack', date: d(2) },
        { text: 'A defense of slow mornings', outlet: 'Medium', date: d(5) }
      ]),
      drafts: [
        { id: uid('dr'), title: 'Essay: the power of blank space', status: 0 },
        { id: uid('dr'), title: 'Short story — Terminal Light', status: 1 },
        { id: uid('dr'), title: 'Poem collection draft', status: 2 },
        { id: uid('dr'), title: 'Newsletter: focus economics', status: 3 }
      ]
    })
  },

  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    emoji: '🚀',
    icon: 'rocket_launch',
    accent: '#0d9488',
    tagline: 'Grow revenue, ship milestones, and close leads.',
    desc: 'Revenue tracking, product roadmap, lead pipeline, and startup metrics.',
    goals: [
      'Grow monthly revenue',
      'Ship the next milestone',
      'Fill the pipeline with leads',
      'Keep runway tracking honest',
      'Focus on one priority per week'
    ],
    dockApps: ['dashboard', 'calendar', 'capture', 'habits', 'pomodoro', 'analytics'],
    features: [
      {
        id: 'revenue',
        title: 'Revenue Tracker',
        icon: 'account_balance_wallet',
        type: 'counters',
        color: 'primary',
        desc: 'Log daily revenue in your base currency.',
        counterLabel: 'Revenue',
        unit: '$',
        target: 500
      },
      {
        id: 'roadmap',
        title: 'Product Roadmap',
        icon: 'map',
        type: 'kanban',
        color: 'secondary',
        desc: 'Move milestones from queue to shipped.',
        columns: ['Queue', 'Building', 'Shipped']
      },
      {
        id: 'leads',
        title: 'Lead Pipeline',
        icon: 'group',
        type: 'list',
        color: 'tertiary',
        desc: 'Track prospects, their stage and deal value.',
        fields: [
          { key: 'text', label: 'Lead / Company', type: 'text' },
          { key: 'stage', label: 'Stage', type: 'text' },
          { key: 'value', label: 'Value', type: 'number' },
          { key: 'date', label: 'Next touch', type: 'date' }
        ],
        defaultNew: { value: 0 }
      },
      {
        id: 'metrics',
        title: 'Weekly Metric Check',
        icon: 'monitoring',
        type: 'list',
        color: 'primary',
        desc: 'Snapshots of the numbers that matter.',
        fields: [
          { key: 'text', label: 'Metric', type: 'text' },
          { key: 'value', label: 'Value', type: 'number' },
          { key: 'date', label: 'Week of', type: 'date' }
        ]
      }
    ],
    seed: () => ({
      revenue: { [nowStr()]: 320 },
      roadmap: [
        { id: uid('rm'), title: 'Multi-currency support', status: 0 },
        { id: uid('rm'), title: 'Team seats + permissions', status: 1 },
        { id: uid('rm'), title: 'Public API v1', status: 2 }
      ],
      leads: mkList('lead', [
        { text: 'Acme Corp', stage: 'Discovery', value: 2400, date: d(1) },
        { text: 'Brightwave Labs', stage: 'Proposal', value: 5800, date: d(3) },
        { text: 'Nimbus Studio', stage: 'Negotiation', value: 12000, date: d(2) }
      ]),
      metrics: mkList('metric', [
        { text: 'MRR', value: 4200, date: d(0) },
        { text: 'Active users', value: 1380, date: d(0) }
      ])
    })
  },

  {
    id: 'health',
    name: 'Health & Fitness',
    emoji: '💪',
    icon: 'fitness_center',
    accent: '#16a34a',
    tagline: 'Train, hydrate, sleep, and recover like an athlete.',
    desc: 'Workout logs, water and nutrition counters, sleep tracking, and recovery scores.',
    goals: [
      'Work out 5 days a week',
      'Hit daily water target',
      'Sleep 7+ hours nightly',
      'Improve recovery score',
      'Log every session honestly'
    ],
    dockApps: ['dashboard', 'calendar', 'habits', 'capture', 'pomodoro'],
    features: [
      {
        id: 'water',
        title: 'Hydration',
        icon: 'water_drop',
        type: 'counters',
        color: 'primary',
        desc: 'Log liters of water each day.',
        counterLabel: 'Water',
        unit: 'L',
        target: 2.5
      },
      {
        id: 'workouts',
        title: 'Workout Log',
        icon: 'fitness_center',
        type: 'list',
        color: 'secondary',
        desc: 'Log every session — exercise, sets and duration.',
        fields: [
          { key: 'text', label: 'Workout', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'duration', label: 'Minutes', type: 'number' },
          { key: 'date', label: 'Date', type: 'date' }
        ],
        defaultNew: { duration: 45 }
      },
      {
        id: 'sleep',
        title: 'Sleep Log',
        icon: 'bedtime',
        type: 'list',
        color: 'tertiary',
        desc: 'Track sleep hours and quality notes.',
        fields: [
          { key: 'hours', label: 'Hours slept', type: 'number' },
          { key: 'text', label: 'Note', type: 'text' },
          { key: 'date', label: 'Date', type: 'date' }
        ],
        defaultNew: { hours: 7 }
      },
      {
        id: 'recovery',
        title: 'Recovery Score',
        icon: 'monitor_heart',
        type: 'counters',
        color: 'secondary',
        desc: 'Log your daily recovery / energy score.',
        counterLabel: 'Recovery',
        unit: '/10',
        target: 7
      }
    ],
    seed: () => ({
      water: { [nowStr()]: 1.5 },
      workouts: mkList('wk', [
        { text: 'Upper body — push day', type: 'Strength', duration: 55, date: d(0) },
        { text: 'Zone 2 incline walk', type: 'Cardio', duration: 40, date: d(0) },
        { text: 'Mobility + stretching', type: 'Recovery', duration: 25, date: d(1) }
      ]),
      sleep: mkList('sl', [
        { hours: 7.5, text: 'Solid night', date: d(-1) },
        { hours: 6, text: 'Late work session', date: d(-2) }
      ]),
      recovery: { [nowStr()]: 6 }
    })
  }
];

// ----------------------------------------------------------------------------
// App meta registry (used for the dock + window titles)
// ----------------------------------------------------------------------------
export const APP_META = {
  rolehub: { title: 'Role Hub', icon: 'workspaces', label: 'Role Hub' },
  pomodoro: { title: 'Focus Timer', icon: 'timer', label: 'Focus Timer' },
  analytics: { title: 'Analytics', icon: 'monitoring', label: 'Analytics' },
  notes: { title: 'Notes', icon: 'sticky_note_2', label: 'Notes' },
  goals: { title: 'Goals', icon: 'flag', label: 'Goals' },
  music: { title: 'Music', icon: 'music_note', label: 'Music' }
};

// ----------------------------------------------------------------------------
// Wallpapers (bundled stock imagery)
// ----------------------------------------------------------------------------
export const WALLPAPERS = [
  { id: 'wall-1', name: 'Tidal Drift', path: '/wallpapers/wall-1.jpg' },
  { id: 'wall-2', name: 'Paper Light', path: '/wallpapers/wall-2.jpg' },
  { id: 'wall-3', name: 'Calm Peaks', path: '/wallpapers/wall-3.jpg' },
  { id: 'wall-4', name: 'Mono Still', path: '/wallpapers/wall-4.jpg' },
  { id: 'wall-5', name: 'Quiet Dunes', path: '/wallpapers/wall-5.jpg' },
  { id: 'wall-6', name: 'Forest Haze', path: '/wallpapers/wall-6.jpg' }
];

export const getWallpaper = (id) => WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0];

// ----------------------------------------------------------------------------
// Profile helpers
// ----------------------------------------------------------------------------
export const DEFAULT_PROFILE = {
  name: 'User',
  primaryRole: 'student',
  secondaryRoles: [],
  goals: [],
  wakeTime: '06:30',
  focusWindow: 'Morning',
  workload: 'medium',
  theme: 'focus-blue',
  isDark: true,
  wallpaper: 'wall-1',
  onboarded: false
};

export const buildEmptyRoleData = () =>
  ROLES.reduce((acc, role) => {
    acc[role.id] = {};
    role.features.forEach(f => {
      acc[role.id][f.id] = f.type === 'counters' ? {} : [];
    });
    return acc;
  }, {});

export const seedRoleData = (roles) => {
  const base = buildEmptyRoleData();
  roles.forEach(roleId => {
    const role = ROLES.find(r => r.id === roleId);
    if (role && role.seed) {
      base[roleId] = { ...base[roleId], ...role.seed() };
    }
  });
  return base;
};

export const getRole = (id) => ROLES.find(r => r.id === id) || ROLES[0];

// ----------------------------------------------------------------------------
// Onboarding wizard steps (declarative)
// ----------------------------------------------------------------------------
export const FOCUS_WINDOWS = ['Morning', 'Afternoon', 'Evening', 'Late Night', 'Flexible'];
export const WORKLOADS = [
  { id: 'light', label: 'Light', desc: '1–2 key tasks per day, lots of buffer' },
  { id: 'medium', label: 'Balanced', desc: '3–5 meaningful tasks per day' },
  { id: 'heavy', label: 'Intense', desc: '6+ tasks, packed schedule, sprint mode' }
];

export const THEME_PRESETS = [
  { id: 'focus-blue', name: 'Ocean Blue', accent: '#2563eb' },
  { id: 'theme-forest-green', name: 'Forest Green', accent: '#16a34a' },
  { id: 'theme-sunset-orange', name: 'Ember Orange', accent: '#ea580c' },
  { id: 'theme-royal-purple', name: 'Royal Purple', accent: '#7c3aed' },
  { id: 'theme-sweet-rose', name: 'Rose Petal', accent: '#e11d48' },
  { id: 'theme-teal', name: 'Lagoon Teal', accent: '#0d9488' }
];
