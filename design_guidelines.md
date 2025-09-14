# FloatChat Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from scientific data platforms like Observable, Plotly Dash, and research visualization tools, combined with the clean aesthetics of ocean research institutions.

## Core Design Elements

### Color Palette
**Primary Colors:**
- Deep Ocean Blue: 220 85% 25% (primary brand color)
- Ocean Surface: 200 60% 45% (secondary)
- Arctic Ice: 190 15% 85% (light backgrounds)

**Accent Colors:**
- Coral Reef: 15 70% 55% (CTAs and highlights)
- Deep Current: 240 40% 15% (text and borders)

**Gradients:**
- Hero background: Subtle gradient from deep ocean blue to darker navy
- Data visualization backgrounds: Light ocean surface to arctic ice gradients
- Button hover states: Coral reef to warmer coral tones

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, scientific feel
- **Headings**: Inter 600-700 weight for hierarchy
- **Body**: Inter 400-500 for readability
- **Data/Code**: JetBrains Mono for technical content

### Layout System
**Tailwind Spacing**: Use units of 4, 8, 16, and 24 for consistent spacing
- Small gaps: p-4, m-4
- Medium sections: p-8, gap-8
- Large containers: p-16, space-y-16
- Hero sections: py-24

### Component Library

**Navigation:**
- Fixed header with ocean gradient background
- Minimal navigation with FloatChat logo and key sections
- Subtle shadow for depth

**Hero Section:**
- Full viewport height with ocean gradient background
- Large hero image: Underwater scene with floating research equipment
- Overlay with blurred background buttons (variant="outline")
- Compelling headline about ocean data exploration

**Interactive Map:**
- Leaflet integration with custom ocean-themed markers
- Dark blue map theme to match brand
- Floating data panels with rounded corners and subtle shadows

**Chat Interface:**
- Clean conversation bubbles with ocean-inspired styling
- User messages: Light arctic ice background
- AI responses: Subtle ocean surface background
- Smooth message animations

**Data Visualizations:**
- Chart.js graphs with ocean color schemes
- Deep ocean blues for depth data
- Temperature gradients from arctic ice to coral reef
- Clean grid lines and professional typography

**Cards and Panels:**
- Rounded corners (rounded-lg)
- Subtle shadows for depth
- Ocean-inspired hover effects
- Clean data presentation

### Images
**Hero Image**: Large oceanographic research vessel or underwater Argo float deployment scene - positioned as full-width background with overlay
**Feature Images**: Scientific equipment, ocean data visualizations, research team photos
**Icons**: Ocean-themed icons for features (waves, depth meters, temperature sensors)

### Animations
Minimal and purposeful:
- Gentle fade-ins for content sections
- Smooth map marker animations
- Subtle chart data loading animations
- Floating effects for Argo float markers

### Key Design Principles
1. **Scientific Credibility**: Professional, research-grade visual treatment
2. **Ocean Immersion**: Color palette and imagery evoke deep ocean exploration
3. **Data Clarity**: Clean, readable data presentation with strong hierarchy
4. **Interactive Engagement**: Smooth, responsive interactions that encourage exploration
5. **Accessibility**: High contrast ratios and clear navigation patterns