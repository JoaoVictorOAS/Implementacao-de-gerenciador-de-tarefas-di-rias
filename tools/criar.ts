import { prisma } from '../lib/prisma.js'
async function main() {
  const novoProduto = await prisma.produto.create({
    data: {
      nome: 'Produto Exemplo',
      quantidade: 10,
    },
  })
  console.log(novoProduto)
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })