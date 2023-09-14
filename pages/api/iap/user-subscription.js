import connectToDatabase from "../../../src/utils/dbConnection";

// OK
async function getUserSubscription(userId, appType) {
  const { db } = await connectToDatabase();
  if (!appType) return undefined;

  const row = await db.collection("subscriptions").find({ _id: userId, app: appType }).toArray()[0];

  if (!row) return undefined;

  return {
    startDate: row.start_date,
    endDate: row.end_date,
    productId: row.product_id,
    isCancelled: !!row.is_cancelled,
    type: "iap",
  };
}

function checkIfHasSubscription(subscription) {
  if (!subscription) return false;
  if (subscription.isCancelled) return false;
  const nowMs = new Date().getTime();
  return (
    moment(subscription.startDate).valueOf() <= nowMs &&
    moment(subscription.endDate).valueOf() >= nowMs
  ); // TODO grace period?
}

async function handler(req, res) {
  const { userId } = req;
  const { appType } = req.params;

  const subscription = await getUserSubscription(userId, appType);
  res.status(201).json({
    subscription,
    hasSubscription: checkIfHasSubscription(subscription),
  });
  res.end();
}

export default handler;
