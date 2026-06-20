# 日本語トレーナー — Japanese Vocabulary Trainer

A flashcard-based web app for learning Japanese. Built with React and deployable via Docker.

## Features

| Lesson | Characters | Content |
|---|---|---|
| **Numbers** | 14 cards | 0 – 10,000 (零, 一, 二 … 万) |
| **Hiragana** | 46 cards | Full hiragana syllabary (あ, い, う … ん) |
| **Katakana** | 46 cards | Full katakana syllabary (ア, イ, ウ … ン) |

### How it works

- Tap a card to reveal its reading and meaning
- Mark it as **correct** or **wrong**
- Wrong cards reappear in the same session until you get them right
- A progress bar tracks how many cards you've answered correctly
- Cards are shuffled randomly each session

## Quick Start

### Docker

```bash
docker build -t japanisch-trainer .
docker run -p 8080:80 japanisch-trainer
```

Open [http://localhost:8080](http://localhost:8080).

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Tech Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- nginx (production container)
