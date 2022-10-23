figma.currentPage.selection.forEach(async (node) => {
  // Prevents the plugin from remove data from the
  // original node
  node = node.clone();

  // Flatten everything that isn't already a base shape
  if (node.type !== "RECTANGLE") node = figma.flatten([node]);

  let tempBytes = await node.exportAsync({ format: "PNG" });
  let temImage = figma.createImage(tempBytes);

  // Destroy the first temp node
  node.remove();

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
