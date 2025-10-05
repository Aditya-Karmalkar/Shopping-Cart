# Simple Shopping Cart

![Shopping Cart Application](./public/Shopping%20Cart.png)

A modern, responsive e-commerce shopping cart application built with Next.js 15, TypeScript, and Tailwind CSS. This project demonstrates a complete shopping experience with product browsing, cart management, and checkout functionality.

## Features

### Core Functionality
- **Product Catalog**: Browse 8 different products with detailed information
- **Shopping Cart**: Add, remove, and modify quantities of items
- **Persistent Cart**: Cart contents saved to localStorage across sessions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Beautiful interface with smooth animations and transitions

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **API Routes**: RESTful endpoints for products and checkout
- **Component Architecture**: Reusable UI components with shadcn/ui
- **State Management**: Custom React hooks for cart functionality
- **Testing**: Comprehensive test suite for API endpoints

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd "Shopping Cart"
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Framer Motion**: Smooth animations
- **Radix UI**: Accessible component primitives

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **TypeScript**: Type-safe backend development

### Development Tools
- **ESLint**: Code linting
- **Jest**: Testing framework
- **Testing Library**: Component testing utilities

## API Endpoints

### GET `/api/products`
Returns a list of all available products.

**Response:**
```json
{
  "products": [
    {
      "id": "prod-basic-tee",
      "name": "Basic Tee",
      "description": "Soft cotton tee in classic fit.",
      "priceCents": 1900,
      "image": "https://...",
      "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
    }
  ]
}
```

### POST `/api/checkout`
Processes checkout with cart items.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod-basic-tee",
      "quantity": 2
    }
  ]
}
```

## Testing

Run the test suite:
```bash
npm test
# or
yarn test
# or
pnpm test
```

The project includes comprehensive tests for:
- API endpoints functionality
- Product data structure validation
- Cart operations
- TypeScript type safety

## UI Components

The project uses a modern component library built on:
- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built component variants
- **Lucide React**: Beautiful icons

## Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions
- Optimized performance across devices

## State Management

Cart state is managed through:
- Custom React hooks (`useCart`)
- localStorage persistence
- Real-time UI updates
- Cross-page synchronization

---
