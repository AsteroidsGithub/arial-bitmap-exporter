(async () => {
  if (!figma.currentPage.selection[0]) return;

  // Prevents the plugin from remove data from the
  // original node
  var node = figma.currentPage.selection[0].clone();

  // Flatten everything that isn't already a base shape
  if (node.type !== "RECTANGLE") node = figma.flatten([node]);

  var tempBytes = await node.exportAsync({ format: "PNG" });
  var tempImage = figma.createImage(tempBytes);

  node.remove();

  var tempNode = figma.createRectangle();
  tempNode.fills = [
    { type: "IMAGE", imageHash: tempImage.hash, scaleMode: "FILL" },
  ];

  // Perform the appropriate transformation
  // to get a value that can be used easily
  if ("resize" in tempNode) tempNode.resize(8, 12);
  if ("rotation" in tempNode) tempNode.rotation = 0;

  // Exports the node as a encoded PNG
  const exportNode = await tempNode.exportAsync();

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
  figma.ui.postMessage(exportNode);

  // We need to remove the node because we created
  // it just to export the image
  tempNode.remove();
})();
