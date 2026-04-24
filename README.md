<div align="center">
  <a href="https://scriptingdestiny.com">
    <img width="1200" height="475" alt="Scripting Destiny Logo" src="https://github.com/WAILENGL/basic-bazi-calculator/blob/master/Logo.png" />
  </a>
</div>
# Scripting Destiny: Core Parameters (Basic BaZi)

A basic BaZi (Four Pillars of Destiny) calculator for my website <a href="https://scriptingdestiny.com">Scripting Destiny</a>. This tool is the basis for a Chinese Metaphysics analysis tool focusing on structural analysis, providing an immediate visual mapping of natal charts, luck cycles, and elemental relationships.

---

## 🛠 Core Features

- **Automated Gan-Zhi Calculation**: Real-time conversion of solar dates and times into the Four Pillars (Year, Month, Day, and Hour) using high-precision astronomical algorithms.
- **Ten God (Shi Shen) Mapping**: Dynamic identification of the "Useful Gods" and structural relationships based on the Day Master's element and polarity.
- **Luck Pillar Visualization**: Calculates the 10-year major luck cycles (Da Yun), including start ages and transition years.
- **Elemental Dashboard**: A specialized mapping area that categorizes all Heavenly Stems by element (Wood, Fire, Earth, Metal, Water) and polarity.
- **Hidden Stem Analysis**: Automatic breakdown of the "Hidden Stems" within each Earthly Branch for deep structural readings.

---

## 💻 Technical Stack

- **Framework**: [React](https://react.dev/) (Vite + TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a specialized dark-mode aesthetic.
- **Engine**: `lunar-typescript` for accurate metaphysical and astronomical calculations.
- **Typography**: Fira Code for a precise, technical "terminal" look.

---

## 🚀 Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone [https://github.com/your-username/scripting-destiny.git](https://github.com/your-username/scripting-destiny.git)
    cd scripting-destiny
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

---

## 📁 Project Structure

- **`App.tsx`**: The primary calculation engine, handling state management for birth data and rendering the dashboard.
- **`constants.ts`**: Classical metaphysical data definitions, including Heavenly Stems, Earthly Branches, and Five Element cycles.
- **`index.css`**: Custom Tailwind theme variables for "Elemental" color mapping (e.g., `--color-wood-yang`, `--color-fire-yin`).

---

**Note**: This project is a core component of the broader **Scripting Destiny** platform, aimed at bridging classical metaphysics with modern software engineering.
