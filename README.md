
## Getting Started

Installing all dependencies 

```bash
npm install
# or
yarn install
# or
pnpm instal
# or
bun install
```

Configuirate the file .env.example 

DATABASE_URL : 

example using postgresql : 

```bash
DATABASE_URL="postgresql://janedoe:mypassword@localhost:26257/mydb?schema=public"
```

you can use another provider like mysql, mongodb or etc,

you just change the provider in the file schema.prisma

``` bash
datasource db {
  provider = "postgresql" => use your provider
  url      = env("DATABASE_URL")
}
```

run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

