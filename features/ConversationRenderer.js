import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';


import { is } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

//register CustomRenderer at eventBus with high priority, so it will be used before the default renderer
export default class ConversationRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        const match = is(element, 'conversation:ConversationNode');
        return match;
    }

    // let base renderer draw the shape and then customize it if it's a ConversationNode
    drawShape(parentNode, element) {
        if (is(element, 'conversation:ConversationNode')) {
            const hexagon = drawHexagon(parentNode, element); // new hexagon shape for ConversationNode


            return hexagon;
        }
        //default fallback case 
        console.log("fallback triggered for" + element);
        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        return shape;
    }

    // use hexagon path for ConversationNode borders
    getShapePath(shape) {
        if (is(shape, 'conversation:ConversationNode')) {
            return getHexagonPath(shape);
        }
    }
}

// inject dependencies
ConversationRenderer.$inject = ['eventBus', 'bpmnRenderer'];




// ----- helper functions -----

//creating a hexagon shape for Conversation Nodes
function drawHexagon(parentNode, element) {
    const hexagon = svgCreate('polygon');

    const points = widthHeightToPoints(element.width, element.height);
    svgAttr(hexagon, {
        points,
        fill: '#1302fa',
        stroke: '#0f0475',
        strokeWidth: 2
    })

    svgAppend(parentNode, hexagon);

    return hexagon;
};

//helpers for creating the points for  a hexagon shape

//combines both helpers below
function widthHeightToPoints(width, height) {
    return widthHeightToPointObjects(width, height)
        .map(p => `${p.x},${p.y}`)
        .join(' ');
};

// returns 6 hexagon points as an object
function widthHeightToPointObjects(width, height) {
    const centerX = width / 2;
    const centerY = height / 2;

    // Regular flat-top hexagon: width = 2 * r, height = sqrt(3) * r
    const r = Math.min(width / 2, height / Math.sqrt(3));
    const dy = (Math.sqrt(3) / 2) * r;

    const points = [
        { x: centerX - r / 2, y: centerY - dy },
        { x: centerX + r / 2, y: centerY - dy },
        { x: centerX + r, y: centerY },
        { x: centerX + r / 2, y: centerY + dy },
        { x: centerX - r / 2, y: centerY + dy },
        { x: centerX - r, y: centerY }
    ];
    return points;
}

//creates a hexagon shape for hitmarking 
function getHexagonPath(shape) {
    const points = widthHeightToPointObjects(shape.width, shape.height);

    return [
        `M ${points[0].x},${points[0].y}`,
        `L ${points[1].x},${points[1].y}`,
        `L ${points[2].x},${points[2].y}`,
        `L ${points[3].x},${points[3].y}`,
        `L ${points[4].x},${points[4].y}`,
        `L ${points[5].x},${points[5].y}`,
        'Z'
    ].join(' ');
}

