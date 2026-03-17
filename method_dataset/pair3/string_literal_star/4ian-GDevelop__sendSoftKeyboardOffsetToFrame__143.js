const sendSoftKeyboardOffsetToFrame = async (offset: number) => {
  // $FlowFixMe - we know it's an iframe.
  const iframe: ?HTMLIFrameElement = document.getElementById(
    GAMES_PLATFORM_IFRAME_ID
  );
  if (!iframe || !iframe.contentWindow) {
    return;
  }

  try {
    iframe.contentWindow.postMessage(
      {
        type: 'setKeyboardOffset',
        value: offset,
      },
      '*'
    );
  } catch (error) {
    console.error('Error while sending keyboard offset to frame.', error);
    return;
  }
};
