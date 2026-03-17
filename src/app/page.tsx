export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">Day 1</span>
        <h1>EMarket Foundation</h1>
        <p>
          Next.js + TypeScript + Prisma + PostgreSQL with a schema, seed data, Docker
          bootstrap, and pre-commit quality gates.
        </p>
      </section>
      <section className="card-grid">
        <article className="card">
          <h2>Infrastructure</h2>
          <p>`docker compose up -d db` starts PostgreSQL for local development.</p>
        </article>
        <article className="card">
          <h2>Database</h2>
          <p>Prisma models cover users, products, cart items, orders, and order items.</p>
        </article>
        <article className="card">
          <h2>Quality Gates</h2>
          <p>Husky + lint-staged run lint and format checks before commits land.</p>
        </article>
      </section>
    </main>
  );
}
