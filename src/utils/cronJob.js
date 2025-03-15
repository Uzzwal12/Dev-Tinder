const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequest = require("../models/connectionRequest");
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const connections = await connectionRequest
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");

    console.log(connections);

    const listOfEmails = Array.from(
      new Set(connections.map((item) => item.toUserId.email))
    );

    for (const email of listOfEmails) {
      await sendEmail.run(`A connection request from ${email} is pending`);
    }
  } catch (error) {
    console.log("Error", error);
  }
});
