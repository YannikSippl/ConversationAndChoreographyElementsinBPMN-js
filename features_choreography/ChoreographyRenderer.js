import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses,
    off
} from 'tiny-svg';
import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil.js';


const HIGH_PRIORITY = 1500;

//register CustomRenderer at eventBus with high priority, so it will be used before the default renderer
export default class ChoreographyRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, canvas, elementRegistry, textRenderer) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;
        this.textRenderer = textRenderer;


    }

    canRender(element) {
        if (element.labelTarget) {
            return false;
        }

        const match = isAny(element, ['choreography:ChoreographyTask', 'choreography:InitiatorMessage', 'choreography:ResponseMessage']);
        return match;
    }

    drawShape(parentNode, element) {
        if (isAny(element, ['choreography:ChoreographyTask'])) {
            const rectangle = drawChoreography(parentNode, element, this.textRenderer, 0.3);
            return rectangle;

        }

        if (isAny(element, ['choreography:InitiatorMessage', 'choreography:ResponseMessage'])) {
            const message = drawMessage(parentNode, element, this.textRenderer);
            return message;
        }
    }


    getShapePath(shape) {
        return getRoundRectPath(shape);
    }


}

// inject dependencies
ChoreographyRenderer.$inject = ['eventBus', 'bpmnRenderer', 'canvas', 'elementRegistry', 'textRenderer'];




// ----- helper functions -----

function drawMessage(parentNode, element,textRenderer) {
    const rectangle = svgCreate('rect');
    svgAttr(rectangle, {
        width: element.width,
        height: element.height,
        fill: '#84ff00',
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, rectangle);
    //drawEmbeddedLabel(parentNode, element, textRenderer, 0);
    return rectangle;
    
}
//creating a rectangle shape for the choreography task, which includes the initiator and non-initiator participants, as well as the embedded label
function drawChoreography(parentNode, element, textRenderer, offset) {
    drawInitiator(parentNode, element, textRenderer, offset); 
    drawNonInitiators(parentNode, element, textRenderer, offset); 

    const rectangle = svgCreate('rect');
    const size = element.height * 0.4;
    svgAttr(rectangle, {
        x: 0,
        y: element.height/2 - size/2,
        width: element.width,
        height: size,
        fill: '#a1abff',
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, rectangle);

    drawEmbeddedLabel(parentNode, element, textRenderer, 0 );

    const outline = svgCreate('rect');
    svgAttr(outline, {
        x: 0,
        y: 0,
        rx: 5,
        ry: 5,
        width: element.width,
        height: element.height,
        fill: 'none',
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, outline);
    
    return outline;
};





function drawEmbeddedLabel(parentNode, element, textRenderer, offset) {
    const label = element.businessObject?.name || '';

    const text = textRenderer.createText(label, {
        align: 'center-middle',
        box: {
            x: element.x,
            y: element.y,
            width: element.width,
            height: element.height + (offset * element.height) // adjust height for label position
        },
        padding: 7,
        style: {
            fill: '#000'
        }
    });
    svgClasses(text).add('djs-label');
    svgAppend(parentNode, text);

    
}

function drawInitiator(parentNode, element, textRenderer,offset){
    const initiator_label = element.businessObject?.initiatingParticipantRef?.name || 'Initiator';

    const size = element.height * 0.3;
    const text = textRenderer.createText(initiator_label,{
        align: 'center-middle',
        box: {
            x: element.x,
            y: element.y,
            width: element.width,
            height: size
        },
        padding: 7,
        style: {
            fill: '#000'
        }
    });
    const rectangle = svgCreate('rect');
    svgAttr(rectangle, {
        x: 0,
        y: 0,
        rx: 5,
        ry: 5,
        width: element.width,
        height: element.height / 3,
        fill: '#a1abff',
        stroke: '#000',
        strokeWidth: 2
    });
    svgAppend(parentNode, rectangle);

    svgClasses(text).add('djs-label');
    svgAppend(parentNode, text);

}

function drawNonInitiators(parentNode, element, textRenderer, offset){
    const nonInitiators = element.businessObject?.participantRef || [];
    
    const rectangle = svgCreate('rect');
    const size = element.height * 0.4;
    svgAttr(rectangle, {
        x: 0,
        y: element.height -  (element.height * 0.4),
        rx:5,
        ry:5,
        width: element.width,
        height: size,
        fill: '#b3b3b3',
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, rectangle);

    const nonInitiator = nonInitiators[0]?.name;

    const text = textRenderer.createText(nonInitiator,{
        align: 'center-middle',
        box: {
            x: element.x,
            y: element.y, 
            width: element.width,
            height: element.height * offset * 5.5
        },
        padding: 7,
        style: {
            fill: '#000'
        }
    });
    svgClasses(text).add('djs-label');
    svgAppend(parentNode, text);

    

}




