import { prisma } from '../lib/prisma.js'

async function main() {
  const produtos = await prisma.produto.findMany()
  console.log(produtos)
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })