# 🦸 EMI Calculator — Built for Digital Heroes

A premium, production-ready EMI (Equated Monthly Installment) Calculator built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

🔗 **[Live Demo →](https://digitalheroesco.com)**

---

## ✨ Features

- **Instant EMI Calculation** — Real-time results as you adjust sliders
- **Amortization Schedule** — Full month-by-month and year-by-year breakdown
- **Visual Charts** — Donut pie chart + stacked bar chart powered by Recharts
- **Loan Comparison** — Compare up to 5 loan scenarios side-by-side
- **Mobile Responsive** — Fully optimised for phones, tablets, and desktops
- **Dark Theme** — Premium glassmorphism UI with smooth animations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Main page (tabs + footer)
│   └── globals.css         # Design system + mobile styles
├── components/
│   ├── LoanInputPanel.tsx  # Sliders + number inputs
│   ├── ResultsSummary.tsx  # Animated EMI card + stat cards
│   ├── PieBreakdown.tsx    # Donut chart
│   ├── AmortizationChart.tsx  # Yearly bar chart
│   ├── AmortizationTable.tsx  # Paginated schedule table
│   └── ComparisonMode.tsx     # Multi-scenario comparison
└── lib/
    └── emi.ts              # EMI formula + utilities
```

---

## 🧮 EMI Formula

```
EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)

P = Principal  |  r = Monthly rate (annual% ÷ 12 ÷ 100)  |  n = Tenure (months)
```

---

## 🛠️ Tech Stack

| Package | Version |
|---|---|
| Next.js | 16.2.9 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| Recharts | 3 |
| Framer Motion | 12 |
| Lucide React | 1.21 |

---

## ☁️ Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push this repository to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js — click **Deploy**

No environment variables required.

---

## 👨‍💻 Developer

**Rohit Buwala**
📧 your-email@example.com

---

*All EMI calculations are indicative. Actual EMI may vary based on bank policies.*
"# emi-calculator" 
