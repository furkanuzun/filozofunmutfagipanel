import connectToDatabase from "src/utils/dbConnection";
const { google } = require("googleapis");
const iap = require("in-app-purchase");
const { JWT } = require("google-auth-library");
const assert = require("assert");

const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "630b86cabfdc6840118b3b02852e2aef83b350d9";
const GOOGLE_SERVICE_ACCOUNT_EMAIL =
  "filozofun-mutfa@pc-api-7664654803839038687-469.iam.gserviceaccount.com";
const ANDROID_PACKAGE_NAME = "com.filozofunmutfagi";
const APPLE_SHARED_SECRET = "5d0a542098514289afc2a8597bae9df8";

google.options({
  auth: new JWT(GOOGLE_SERVICE_ACCOUNT_EMAIL, null, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, [
    "https://www.googleapis.com/auth/androidpublisher",
  ]),
});

const androidGoogleApi = google.androidpublisher({ version: "v3" });

const iapTestMode = true;
const androidPackageName = ANDROID_PACKAGE_NAME;

// https://www.appypie.com/faqs/how-can-i-get-shared-secret-key-for-in-app-purchase
iap.config({
  // If you want to exclude old transaction, set this to true. Default is false:
  appleExcludeOldTransactions: true,
  // this comes from iTunes Connect (You need this to valiate subscriptions):
  applePassword: APPLE_SHARED_SECRET,

  googleServiceAccount: {
    clientEmail: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  },

  /* Configurations all platforms */
  test: iapTestMode, // For Apple and Google Play to force Sandbox validation only
  // verbose: true, // Output debug logs to stdout stream
});

async function updateSubscription({
  app,
  environment,
  origTxId,
  userId,
  validationResponse,
  latestReceipt,
  startDate,
  endDate,
  productId,
  isCancelled,
  isExpired,
}) {
  const { db } = await connectToDatabase();
  const data = {
    app,
    environment,
    user_id: userId,
    orig_tx_id: origTxId,
    validation_response: JSON.stringify(validationResponse),
    latest_receipt: latestReceipt,
    start_date: startDate,
    end_date: endDate,
    product_id: productId,
    is_cancelled: isCancelled,
    is_expired: isExpired,
  };
  await db
    .collection("subscriptions")
    .updateOne({ orig_tx_id: origTxId }, { $set: data }, { upsert: true, multi: false });
  return data;
}

async function processPurchase(app, userId, receipt, newPurchase, product) {
  await iap.setup();
  const validationResponse = await iap.validate(receipt);

  console.log("--validationResponse", validationResponse);

  // Sanity check
  assert(
    (app === "android" && validationResponse.service === "google") ||
      (app === "ios" && validationResponse.service === "apple")
  );

  const purchaseData = iap.getPurchaseData(validationResponse);
  console.log("--purchaseData", purchaseData);
  const firstPurchaseItem = purchaseData[0];

  const isCancelled = iap.isCanceled(firstPurchaseItem);
  console.log("--isCancelled", isCancelled);
  const isExpired = iap.isExpired(firstPurchaseItem);
  console.log("--isExpired", isExpired);
  const { productId } = firstPurchaseItem;
  const origTxId =
    app === "ios" ? firstPurchaseItem.originalTransactionId : firstPurchaseItem.transactionId;
  const latestReceipt = app === "ios" ? validationResponse.latest_receipt : JSON.stringify(receipt);
  const startDate =
    app === "ios"
      ? new Date(firstPurchaseItem.originalPurchaseDateMs)
      : new Date(parseInt(firstPurchaseItem.startTimeMillis, 10));
  const endDate =
    app === "ios"
      ? new Date(firstPurchaseItem.expiresDateMs)
      : new Date(parseInt(firstPurchaseItem.expiryTimeMillis, 10));

  let environment = "";
  // validationResponse contains sandbox: true/false for Apple and Amazon
  // Android we don't know if it was a sandbox account
  if (app === "ios") {
    environment = validationResponse.sandbox ? "sandbox" : "production";
  }

  const result = await updateSubscription({
    userId,
    app,
    environment,
    productId,
    origTxId,
    latestReceipt,
    validationResponse,
    startDate,
    endDate,
    isCancelled,
    isExpired,
  });

  // From https://developer.android.com/google/play/billing/billing_library_overview:
  // You must acknowledge all purchases within three days.
  // Failure to properly acknowledge purchases results in those purchases being refunded.
  if (app === "android" && validationResponse.acknowledgementState === 0) {
    await androidGoogleApi.purchases.subscriptions.acknowledge({
      packageName: androidPackageName,
      subscriptionId: productId,
      token: receipt.purchaseToken,
    });
  }

  return result;
}

async function handler(req, res) {
  const { appType, purchase, product, newPurchase, userId } = req.body || {};

  assert(["ios", "android"].includes(appType));

  const receipt =
    appType === "ios"
      ? purchase.transactionReceipt
      : {
          packageName: androidPackageName,
          productId: purchase.productId,
          purchaseToken: purchase.purchaseToken,
          subscription: true,
        };

  const result = await processPurchase(appType, userId, receipt);
  const { db } = await connectToDatabase();

  const isPro = newPurchase ? true : result.is_expired || result.is_cancelled ? false : true;
  if (newPurchase) {
    const insertEarning = await db
      .collection("earnings")
      .insertOne({ userId, product, date: new Date() });
  }
  const editUser = await db.collection("users").updateOne(
    { id: userId },
    {
      $set: {
        isPro,
        currentSubscription: isPro ? product : null,
      },
    }
  );

  const user = await db.collection("users").findOne({ id: userId });
  res.status(200).json({ ...result, user });
  res.end();
}

export default handler;
