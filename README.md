# EMarket

用于展示电商工程实践的 Next.js 项目。当前仓库已完成 Day 1 基础设施：TypeScript + App Router + Tailwind 基础接入、PostgreSQL 容器、Prisma 数据模型、种子数据，以及提交前代码质量检查。

## Day 1 目标

- `pnpm dev` 可以启动应用
- `docker compose up -d db` 可以一键拉起本地 PostgreSQL
- Prisma schema 已覆盖用户、商品、购物车、订单、订单项
- `pnpm db:seed` 会填充 10 个测试商品
- Git commit 前会自动运行 `lint-staged`

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL 16
- ESLint + Prettier
- Husky + lint-staged
- pnpm

## 数据库设计要点

- 金额字段统一使用 `Int`，单位为分，避免浮点精度问题
- 主键统一使用 UUID，避免暴露业务增长规律
- `Product` 与 `User` 支持软删除字段
- `OrderItem.priceAtPurchase` 保存下单时价格快照
- 全表保留 `createdAt` 与 `updatedAt`
- `Product.name`、`Order(userId, createdAt)`、`CartItem(userId, productId)` 建立索引或唯一约束

核心 schema 位于 [`prisma/schema.prisma`](/D:/_Develop/js/EMarket/prisma/schema.prisma)。

## 本地启动

1. 安装 Node.js 22+ 和 pnpm
2. 复制环境变量：`cp .env.example .env`
3. 安装依赖：`pnpm install`
4. 启动数据库：`docker compose up -d db`
5. 生成 Prisma Client：`pnpm db:generate`
6. 执行迁移：`pnpm db:migrate`
7. 初始化数据：`pnpm db:seed`
8. 启动应用：`pnpm dev`

## 提交前检查

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`

安装依赖后执行一次 `pnpm prepare`，会启用 `.husky/pre-commit`，之后每次提交都会通过 `lint-staged` 对暂存文件执行 ESLint 和 Prettier。

## 当前种子数据

- 2 个用户：1 个管理员，1 个普通用户
- 10 个测试商品
- 1 条购物车测试数据

## 下一步

Day 2 再进入 API 层：标准化响应结构、Zod DTO、商品列表接口和错误处理。
