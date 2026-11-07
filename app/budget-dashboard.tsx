"use client";

import { type FormEvent, useState } from "react";

type Category = {
  name: string;
  shortName: string;
  budget: number;
  spent: number;
  color: string;
};

type Expense = {
  id: number;
  vendor: string;
  category: string;
  amount: number;
  date: string;
  initials: string;
};

const initialCategories: Category[] = [
  { name: "Cloud & infrastructure", shortName: "Cloud", budget: 7800, spent: 4700, color: "blue" },
  { name: "Software & SaaS", shortName: "Software", budget: 4200, spent: 2140, color: "purple" },
  { name: "Hardware", shortName: "Hardware", budget: 3500, spent: 3050, color: "orange" },
  { name: "Security & IT", shortName: "Security", budget: 2600, spent: 1720, color: "green" },
];

const initialExpenses: Expense[] = [
  {
    id: 1,
    vendor: "Amazon Web Services",
    category: "Cloud",
    amount: 3240,
    date: "Oct 24",
    initials: "A",
  },
  {
    id: 2,
    vendor: "Dell Technologies",
    category: "Hardware",
    amount: 1800,
    date: "Oct 22",
    initials: "D",
  },
  { id: 3, vendor: "GitHub", category: "Software", amount: 1160, date: "Oct 21", initials: "G" },
  {
    id: 4,
    vendor: "Microsoft Azure",
    category: "Cloud",
    amount: 1460,
    date: "Oct 18",
    initials: "M",
  },
  { id: 5, vendor: "Okta", category: "Security", amount: 1080, date: "Oct 16", initials: "O" },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function BudgetDashboard() {
  const [categories, setCategories] = useState(initialCategories);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const budget = categories.reduce((total, category) => total + category.budget, 0);
  const spent = categories.reduce((total, category) => total + category.spent, 0);
  const remaining = budget - spent;
  const percentUsed = Math.round((spent / budget) * 100);

  function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryName = String(formData.get("category"));
    const vendor = String(formData.get("vendor")).trim();
    const amount = Number(formData.get("amount"));
    const category = categories.find((item) => item.shortName === categoryName);

    if (!category || !vendor || !Number.isFinite(amount) || amount <= 0) return;

    const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
      new Date(),
    );
    setCategories((current) =>
      current.map((item) =>
        item.shortName === categoryName ? { ...item, spent: item.spent + amount } : item,
      ),
    );
    setExpenses((current) => [
      {
        id: Date.now(),
        vendor,
        category: categoryName,
        amount,
        date,
        initials: vendor.charAt(0).toUpperCase(),
      },
      ...current,
    ]);
    setIsAddingExpense(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="Herd home">
          <span className="brand-mark">h</span>
          <span>herd</span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#overview">
            <span className="nav-icon">◫</span> Overview
          </a>
          <a className="nav-item" href="#systems">
            <span className="nav-icon">⌘</span> Systems
          </a>
          <a className="nav-item" href="#transactions">
            <span className="nav-icon">↗</span> Transactions
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">?</span>
            <div>
              <strong>Need a hand?</strong>
              <span>Visit our help center</span>
            </div>
            <span className="help-arrow">↗</span>
          </div>
          <div className="profile">
            <div className="avatar">JD</div>
            <div className="profile-copy">
              <strong>Jordan Davis</strong>
              <span>IT Administrator</span>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> Overview
          </div>
          <div className="topbar-actions">
            <span className="period-label">
              <span className="calendar-icon">▦</span> October 2025{" "}
              <span className="chevron">⌄</span>
            </span>
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="Notifications"
            >
              ♧<i />
            </button>
            <div className="avatar top-avatar">JD</div>
          </div>
        </header>

        <section className="page-intro">
          <div>
            <p className="eyebrow">MONDAY, OCTOBER 27, 2025</p>
            <h1>IT budget overview</h1>
            <p className="intro-copy">
              A clear view of where your technology budget stands this month.
            </p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsAddingExpense(true)}>
            <span>＋</span> Add expense
          </button>
        </section>

        <section className="summary-grid" aria-label="Budget summary">
          <article className="summary-card">
            <div className="summary-label">
              Monthly budget <span className="metric-dot dot-blue" />
            </div>
            <div className="summary-value">{currency.format(budget)}</div>
            <div className="summary-foot">
              <span className="muted">Across 4 IT systems</span>
            </div>
          </article>
          <article className="summary-card">
            <div className="summary-label">
              Total spent <span className="metric-dot dot-purple" />
            </div>
            <div className="summary-value">{currency.format(spent)}</div>
            <div className="summary-foot">
              <span className="trend-up">↗ 8.2%</span>
              <span className="muted"> vs. last month</span>
            </div>
          </article>
          <article className="summary-card">
            <div className="summary-label">
              Remaining <span className="metric-dot dot-green" />
            </div>
            <div className="summary-value">{currency.format(remaining)}</div>
            <div className="summary-foot">
              <span className="muted">Available this month</span>
            </div>
          </article>
          <article className="summary-card usage-card">
            <div className="summary-label">
              Budget used <span className="metric-dot dot-orange" />
            </div>
            <div className="summary-value">
              {percentUsed}
              <span className="percent-sign">%</span>
            </div>
            <div className="progress-track">
              <span style={{ width: `${percentUsed}%` }} />
            </div>
            <div className="summary-foot">
              <span className="muted">On track for this month</span>
            </div>
          </article>
        </section>

        <div className="dashboard-grid">
          <section className="panel systems-panel" id="systems">
            <div className="panel-heading">
              <div>
                <h2>Budget by system</h2>
                <p>Track spend across your IT categories</p>
              </div>
              <button className="text-button" type="button">
                View all <span>→</span>
              </button>
            </div>
            <div className="system-list">
              {categories.map((category) => {
                const percentage = Math.round((category.spent / category.budget) * 100);
                return (
                  <article className="system-row" key={category.shortName}>
                    <div className={`system-icon ${category.color}`}>
                      {category.shortName === "Cloud"
                        ? "☁"
                        : category.shortName === "Software"
                          ? "▧"
                          : category.shortName === "Hardware"
                            ? "▣"
                            : "◇"}
                    </div>
                    <div className="system-main">
                      <div className="system-topline">
                        <strong>{category.name}</strong>
                        <span className={percentage >= 85 ? "near-limit" : ""}>
                          {percentage}% used
                        </span>
                      </div>
                      <div className="system-progress">
                        <span
                          className={category.color}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="system-amounts">
                        <strong>{currency.format(category.spent)}</strong>
                        <span>of {currency.format(category.budget)}</span>
                      </div>
                    </div>
                    <button
                      className="more-button"
                      type="button"
                      aria-label={`More options for ${category.name}`}
                    >
                      ···
                    </button>
                  </article>
                );
              })}
            </div>
            <div className="systems-footer">
              <span className="legend-dot" /> Budget usage{" "}
              <span className="footer-note">Updated just now</span>
            </div>
          </section>

          <section className="panel activity-panel" id="transactions">
            <div className="panel-heading">
              <div>
                <h2>Recent activity</h2>
                <p>Your latest IT expenses</p>
              </div>
              <button className="text-button" type="button">
                See all <span>→</span>
              </button>
            </div>
            <div className="activity-list">
              {expenses.slice(0, 5).map((expense) => (
                <article className="activity-row" key={expense.id}>
                  <div className={`vendor-mark vendor-${expense.initials.toLowerCase()}`}>
                    {expense.initials}
                  </div>
                  <div className="activity-main">
                    <strong>{expense.vendor}</strong>
                    <span>
                      {expense.category} <i>·</i> {expense.date}
                    </span>
                  </div>
                  <strong className="expense-amount">−{currency.format(expense.amount)}</strong>
                </article>
              ))}
            </div>
            <button
              className="activity-link"
              onClick={() => setIsAddingExpense(true)}
              type="button"
            >
              <span>＋</span> Add a new expense
            </button>
          </section>
        </div>

        <footer className="page-footer">
          <span>© 2025 Herd Budget</span>
          <span>
            Made for IT teams <span className="footer-heart">♥</span>
          </span>
        </footer>
      </main>

      {isAddingExpense && (
        <div className="modal-backdrop">
          <section
            className="expense-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="dialog-heading">
              <div>
                <p className="eyebrow">OCTOBER 2025</p>
                <h2 id="dialog-title">Add an expense</h2>
                <p>Keep your IT budget up to date.</p>
              </div>
              <button
                className="close-button"
                type="button"
                onClick={() => setIsAddingExpense(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <form onSubmit={addExpense}>
              <label>
                Vendor
                <input name="vendor" placeholder="e.g. Datadog" required />
              </label>
              <label>
                System
                <select name="category" defaultValue="Cloud">
                  {categories.map((category) => (
                    <option value={category.shortName} key={category.shortName}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Amount
                <div className="amount-input">
                  <span>$</span>
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </label>
              <div className="dialog-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Save expense
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
