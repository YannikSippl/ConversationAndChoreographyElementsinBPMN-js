import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import { create as svgCreate, attr as svgAttr } from 'tiny-svg';

const OFFSET = 5;

export default function ConversationOutlineProvider(outline, styles) {
  this._styles = styles;
  outline.registerProvider(2000, this); // > default(1000)
}

ConversationOutlineProvider.$inject = [ 'outline', 'styles' ];

ConversationOutlineProvider.prototype.getOutline = function(element) {
  const OUTLINE_STYLE = this._styles.cls('djs-outline', [ 'no-fill' ]);

  if (isAny(element, [ 'conversation:ConversationNode' ])) {
    const outline = svgCreate('polygon');
    svgAttr(outline, { points: getHexPoints(element.width, element.height, OFFSET), ...OUTLINE_STYLE });
    return outline;
  }

  if (isAny(element, [ 'conversation:Participant' ])) {
    const outline = svgCreate('rect');
    svgAttr(outline, {
      x: -OFFSET, y: -OFFSET,
      width: element.width + OFFSET * 2,
      height: element.height + OFFSET * 2,
      rx: 0,
      ...OUTLINE_STYLE
    });
    return outline;
  }
};

ConversationOutlineProvider.prototype.updateOutline = function(element, outline) {
  if (isAny(element, [ 'conversation:ConversationNode' ]) && outline.tagName === 'polygon') {
    svgAttr(outline, { points: getHexPoints(element.width, element.height, OFFSET) });
    return true;
  }

  if (isAny(element, [ 'conversation:Participant' ]) && outline.tagName === 'rect') {
    svgAttr(outline, {
      x: -OFFSET, y: -OFFSET,
      width: element.width + OFFSET * 2,
      height: element.height + OFFSET * 2
    });
    return true;
  }

  return false;
};


// helper function to calculate hexagon points for Conversation Nodes
function getHexPoints(width, height, o = 0) {
  return [
    `${width * 0.25 - o},${-o}`,
    `${width * 0.75 + o},${-o}`,
    `${width + o},${height / 2}`,
    `${width * 0.75 + o},${height + o}`,
    `${width * 0.25 - o},${height + o}`,
    `${-o},${height / 2}`
  ].join(' ');
}
