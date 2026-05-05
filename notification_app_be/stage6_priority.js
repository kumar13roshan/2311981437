const { getPriorityInbox, sortPriorityInbox } = require('./services/priorityInboxService');

async function main() {
  const studentId = process.argv[2] || 1042;
  const notifications = await getPriorityInbox(studentId);
  console.log(JSON.stringify({ notifications }, null, 2));
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = {
  getPriorityInbox,
  sortPriorityInbox,
};

