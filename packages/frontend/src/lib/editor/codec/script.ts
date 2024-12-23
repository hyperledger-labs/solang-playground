import Queue from "./queue";

async function main() {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);

  console.log(await queue.next());
  console.log(await queue.next());
}

main();
