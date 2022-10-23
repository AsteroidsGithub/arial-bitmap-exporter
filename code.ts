(async () => {
  const node = figma.currentPage.selection[0];

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
})();
