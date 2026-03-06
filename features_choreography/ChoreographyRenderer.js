import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses,
    off
} from 'tiny-svg';
import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import { getRectPath, getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil.js';


const HIGH_PRIORITY = 1500;

//register CustomRenderer at eventBus with high priority, so it will be used before the default renderer
export default class ChoreographyRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, textRenderer) {
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
            if(isAny(element, ['choreography:InitiatorMessage'])){
                const message = drawMessage(parentNode, element, this.textRenderer, '#a1abff');
                return message;
            }
            if(isAny(element, ['choreography:ResponseMessage'])){
                const message = drawMessage(parentNode, element, this.textRenderer, '#b3b3b3');
                return message;
            }
        }
    }


    getShapePath(shape) {
        if (isAny(shape, ['choreography:ChoreographyTask'])) {
            return getRoundRectPath(shape, 5);
        }

        if (isAny(shape, ['choreography:InitiatorMessage', 'choreography:ResponseMessage'])) {
            return getRectPath(shape);
        }

        return getRectPath(shape);
    }


}

// inject dependencies
ChoreographyRenderer.$inject = ['eventBus', 'bpmnRenderer', 'textRenderer'];




// ----- helper functions -----

function drawMessage(parentNode, element,textRenderer, color ) {
    const rectangle = svgCreate('rect');
    svgAttr(rectangle, {
        width: element.width,
        height: element.height,
        fill: color,
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, rectangle);
    
    const seperator1 = svgCreate('line');
    svgAttr(seperator1, {
        x1: 0,
        y1: element.height / 2,
        x2: element.width,
        y2: element.height / 2,
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, seperator1);

    const seperator2 = svgCreate('line');
    svgAttr(seperator2, {
        x1: element.width ,
        y1: 0,
        x2: element.width / 2,
        y2: element.height/2,
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, seperator2);

    const seperator3 = svgCreate('line');
    svgAttr(seperator3, {
        x1: 0,
        y1: 0,
        x2: element.width / 2,
        y2: element.height/2,
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, seperator3);
    return rectangle;
    
}
//creating a rectangle shape for the choreography task, which includes the initiator and responder participants
function drawChoreography(parentNode, element, textRenderer, offset) {
  
    drawMiddlePart(parentNode, element, textRenderer);
    drawInitiator(parentNode, element, textRenderer);
    drawResponder(parentNode, element, textRenderer);
    
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



function drawMiddlePart(parentNode, element, textRenderer){
    const middleRectangle = svgCreate('rect');

    const middleHeight = element.height/3;
    const middleY = element.height/2 - middleHeight/2;
    svgAttr(middleRectangle, {
        x: 0,
        y: middleY,
        width: element.width,
        height: middleHeight,
        fill: '#a1abff',
        stroke: '#000000',
        strokeWidth: 2
    });
    svgAppend(parentNode, middleRectangle);

    //draw label in the middle rectangle
    const label = element.businessObject?.name || '';
    console.log('Label for choreography task:', label);
    const text = textRenderer.createText(label, {
        align: 'center-middle',
        box: {
            width: element.width,
            height: middleHeight
        },
        padding: 7,
        style: {
            fill: '#000'
        }
    });
    svgAttr(text, {transform: `translate(0, ${middleY})`}); // position text in the middle rectangle    
    svgClasses(text).add('djs-label');
    svgAppend(parentNode, text);

    return middleRectangle;
}

function drawInitiator(parentNode, element, textRenderer){
    const initiator_label = element.businessObject?.initiatingParticipantRef?.name || 'Initiator';

    const initiatorRectangle = svgCreate('rect');
    svgAttr(initiatorRectangle, {
        x: 0,
        y: 0,
        width: element.width,
        height: element.height /3,
        fill: '#a1abff',
        stroke: '#000000',
        strokeWidth: 0
    });
    svgAppend(parentNode, initiatorRectangle);

    //draw label in the initiator rectangle
    const text = textRenderer.createText(initiator_label, {
        align: 'center-middle',
        box: {
            width: element.width,
            height: element.height /3
        },
        padding: 7,
        style: {
            fill: '#000'
        }
    });
    svgAppend(parentNode, text);
    svgClasses(text).add('djs-label');

    return initiatorRectangle;
}

function drawResponder(parentNode, element, textRenderer){
    const nonInitiators = element.businessObject?.participantRef || [];
    const responderRectangle = svgCreate('rect');
    const bottomY = element.height/2 + (element.height/6);
    const height = element.height/3;
    svgAttr(responderRectangle, {
        x: 0,
        y: bottomY,
        width: element.width,
        height: height,
        fill: '#b3b3b3',
        stroke: '#000000',
        strokeWidth: 0
    });
    svgAppend(parentNode, responderRectangle);

    //for each non-initiator participant, draw a seperator line and label
    const countResponders = nonInitiators.length ;
    console.log('Count of responders:', countResponders);
    const rowHeight = height / countResponders;
    for(let i = 0; i < nonInitiators.length; i++){
        let seperator = svgCreate('line');
        const seperatorY = bottomY + (i+1) * rowHeight;
        svgAttr(seperator, {
            x1: 0,
            y1: seperatorY,
            x2: element.width,
            y2: seperatorY,
            stroke: '#000000',
            strokeWidth: 1
        });
        svgAppend(parentNode, seperator);

        const responder_label = nonInitiators[i]?.name || `Responder ${i+1}`;
        const text = textRenderer.createText(responder_label, {
            align: 'center-middle',
            box: {
                width: element.width,
                height: rowHeight
            },
            padding: 7,
            style: {
                fill: '#000'
            }
        });
        svgAttr(text, {transform: `translate(0, ${bottomY + i*rowHeight})`}); // position text in the correct row    
        svgClasses(text).add('djs-label');
        svgAppend(parentNode, text);
    }
    

    return responderRectangle;
}



