const PDFDocument = require("pdfkit");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: "us-east-2",
  AWS_SDK_LOAD_CONFIG: 1,
});
const s3 = new aws.S3();

const createInvoice = async (invoice, orderId, store) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, store);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  //   doc.pipe(fs.createWriteStream("invoice.pdf"));
  var params = {
    key: `${Date.now() + "invoice.pdf"}`,
    Body: doc,
    bucket: "apply-to-usman/pdfs",
    contentType: "application/pdf",
    Bucket: "apply-to-usman",
    // Specify the name of the new object. For example, 'index.html'.
    // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    Key: "pdfs/" + Date.now() + "invoice.pdf",
    // Content of the new object.
    // Body: "This is a test text",
  };
  let fileToSend;
  //notice use of the upload function, not the putObject function
  try {
    const upload = await s3.upload(params).promise();
    fileToSend = upload.Location;
    return fileToSend;
  } catch (error) {
    console.log("error", error);
  }

  return fileToSend;
};

function generateHeader(doc, store) {
  doc
    // .image("../../images/monalydashboardlogo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    //   .text("ACME Inc.", 110, 57)
    .text(store.name, 50, 57)
    .fontSize(10)
    .text(store.name, 200, 50, { align: "right" })
    .text(store.address, 200, 65, { align: "right" })
    .text(store.city + store.country, 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;
  const address = invoice.shipping.address ? invoice.shipping.address : "";
  const city = invoice.shipping.city ? invoice.shipping.city : "";
  const state = invoice.shipping.state ? invoice.shipping.state : "";
  const country = invoice.shipping.country ? invoice.shipping.country : "";

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(address, 300, customerInformationTop + 15)
    .text(
      city + ", " + state + ", " + country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc.fontSize(10).text("Thank you for your business.", 50, 780, {
    align: "center",
    width: 500,
  });
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "NGN" + cents.toFixed(2);
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoice,
};
