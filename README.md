# Sudoku 1vs1

A real-time multiplayer Sudoku game where players can compete against each other to solve puzzles faster. Built with Nuxt 3, Tailwind CSS, and Pocketbase.

## 🎮 Features

- Real-time 1vs1 Sudoku gameplay
- User authentication and profiles
- Matchmaking system
- Leaderboards
- Responsive design for all devices
- Multiple difficulty levels

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Pocketbase account

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sudoku-1vs1.git
   cd sudoku-1vs1
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Pocketbase:
   - Create an Pocketbase project
   - Set up collections according to the database schema in [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)
   - Create necessary indexes for efficient queries
   - Configure authentication methods

4. Create `.env` file (use `.env.example` as a template):
   ```
   Pocketbase=https://your-Pocketbase-endpoint
   ```

5. Start development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
sudoku-1vs1/
├── components/          # Reusable Vue components
│   ├── SudokuBoard.vue  # Main game board component
│   ├── SudokuCell.vue   # Individual cell component
│   └── ...              # Other components
├── composables/         # Vue composables for reusable logic
├── layouts/             # Layout components
├── pages/               # Application pages and routes
├── public/              # Static assets
├── server/              # Server middleware
├── stores/              # Pinia stores
├── utils/               # Utility functions
├── app.vue              # Main application component
├── nuxt.config.ts       # Nuxt configuration
└── ...                  # Config files, etc.
```

## 📋 Project Management

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Overall project plan and timeline
- [TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md) - Technical specifications and architecture

## 🧩 Game Logic

The game implements standard Sudoku rules:
- Each row must contain each number from 1-9 without repetition
- Each column must contain each number from 1-9 without repetition
- Each 3×3 box must contain each number from 1-9 without repetition

The multiplayer aspect adds:
- Same puzzle for both players
- Real-time progress tracking
- First player to correctly complete the puzzle wins
- Error tracking and penalties

## 🧪 Testing

Run tests with:
```bash
npm run test
# or
yarn test
```

## 🚢 Deployment

The application can be deployed using:

```bash
npm run build
npm run generate
# or
yarn build
yarn generate
```

See the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📝 Acknowledgments

- [Nuxt](https://nuxt.com/)
- [Vue](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pocketbase](https://Pocketbase.io/)
