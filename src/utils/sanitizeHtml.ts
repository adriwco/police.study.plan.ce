const BLOCKED_TAGS = 'script, iframe, object, embed, form';

export const sanitizeHtmlTree = (root: ParentNode) => {
  root.querySelectorAll(BLOCKED_TAGS).forEach((element) => element.remove());
  root.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      const isEventHandler = name.startsWith('on');
      const isScriptUrl =
        (name === 'href' || name === 'src') && value.startsWith('javascript:');
      if (isEventHandler || isScriptUrl) element.removeAttribute(attribute.name);
    });
    if (
      element.tagName === 'A' &&
      /^https?:\/\//i.test(element.getAttribute('href') ?? '')
    ) {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });
};
