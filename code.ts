figma.currentPage.selection.forEach(async (node) => {
  // If node is not a vector, text or rectangel, skip it
  if (!node || !node.type.match(/^(VECTOR|TEXT|RECTANGLE)$/)) return;

  if (node.type === "TEXT") {
    // If node is a text, convert it to a vector
    node = figma.flatten([node]);
  }

  let tempBytes = await node.exportAsync({ format: "PNG" });
  let temImage = figma.createImage(tempBytes);
  node = figma.createRectangle();
  node.fills = [{ type: "IMAGE", imageHash: temImage.hash, scaleMode: "FILL" }];

  // Perform the appropriate transformation
  // to get a value that can be used easily
  if ("resize" in node) node.resize(8, 12);
  if ("rotation" in node) node.rotation = 0;

  // Exports the node as a encoded PNG
  const image = await node.exportAsync();

  // Create an invisible iframe to act as a "worker" which
  // will do the task of decoding and send us a message
  // when it's done.
  figma.showUI(__html__, {
    themeColors: true,
    title: "Arial Bitmap Exporter",
    height: 500,
    visible: true,
  });

  // Send the raw bytes of the file to the worker.
  figma.ui.postMessage(image);

  // We need to remove the node because we created
  // it just to export the image
  node.remove();
});
