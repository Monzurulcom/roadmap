/* =============================================
   WebnWell Roadmap — Data
   ============================================= */

window.ROADMAP_DATA = {
  'vibe-coding': {
    id: 'vibe-coding',
    icon: '⚡',
    title: 'Vibe Coding App',
    heroTitle: 'Build the Future of Vibe Coding',
    description: 'A creative coding platform that makes development feel effortless — AI-assisted, visually driven, and delightfully intuitive.',
    colors: ['#6366f1', '#a78bfa'],
    phases: [
      {
        title: 'Foundation & Core Architecture',
        timeline: 'Month 1–2',
        milestones: [
          {
            name: 'Project scaffold & tech stack finalization',
            desc: 'Set up monorepo, CI/CD pipeline, and core framework decisions (Next.js + Node.js + SQLite).',
            status: 'done',
            tags: ['infra', 'devops'],
          },
          {
            name: 'AI integration layer',
            desc: 'Build the abstraction layer for LLM interactions — prompt orchestration, context management, and response streaming.',
            status: 'done',
            tags: ['ai', 'backend'],
          },
          {
            name: 'Authentication & user management',
            desc: 'OAuth + credential-based login, role-based access, and session management.',
            status: 'active',
            tags: ['security', 'priority'],
          },
          {
            name: 'Core editor with syntax highlighting',
            desc: 'Monaco-based code editor with custom themes, multi-file support, and keyboard shortcuts.',
            status: 'upcoming',
            tags: ['frontend', 'ux'],
          },
        ],
      },
      {
        title: 'Intelligent Features',
        timeline: 'Month 3–4',
        milestones: [
          {
            name: 'AI code completion & suggestions',
            desc: 'Context-aware inline suggestions powered by GPT-4o with caching for frequently used patterns.',
            status: 'upcoming',
            tags: ['ai', 'priority'],
          },
          {
            name: 'Visual component builder',
            desc: 'Drag-and-drop UI builder that generates clean React/HTML code — bridging design and development.',
            status: 'upcoming',
            tags: ['frontend', 'ux'],
          },
          {
            name: 'Real-time collaboration',
            desc: 'WebSocket-based multi-cursor editing, presence indicators, and live chat within projects.',
            status: 'upcoming',
            tags: ['backend', 'collab'],
          },
          {
            name: 'Template marketplace',
            desc: 'Curated starter templates for common app types — landing pages, dashboards, e-commerce, and more.',
            status: 'upcoming',
            tags: ['content', 'community'],
          },
        ],
      },
      {
        title: 'Polish & Launch',
        timeline: 'Month 5–6',
        milestones: [
          {
            name: 'One-click deployment to cloud',
            desc: 'Deploy to Vercel/Netlify/custom servers with environment management and preview URLs.',
            status: 'upcoming',
            tags: ['devops'],
          },
          {
            name: 'Performance optimization',
            desc: 'Code splitting, lazy loading, edge caching, and sub-200ms response times for AI features.',
            status: 'upcoming',
            tags: ['performance'],
          },
          {
            name: 'Beta testing & user feedback',
            desc: 'Invite-only beta with structured feedback collection, analytics, and rapid iteration cycles.',
            status: 'upcoming',
            tags: ['testing'],
          },
          {
            name: 'Public launch',
            desc: 'Product Hunt launch, documentation site, onboarding tutorials, and marketing push.',
            status: 'upcoming',
            tags: ['launch', 'priority'],
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
