/* =============================================
   WebnWell Roadmap — Data
   ============================================= */

window.ROADMAP_DATA = {
  'vibe-coding': {
    id: 'vibe-coding',
    icon: '⚡',
    title: 'Vibe Coding',
    heroTitle: 'Build with AI-Powered Development',
    description: 'All apps built using vibe coding — AI-assisted, rapidly iterated, and continuously evolving.',
    colors: ['#6366f1', '#a78bfa'],
    projects: [
      {
        id: 'mgt-system',
        name: 'Management System',
        icon: '📊',
        url: 'mgt.webnwell.com',
        phases: [
          {
            title: 'Core Platform',
            timeline: 'Completed',
            milestones: [
              { name: 'Task management module', desc: 'Full CRUD with subtasks, descriptions, live timer, and "Currently Working On" feature.', status: 'done', tags: ['core'] },
              { name: 'Goals & milestones', desc: 'Goal tracking with milestone timelines, inline editing, and SVG progress visualization.', status: 'done', tags: ['core'] },
              { name: 'Cooking & family SOP', desc: 'AI-powered cooking planner and family SOP modules with Gemini function calling.', status: 'done', tags: ['ai'] },
              { name: 'Supplies inventory', desc: 'Emergency supplies tracker with FIFO stock management and consumption logging.', status: 'done', tags: ['module'] },
            ],
          },
          {
            title: 'Mobile & UX',
            timeline: 'In Progress',
            milestones: [
              { name: 'Mobile-first responsive design', desc: 'Full responsive audit at 390px/375px — touch targets, safe areas, hamburger menu.', status: 'done', tags: ['mobile', 'priority'] },
              { name: 'PWA optimization', desc: 'Installable PWA with offline support, app icons, and native-like experience.', status: 'active', tags: ['pwa'] },
              { name: 'Dark/light theme toggle', desc: 'System-aware theme switching with smooth transitions.', status: 'upcoming', tags: ['ux'] },
            ],
          },
          {
            title: 'Advanced Features',
            timeline: 'Planned',
            milestones: [
              { name: 'Dashboard analytics', desc: 'Cross-module dashboard with productivity metrics, habit streaks, and trend charts.', status: 'upcoming', tags: ['analytics'] },
              { name: 'Notification system', desc: 'Push notifications for deadlines, low stock alerts, and goal reminders.', status: 'upcoming', tags: ['feature'] },
              { name: 'Multi-user support', desc: 'Family member accounts with shared modules and individual task views.', status: 'upcoming', tags: ['collab'] },
            ],
          },
        ],
      },
      {
        id: 'google-ads',
        name: 'Google Ads Optimizer',
        icon: '📈',
        url: 'app.webnwell.com',
        phases: [
          {
            title: 'Core Engine',
            timeline: 'Completed',
            milestones: [
              { name: 'Campaign management dashboard', desc: 'Full Google Ads API integration with account monitoring, change history, and deep mirroring.', status: 'done', tags: ['core'] },
              { name: 'AI intent analysis', desc: 'GPT-4o-mini powered search term classification with batch caching.', status: 'done', tags: ['ai'] },
              { name: 'Negative keyword management', desc: 'Smart conflict detection, bulk operations, and automated cleanup.', status: 'done', tags: ['optimization'] },
              { name: 'Perfect caching architecture', desc: 'Multi-layer caching — server API TTLs, AI batch cache, SWR client cache.', status: 'done', tags: ['performance'] },
            ],
          },
          {
            title: 'Automation Engine',
            timeline: 'In Progress',
            milestones: [
              { name: 'Google Sheets sync', desc: 'Bidirectional campaign sync with incremental updates and data cleanup.', status: 'done', tags: ['automation'] },
              { name: 'Keyword research pipeline', desc: 'Automated keyword research with location-specific matching and Keyword Planner integration.', status: 'active', tags: ['automation', 'priority'] },
              { name: 'Auto-publish with exemptions', desc: 'Automated ad publishing handling soft policy violations via auto-exemption.', status: 'active', tags: ['automation'] },
              { name: 'Conversion tracking wizard', desc: '6-step guided setup for Google Ads conversion tracking with verification.', status: 'done', tags: ['feature'] },
            ],
          },
          {
            title: 'Scale & Intelligence',
            timeline: 'Planned',
            milestones: [
              { name: 'Performance predictions', desc: 'ML-based bid and budget recommendations using historical performance data.', status: 'upcoming', tags: ['ai'] },
              { name: 'Competitor analysis', desc: 'Auction insights integration with market position tracking and alerts.', status: 'upcoming', tags: ['analytics'] },
              { name: 'White-label client portal', desc: 'Client-facing dashboards with branded reports and automated email summaries.', status: 'upcoming', tags: ['scale'] },
            ],
          },
        ],
      },
      {
        id: 'meeting-app',
        name: 'Meeting Room',
        icon: '🎙️',
        url: 'meeting.webnwell.com',
        phases: [
          {
            title: 'Core Platform',
            timeline: 'Completed',
            milestones: [
              { name: 'Real-time voice meetings', desc: 'WebSocket-based voice meetings with Whisper STT and GPT-4o responses.', status: 'done', tags: ['core'] },
              { name: 'Meeting transcription', desc: 'Live transcription with speaker identification and searchable history.', status: 'done', tags: ['ai'] },
              { name: 'Admin dashboard', desc: 'Meeting management, settings, and usage analytics.', status: 'done', tags: ['admin'] },
            ],
          },
          {
            title: 'Enhancements',
            timeline: 'Planned',
            milestones: [
              { name: 'Multi-participant rooms', desc: 'Support multiple speakers in a single meeting room with turn management.', status: 'upcoming', tags: ['feature'] },
              { name: 'Meeting summaries', desc: 'AI-generated meeting notes, action items, and follow-up reminders.', status: 'upcoming', tags: ['ai', 'priority'] },
              { name: 'Calendar integration', desc: 'Sync with Google Calendar for scheduled meetings and reminders.', status: 'upcoming', tags: ['integration'] },
            ],
          },
        ],
      },
      {
        id: 'docs-site',
        name: 'Documentation',
        icon: '📚',
        url: 'docs.webnwell.com',
        phases: [
          {
            title: 'Content & Design',
            timeline: 'Completed',
            milestones: [
              { name: 'Client-facing documentation portal', desc: 'Zero-dependency SPA with page-based content system and search.', status: 'done', tags: ['core'] },
              { name: 'FAQ & access guides', desc: 'Warm, non-technical language for platform access, setup, and troubleshooting.', status: 'done', tags: ['content'] },
              { name: 'Responsive design', desc: 'Mobile-optimized layout with clean typography and navigation.', status: 'done', tags: ['mobile'] },
            ],
          },
          {
            title: 'Expansion',
            timeline: 'Planned',
            milestones: [
              { name: 'Video tutorials', desc: 'Embedded walkthrough videos for complex setup processes.', status: 'upcoming', tags: ['content'] },
              { name: 'AI search assistant', desc: 'Natural language search powered by document embeddings.', status: 'upcoming', tags: ['ai'] },
            ],
          },
        ],
      },
      {
        id: 'roadmap-app',
        name: 'Roadmap Dashboard',
        icon: '🗺️',
        url: 'roadmap.webnwell.com',
        phases: [
          {
            title: 'Core Dashboard',
            timeline: 'Completed',
            milestones: [
              { name: 'Multi-roadmap switcher', desc: '4 roadmaps with animated tab switching and ambient background effects.', status: 'done', tags: ['core'] },
              { name: 'Progress visualization', desc: 'Circular progress ring, phase-level progress bars, and stat cards.', status: 'done', tags: ['ux'] },
              { name: 'Inline editing', desc: 'Contenteditable milestones, status toggle dropdown, add/delete controls.', status: 'done', tags: ['feature'] },
              { name: 'Auth & persistence', desc: 'Token-based login, server-side JSON storage, public read-only mode.', status: 'done', tags: ['security'] },
            ],
          },
          {
            title: 'Enhancements',
            timeline: 'In Progress',
            milestones: [
              { name: 'Sub-project navigation', desc: 'Nested project picker within roadmap categories for multi-app workflows.', status: 'active', tags: ['feature', 'priority'] },
              { name: 'Drag-and-drop reordering', desc: 'Reorder milestones and phases via drag-and-drop.', status: 'upcoming', tags: ['ux'] },
              { name: 'Timeline view', desc: 'Gantt-style horizontal timeline visualization alongside the card view.', status: 'upcoming', tags: ['feature'] },
            ],
          },
        ],
      },
      {
        id: 'creation-upload',
        name: 'Creation & Upload',
        icon: '📤',
        url: 'creation.webnwell.com',
        phases: [
          {
            title: 'Initial Phase',
            timeline: 'Planned',
            milestones: [
              { name: 'Define scope', desc: 'Define requirements for content creation and upload workflows.', status: 'upcoming', tags: ['planning'] }
            ],
          },
        ],
      },
    ],
  },

  'production': {
    id: 'production',
    icon: '🏭',
    title: 'Production Process Automation',
    heroTitle: 'Automate Every Production Workflow',
    description: 'Streamline manufacturing, quality control, and supply chain processes with intelligent automation — from order intake to delivery.',
    colors: ['#f97316', '#fbbf24'],
    phases: [
      {
        title: 'Process Mapping & Analysis',
        timeline: 'Month 1',
        milestones: [
          {
            name: 'Current workflow documentation',
            desc: 'Map every production step end-to-end — identify bottlenecks, manual steps, and dependencies.',
            status: 'done',
            tags: ['analysis'],
          },
          {
            name: 'Automation opportunity scoring',
            desc: 'Score each process by automation potential, ROI, and implementation complexity.',
            status: 'done',
            tags: ['strategy', 'priority'],
          },
          {
            name: 'Tool & platform selection',
            desc: 'Evaluate and select automation platforms — Google Apps Script, Zapier, custom Node.js services.',
            status: 'done',
            tags: ['infra'],
          },
        ],
      },
      {
        title: 'Core Automation Build',
        timeline: 'Month 2–3',
        milestones: [
          {
            name: 'Order intake automation',
            desc: 'Auto-capture orders from email/forms/API, validate data, and create production tickets.',
            status: 'active',
            tags: ['integration', 'priority'],
          },
          {
            name: 'Inventory tracking system',
            desc: 'Real-time stock levels with auto-reorder triggers, supplier notifications, and demand forecasting.',
            status: 'active',
            tags: ['backend', 'data'],
          },
          {
            name: 'Quality control checkpoints',
            desc: 'Automated QC forms at each production stage with photo capture, defect logging, and escalation.',
            status: 'upcoming',
            tags: ['quality'],
          },
          {
            name: 'Production scheduling engine',
            desc: 'AI-optimized job scheduling based on capacity, priority, deadlines, and material availability.',
            status: 'upcoming',
            tags: ['ai', 'priority'],
          },
        ],
      },
      {
        title: 'Integration & Intelligence',
        timeline: 'Month 4–5',
        milestones: [
          {
            name: 'Dashboard & analytics',
            desc: 'Real-time production KPI dashboard — throughput, defect rates, cycle time, and utilization.',
            status: 'upcoming',
            tags: ['analytics'],
          },
          {
            name: 'Alert & notification system',
            desc: 'Smart alerts for delays, low stock, quality issues, and maintenance reminders via SMS/email/Slack.',
            status: 'upcoming',
            tags: ['comms'],
          },
          {
            name: 'Client portal integration',
            desc: 'Customer-facing order tracking with ETA updates, proof approvals, and delivery confirmation.',
            status: 'upcoming',
            tags: ['frontend', 'ux'],
          },
        ],
      },
      {
        title: 'Optimization & Scale',
        timeline: 'Month 6',
        milestones: [
          {
            name: 'Predictive maintenance',
            desc: 'ML-based equipment failure prediction using sensor data and maintenance history.',
            status: 'upcoming',
            tags: ['ai', 'advanced'],
          },
          {
            name: 'Cross-facility replication',
            desc: 'Templatize successful automations for deployment across multiple production sites.',
            status: 'upcoming',
            tags: ['scale'],
          },
        ],
      },
    ],
  },

  'sales': {
    id: 'sales',
    icon: '📈',
    title: 'Sales Accomplishment',
    heroTitle: 'Crush Every Sales Target',
    description: 'A structured approach to pipeline growth, client acquisition, and revenue milestones — turning strategy into measurable results.',
    colors: ['#10b981', '#22d3ee'],
    phases: [
      {
        title: 'Foundation & Pipeline Setup',
        timeline: 'Month 1',
        milestones: [
          {
            name: 'Define ICP & value proposition',
            desc: 'Crystal-clear Ideal Customer Profile, pain points mapping, and differentiated value messaging.',
            status: 'done',
            tags: ['strategy'],
          },
          {
            name: 'CRM & sales stack setup',
            desc: 'Configure CRM workflows, lead scoring, pipeline stages, and automated follow-up sequences.',
            status: 'done',
            tags: ['tools'],
          },
          {
            name: 'Content & collateral creation',
            desc: 'Case studies, pitch decks, one-pagers, and video demos tailored to each buyer persona.',
            status: 'active',
            tags: ['content', 'priority'],
          },
        ],
      },
      {
        title: 'Outreach & Lead Generation',
        timeline: 'Month 2–3',
        milestones: [
          {
            name: 'Cold outreach campaigns',
            desc: 'Multi-channel sequences (email + LinkedIn + phone) with A/B tested messaging and personalization.',
            status: 'active',
            tags: ['outreach'],
          },
          {
            name: 'Referral & partnership program',
            desc: 'Structured referral incentives and strategic partnerships with complementary service providers.',
            status: 'upcoming',
            tags: ['partnerships'],
          },
          {
            name: 'Inbound lead machine',
            desc: 'SEO-optimized landing pages, Google Ads campaigns, and lead magnet funnels driving qualified traffic.',
            status: 'upcoming',
            tags: ['marketing', 'priority'],
          },
          {
            name: 'First 10 paying customers',
            desc: 'Close initial deals, gather testimonials, and refine the sales process based on real conversations.',
            status: 'upcoming',
            tags: ['milestone', 'priority'],
          },
        ],
      },
      {
        title: 'Scale & Retention',
        timeline: 'Month 4–6',
        milestones: [
          {
            name: 'Sales playbook documentation',
            desc: 'Documented scripts, objection handling, pricing frameworks, and close techniques for team scaling.',
            status: 'upcoming',
            tags: ['process'],
          },
          {
            name: 'Upsell & cross-sell strategy',
            desc: 'Identify expansion opportunities within existing accounts — retainers, add-ons, premium tiers.',
            status: 'upcoming',
            tags: ['revenue'],
          },
          {
            name: 'Monthly recurring revenue target',
            desc: 'Hit $10K MRR through a mix of project-based and retainer clients with predictable billing.',
            status: 'upcoming',
            tags: ['milestone', 'priority'],
          },
          {
            name: 'Client success & retention program',
            desc: 'Quarterly business reviews, NPS tracking, and proactive check-ins to maximize lifetime value.',
            status: 'upcoming',
            tags: ['retention'],
          },
        ],
      },
    ],
  },

  'productivity': {
    id: 'productivity',
    icon: '🎯',
    title: 'Personal Productivity',
    heroTitle: 'Master Your Time & Energy',
    description: 'A systematic approach to personal effectiveness — optimizing daily routines, deep work habits, and life-work integration for peak performance.',
    colors: ['#ec4899', '#f472b6'],
    phases: [
      {
        title: 'Audit & System Design',
        timeline: 'Week 1–2',
        milestones: [
          {
            name: 'Time audit & energy mapping',
            desc: 'Track every hour for 7 days — identify peak energy windows, time sinks, and recovery patterns.',
            status: 'done',
            tags: ['analysis'],
          },
          {
            name: 'Productivity stack selection',
            desc: 'Choose and configure tools — task manager, calendar blocking, note system, and focus tracker.',
            status: 'done',
            tags: ['tools'],
          },
          {
            name: 'Weekly review template',
            desc: 'Create a structured weekly review covering wins, lessons, metrics, and next-week priorities.',
            status: 'done',
            tags: ['process'],
          },
        ],
      },
      {
        title: 'Deep Work & Routines',
        timeline: 'Week 3–6',
        milestones: [
          {
            name: 'Morning power routine',
            desc: 'Consistent 90-minute morning block — exercise, learning, and top-priority deep work before distractions.',
            status: 'active',
            tags: ['habit', 'priority'],
          },
          {
            name: 'Deep work blocks (4hrs/day)',
            desc: 'Protect 2×2-hour blocks daily for focused, uninterrupted creative and strategic work.',
            status: 'active',
            tags: ['focus', 'priority'],
          },
          {
            name: 'Communication batching',
            desc: 'Process email/messages in 3 fixed windows — eliminate reactive, interrupt-driven work patterns.',
            status: 'upcoming',
            tags: ['efficiency'],
          },
          {
            name: 'Learning hour (daily)',
            desc: 'Dedicated hour for skill development — courses, reading, or deliberate practice in key areas.',
            status: 'upcoming',
            tags: ['growth'],
          },
        ],
      },
      {
        title: 'Optimization & Mastery',
        timeline: 'Week 7–12',
        milestones: [
          {
            name: 'Automate recurring decisions',
            desc: 'Create templates, checklists, and SOPs for repetitive decisions — free cognitive bandwidth for high-value thinking.',
            status: 'upcoming',
            tags: ['automation'],
          },
          {
            name: 'Energy management system',
            desc: 'Match task types to energy levels — creative work at peak, admin at low, social in between.',
            status: 'upcoming',
            tags: ['health'],
          },
          {
            name: '90-day review & course-correct',
            desc: 'Comprehensive retrospective on habits, metrics, and outcomes — adjust the system based on real data.',
            status: 'upcoming',
            tags: ['review', 'priority'],
          },
          {
            name: 'Teach & share the system',
            desc: 'Document your productivity system — teaching forces clarity and helps others level up.',
            status: 'upcoming',
            tags: ['sharing'],
          },
        ],
      },
    ],
  },
};
