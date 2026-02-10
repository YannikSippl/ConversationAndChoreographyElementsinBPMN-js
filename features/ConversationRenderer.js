import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    remove as svgRemove
} from 'tiny-svg';


import { is } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import { getCirclePath } from 'bpmn-js/lib/draw/BpmnRenderUtil';

const HIGH_PRIORITY = 1500;

//register CustomRenderer at eventBus with high priority, so it will be used before the default renderer
export default class ConversationRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
    }
    // let base renderer draw the shape and then customize it if it's a ConversationNode
    drawShape(parentNode, element) {
        const shape = this.bpmnRenderer.drawShape(parentNode, element);

        if (is(element, 'conversation:ConversationNode')) {
            const hexagon = drawHexagon(parentNode, element); // new hexagon shape for ConversationNode
            prependTo(hexagon, parentNode);
            svgRemove(shape); // remove the default shape drawn by the base renderer

            console.log("Custom Renderer for ConversationNode called"); //testing 

            return shape;
        }
        return shape;
    }

    // use circle path for ConversationNode borders
    getShapePath(shape) {
        if (is(shape, 'conversation:ConversationNode')) {
            return getCirclePath(shape);
        }
    }
}

// inject dependencies
ConversationRenderer.$inject = ['eventBus', 'bpmnRenderer'];


function drawHexagon(parentNode, element) {
    const hexagon = svgCreate('polygon');

    const points = widthHeightToPoints(element.x, element.y, element.width, element.height);
    svgAttr(hexagon, {
        points,
        fill: '#1302fa',
        stroke: '#0f0475',
        strokeWidth: 2
    })

    svgAppend(parentNode, hexagon);

    return hexagon;
};

// ----- helper functions -----

//helper for creating the points for  a hexagon shape
function widthHeightToPoints(x, y, width, height) {
    const points = [
        { x: x + width / 2, y: y + 0 },
        { x: x + width, y: y + height / 4 },
        { x: x + width, y: y + (3 * height) / 4 },
        { x: x + width / 2, y: y + height },
        { x: x + 0, y: y + (3 * height) / 4 },
        { x: x + 0, y: y + height / 4 }
    ]
    return points.map(p => `${p.x},${p.y}`).join(' ');
};

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// new Node is behind all other children of parentNode, so it will be drawn first'
//makes sure the new shape is not drawn on top labels etc. 
function prependTo(newNode, parentNode, siblingNode) {
    parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild);
}


