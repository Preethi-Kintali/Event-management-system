import { PaymentsRepository } from './server/src/repositories/payments.repository';
async function main() {
  const t = await PaymentsRepository.getManagerTransactions("df900947-eff9-45d7-a0b7-925f6e61912f");
  console.log(JSON.stringify(t, null, 2));
}
main();
